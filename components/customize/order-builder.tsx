"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MockupCanvas, type DesignElement } from "@/components/customize/mockup-canvas";
import { DesignToolbar, type TextStyle } from "@/components/customize/design-toolbar";
import { CUSTOMIZE_FONT_CLASSNAMES, FONT_OPTIONS } from "@/lib/customize-fonts";
import { addToCart } from "@/lib/actions/cart.actions";
import { useCart } from "@/components/providers/cart-provider";
import VariantSelector from "@/components/product/variant-selector";
import ProductDetailsAccordion from "@/components/product/product-details-accordion";
import { CARE_INSTRUCTIONS, DELIVERY_INFO } from "@/lib/product-policy-content";
import { CustomizeTips } from "@/components/customize/customize-tips";
import { ShoppingCart, Zap, Minus, Plus, Check, MessageCircle } from "lucide-react";
import { setLastDesignCookie } from "@/lib/design-cookie";
import {
  saveDesign,
  uploadDesignImage,
  deleteDesignImage,
} from "@/lib/actions/design.actions";

interface Variant {
  id: string;
  size: string | null;
  color: string | null;
  material: string | null;
  sku: string;
  priceAdjustment: number;
  stock: number;
}

interface OrderBuilderProps {
  productId: string;
  productName: string;
  productSlug: string;
  productDescription: string | null;
  basePrice: number;
  customizationType: "IMAGE_ONLY" | "TEXT_ONLY" | "BOTH";
  mockupImageUrl: string | null;
  variants: Variant[];
  initialElements?: DesignElement[];
  initialDesignId?: string | null;
}

export function OrderBuilder(props: OrderBuilderProps) {
  const { refreshCart } = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [elements, setElements] = useState<DesignElement[]>(props.initialElements ?? []);
  const [designId, setDesignId] = useState<string | null>(props.initialDesignId ?? null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [defaultTextStyle, setDefaultTextStyle] = useState<TextStyle>({
    fontFamily: FONT_OPTIONS[0].value,
    fontSize: 20,
    color: "#4B1E6E",
    bold: false,
    italic: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const designIdRef = useRef<string | null>(props.initialDesignId ?? null);
  const isSavingDesignRef = useRef(false);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;
  const isTextSelected = selectedElement?.type === "text";
  const anyImageUploading = elements.some((el) => el.uploading);

  const activeTextStyle: TextStyle = isTextSelected
    ? {
        fontFamily: selectedElement!.fontFamily ?? defaultTextStyle.fontFamily,
        fontSize: selectedElement!.fontSize ?? defaultTextStyle.fontSize,
        color: selectedElement!.color ?? defaultTextStyle.color,
        bold: selectedElement!.bold ?? false,
        italic: selectedElement!.italic ?? false,
      }
    : defaultTextStyle;

  const needsText =
    props.customizationType === "TEXT_ONLY" || props.customizationType === "BOTH";
  const needsImage =
    props.customizationType === "IMAGE_ONLY" || props.customizationType === "BOTH";
  const hasText = elements.some(
    (el) => el.type === "text" && (el.content?.trim().length ?? 0) > 0
  );
  const hasImage = elements.some((el) => el.type === "image" && el.url);
  const designComplete = (!needsText || hasText) && (!needsImage || hasImage);

  const maxQty = selectedVariant ? Math.min(selectedVariant.stock, 50) : 0;
  const canOrder =
    !!selectedVariant &&
    selectedVariant.stock > 0 &&
    quantity >= 1 &&
    designComplete &&
    !anyImageUploading;

  function handleUpdateElement(id: string, updates: Partial<DesignElement>) {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  }

  function handleTextStyleChange(updates: Partial<TextStyle>) {
    if (isTextSelected && selectedId) {
      handleUpdateElement(selectedId, updates);
    } else {
      setDefaultTextStyle((prev) => ({ ...prev, ...updates }));
    }
  }

  function handleContentChange(content: string) {
    if (selectedId) handleUpdateElement(selectedId, { content });
  }

  function handleAddText() {
    const id = crypto.randomUUID();
    setElements((prev) => [
      ...prev,
      {
        id,
        type: "text",
        content: "Your Text",
        ...defaultTextStyle,
        xPercent: 30,
        yPercent: 40,
        widthPercent: 40,
        heightPercent: 15,
        rotation: 0,
      },
    ]);
    setSelectedId(id);
  }

  function handleAddImageClick() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    const localUrl = URL.createObjectURL(file);
    const id = crypto.randomUUID();

    setElements((prev) => [
      ...prev,
      {
        id,
        type: "image",
        url: localUrl,
        uploading: true,
        xPercent: 30,
        yPercent: 30,
        widthPercent: 35,
        heightPercent: 35,
        rotation: 0,
      },
    ]);
    setSelectedId(id);
    e.target.value = "";

    (async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadDesignImage(formData);

        if (!result.success) {
          setErrorMsg(result.error);
          setElements((prev) => prev.filter((el) => el.id !== id));
          URL.revokeObjectURL(localUrl);
          return;
        }

        if (result.data.lowResolutionWarning) {
          setErrorMsg(
            "⚠️ Ye image thodi low-resolution hai — print quality behtar rakhne ke liye zyada high-quality image use karein."
          );
        }

        setElements((prev) =>
          prev.map((el) =>
            el.id === id
              ? {
                  ...el,
                  url: result.data.url,
                  publicId: result.data.publicId,
                  uploading: false,
                }
              : el
          )
        );
        URL.revokeObjectURL(localUrl);
      } catch (err) {
        console.error("Image upload threw an error:", err);
        setErrorMsg("Image upload failed. Please try again.");
        setElements((prev) => prev.filter((el) => el.id !== id));
        URL.revokeObjectURL(localUrl);
      }
    })();
  }

  function handleDeleteSelected() {
    if (!selectedId) return;

    const toDelete = elements.find((el) => el.id === selectedId);
    if (toDelete?.type === "image" && toDelete.publicId && !toDelete.uploading) {
      // Background cleanup — UI removal doesn't wait on this.
      deleteDesignImage(toDelete.publicId).catch(() => {});
    }

    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }

  function handleVariantChange(variant: Variant | null) {
    setSelectedVariant((prev) => {
      if (prev?.id !== variant?.id) {
        setQuantity(1);
        setErrorMsg(null);
      }
      return variant;
    });
  }

  useEffect(() => {
    if (elements.length === 0) return;
    if (elements.some((el) => el.uploading)) return;

    const timeout = setTimeout(async () => {
      if (isSavingDesignRef.current) return;
      isSavingDesignRef.current = true;

      try {
        const result = await saveDesign({
          designId: designIdRef.current ?? undefined,
          productId: props.productId,
          elements,
        });

        if (result.success) {
          designIdRef.current = result.data.designId;
          setDesignId(result.data.designId);
          setLastDesignCookie(props.productId, result.data.designId);
        } else {
          console.error("Auto-save failed:", result.error);
        }
      } catch (err) {
        console.error("Auto-save threw an error:", err);
      } finally {
        isSavingDesignRef.current = false;
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [elements, props.productId]);

  async function persistDesign(): Promise<{ ok: boolean; designId: string | null }> {
    try {
      const result = await saveDesign({
        designId: designIdRef.current ?? undefined,
        productId: props.productId,
        elements,
      });

      if (!result.success) {
        setErrorMsg(result.error);
        return { ok: false, designId: null };
      }

      designIdRef.current = result.data.designId;
      setDesignId(result.data.designId);
      setLastDesignCookie(props.productId, result.data.designId);
      return { ok: true, designId: result.data.designId };
    } catch (err) {
      console.error("persistDesign threw an error:", err);
      setErrorMsg("Could not save your design. Please try again.");
      return { ok: false, designId: null };
    }
  }

  function handleAddToCart() {
    if (!selectedVariant || !designComplete) return;
    setErrorMsg(null);

    startTransition(async () => {
      const saved = await persistDesign();
      if (!saved.ok) return;

      const result = await addToCart({
        productId: props.productId,
        variantId: selectedVariant.id,
        quantity,
        designId: saved.designId ?? undefined,
        specialInstructions: specialInstructions.trim() || undefined,
      });

      if (result.success) {
        await refreshCart();
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
      } else {
        setErrorMsg(result.error || "Something went wrong. Please try again.");
      }
    });
  }

  function handleBuyNow() {
    if (!selectedVariant || !designComplete) return;
    setErrorMsg(null);

    startTransition(async () => {
      const saved = await persistDesign();
      if (!saved.ok) return;

      const params = new URLSearchParams({
        mode: "direct",
        productId: props.productId,
        variantId: selectedVariant.id,
        quantity: String(quantity),
      });
      if (saved.designId) params.set("designId", saved.designId);
      if (specialInstructions.trim())
        params.set("specialInstructions", specialInstructions.trim());

      router.push(`/checkout?${params.toString()}`);
    });
  }

  return (
    <div className={`mx-auto max-w-6xl px-4 py-8 ${CUSTOMIZE_FONT_CLASSNAMES}`}>
      <div className="mb-8">
        <SectionHeading
          title={`Customize Your Order`}
          subtitle="اپنی پسند سے ڈیزائن کریں"
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="lg:col-start-1 lg:row-start-1">
          <MockupCanvas
            mockupImageUrl={props.mockupImageUrl}
            elements={elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onUpdateElement={handleUpdateElement}
          />
        </div>

        <div className="space-y-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <DesignToolbar
            customizationType={props.customizationType}
            selectedElement={selectedElement}
            textStyle={activeTextStyle}
            onTextStyleChange={handleTextStyleChange}
            onContentChange={handleContentChange}
            onAddText={handleAddText}
            onAddImageClick={handleAddImageClick}
            onDeleteSelected={handleDeleteSelected}
          />

          <div className="space-y-5 rounded-xl border border-[color:var(--color-lavender)] bg-[color:var(--color-surface)] p-5">
            <p className="text-sm font-semibold text-[color:var(--color-primary)]">
              Complete Your Order
            </p>

            <VariantSelector
              variants={props.variants}
              basePrice={props.basePrice}
              onVariantChange={handleVariantChange}
            />

            {selectedVariant && selectedVariant.stock > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-[color:var(--color-text-dark)]">
                  Quantity
                </p>
                <div className="inline-flex items-center overflow-hidden rounded-lg border border-[color:var(--color-lavender)]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-[color:var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-[2.5rem] px-4 text-center text-sm font-medium text-[color:var(--color-text-dark)]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                    className="p-2 hover:bg-[color:var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="ml-3 text-xs text-[color:var(--color-text-dark)]/50">
                  {selectedVariant.stock} available
                </span>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-dark)]">
                Special Instructions (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                placeholder="Koi khaas hidayat printing/packing ke liye..."
                className="w-full rounded-lg border border-[color:var(--color-lavender)] px-3 py-2 text-sm outline-none focus:border-[color:var(--color-primary)]"
              />
            </div>

            {!designComplete && (
              <p className="text-xs text-[color:var(--color-accent)]">
                Order karne se pehle{" "}
                {needsText && needsImage
                  ? "text aur image"
                  : needsText
                    ? "text"
                    : "image"}{" "}
                canvas par add karna zaroori hai.
              </p>
            )}

            {errorMsg && (
              <p className="text-sm font-medium text-[color:var(--color-accent)]">
                {errorMsg}
              </p>
            )}

            <div className="flex items-start gap-2.5 rounded-lg border border-[color:var(--color-accent)]/25 bg-[color:var(--color-accent)]/5 p-3">
              <MessageCircle
                size={16}
                className="mt-0.5 shrink-0 text-[color:var(--color-accent)]"
              />
              <p className="text-xs text-[color:var(--color-text-dark)]/80">
                Printing shuru karne se pehle hum aapse WhatsApp/Call par design confirm
                karenge.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canOrder || isPending}
                className="flex items-center justify-center gap-2 rounded-xl border border-[color:var(--color-accent)] py-3 text-sm font-semibold text-[color:var(--color-accent)] transition-colors hover:bg-[color:var(--color-accent)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {justAdded ? (
                  <>
                    <Check size={16} /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!canOrder || isPending}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors ${
                  canOrder && !isPending
                    ? "bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-hover)]"
                    : "cursor-not-allowed bg-[color:var(--color-accent)]/40"
                }`}
              >
                <Zap size={16} /> Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-start-1 lg:row-start-2">
          <CustomizeTips />
          <ProductDetailsAccordion
            sections={[
              ...(props.productDescription
                ? [
                    {
                      id: "description",
                      title: "Description",
                      content: props.productDescription,
                    },
                  ]
                : []),
              { id: "care", title: "Care Instructions", content: CARE_INSTRUCTIONS },
              { id: "delivery", title: "Delivery & Returns", content: DELIVERY_INFO },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
