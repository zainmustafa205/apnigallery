// components/product/add-to-cart-panel.tsx
"use client";

import {
  saveDesign,
  uploadDesignImage,
  deleteDesignImage,
} from "@/lib/actions/design.actions";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { setLastDesignCookie } from "@/lib/design-cookie";
import {
  ShoppingCart,
  Sparkles,
  Check,
  Minus,
  Plus,
  Zap,
  Upload,
  Type,
  MessageCircle,
} from "lucide-react";
import { addToCart } from "@/lib/actions/cart.actions";
import { useCart } from "@/components/providers/cart-provider";
import VariantSelector from "@/components/product/variant-selector";
import type { DesignElement } from "@/lib/design-types";
import {
  buildTextOnlyElements,
  buildImageOnlyElements,
  buildBothElements,
} from "@/lib/design-defaults";

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  material: string | null;
  sku: string;
  priceAdjustment: number;
  stock: number;
};

type CustomizationType = "IMAGE_ONLY" | "TEXT_ONLY" | "BOTH" | null;

type Props = {
  productId: string;
  productSlug: string;
  isCustomizable: boolean;
  customizationType: CustomizationType;
  variants: Variant[];
  basePrice: number;
};

export default function AddToCartPanel({
  productId,
  productSlug,
  isCustomizable,
  customizationType,
  variants,
  basePrice,
}: Props) {
  const { refreshCart } = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // --- Quick customization fields ---
  const [quickText, setQuickText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    publicId: string;
  } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [lowResWarning, setLowResWarning] = useState(false);
  const [designError, setDesignError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const needsText = customizationType === "TEXT_ONLY" || customizationType === "BOTH";
  const needsImage = customizationType === "IMAGE_ONLY" || customizationType === "BOTH";

  const hasRequiredText = !needsText || quickText.trim().length > 0;
  const hasRequiredImage = !needsImage || !!uploadedImage;
  const designRequirementsMet = hasRequiredText && hasRequiredImage;

  const maxQty = selectedVariant ? Math.min(selectedVariant.stock, 50) : 0;
  const canOrder =
    !!selectedVariant &&
    selectedVariant.stock > 0 &&
    quantity >= 1 &&
    designRequirementsMet;

  function handleVariantChange(variant: Variant | null) {
    setSelectedVariant((prev) => {
      if (prev?.id !== variant?.id) {
        setQuantity(1);
        setErrorMsg(null);
      }
      return variant;
    });
  }

  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQty() {
    setQuantity((q) => Math.min(maxQty, q + 1));
  }

  async function handleQuickImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setDesignError(null);

    // Agar customer pehle se koi image upload kr chuka hai aur ab nayi
    // select kr raha hai, purani ko Cloudinary se cleanup kr dete hain.
    if (uploadedImage) {
      deleteDesignImage(uploadedImage.publicId).catch(() => {});
    }

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadDesignImage(formData);
    setIsUploadingImage(false);

    if (!result.success) {
      setDesignError(result.error);
      return;
    }

    setUploadedImage({ url: result.data.url, publicId: result.data.publicId });
    setLowResWarning(result.data.lowResolutionWarning);
    e.target.value = "";
  }

  /**
   * Builds elements from quick-fields and saves a Design record.
   * Only called after designRequirementsMet is confirmed true (buttons are
   * disabled otherwise), so quickText/uploadedImage are guaranteed present
   * for whichever fields customizationType requires.
   */
  async function ensureDesignId(): Promise<{ ok: boolean; designId: string | null }> {
    if (!customizationType) return { ok: true, designId: null };

    const hasText = quickText.trim().length > 0;
    const hasImage = !!uploadedImage;

    let elements: DesignElement[];
    if (hasText && hasImage) {
      elements = buildBothElements(
        quickText.trim(),
        uploadedImage!.url,
        uploadedImage!.publicId
      );
    } else if (hasText) {
      elements = buildTextOnlyElements(quickText.trim());
    } else if (hasImage) {
      elements = buildImageOnlyElements(uploadedImage!.url, uploadedImage!.publicId);
    } else {
      return { ok: false, designId: null };
    }

    const result = await saveDesign({ productId, elements });
    if (!result.success) {
      setDesignError(result.error);
      return { ok: false, designId: null };
    }

    setLastDesignCookie(productId, result.data.designId);
    return { ok: true, designId: result.data.designId };
  }

  function handleAddToCart() {
    if (!selectedVariant || !designRequirementsMet) return;
    setErrorMsg(null);
    setDesignError(null);

    startTransition(async () => {
      const designResult = await ensureDesignId();
      if (!designResult.ok) return;

      const result = await addToCart({
        productId,
        variantId: selectedVariant.id,
        quantity,
        designId: designResult.designId ?? undefined,
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
    if (!selectedVariant || !designRequirementsMet) return;
    setErrorMsg(null);
    setDesignError(null);

    startTransition(async () => {
      const designResult = await ensureDesignId();
      if (!designResult.ok) return;

      const params = new URLSearchParams({
        mode: "direct",
        productId,
        variantId: selectedVariant.id,
        quantity: String(quantity),
      });
      if (designResult.designId) {
        params.set("designId", designResult.designId);
      }

      router.push(`/checkout?${params.toString()}`);
    });
  }
  function handleCustomizeFurther() {
    if (!isCustomizable) return;

    const hasAnyInput = quickText.trim().length > 0 || !!uploadedImage;

    // Kuch bhara hi nahi hai to seedha khaali canvas pe le jao —
    // koi design save karne ki zaroorat nahi.
    if (!hasAnyInput) {
      router.push(`/customize/${productSlug}`);
      return;
    }

    setDesignError(null);

    startTransition(async () => {
      const designResult = await ensureDesignId();
      if (designResult.ok && designResult.designId) {
        router.push(`/customize/${productSlug}?designId=${designResult.designId}`);
      } else {
        // Save fail hui to bhi customer ko block nahi karna — bas khaali
        // canvas pe bhej do, wo wahan se shuru kr sakta hai.
        router.push(`/customize/${productSlug}`);
      }
    });
  }

  return (
    <div className="space-y-5">
      <VariantSelector
        variants={variants}
        basePrice={basePrice}
        onVariantChange={handleVariantChange}
      />

      {selectedVariant && selectedVariant.stock > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-text-dark)]">
            Quantity
          </p>
          <div className="inline-flex items-center overflow-hidden rounded-lg border border-[var(--color-lavender)]">
            <button
              type="button"
              onClick={decreaseQty}
              disabled={quantity <= 1}
              className="p-2 hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-[2.5rem] px-4 text-center text-sm font-medium text-[var(--color-text-dark)]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increaseQty}
              disabled={quantity >= maxQty}
              className="p-2 hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="ml-3 text-xs text-[var(--color-text-dark)]/50">
            {selectedVariant.stock} available
          </span>
        </div>
      )}

      {/* Quick customization fields — MANDATORY when customizationType is set.
          Add to Cart / Buy Now stay disabled until required fields are filled. */}
      {customizationType && (
        <div className="space-y-4 rounded-xl border border-[var(--color-lavender)] bg-[var(--color-surface-alt)] p-5">
          <p className="text-xs font-semibold text-[var(--color-accent)]">*Required</p>

          {needsText && (
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-dark)]">
                <Type size={14} />
                Apna Text Likhein <span className="text-[var(--color-accent)]">*</span>
              </label>
              <input
                type="text"
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder="e.g. Happy Birthday Ali"
                className="w-full rounded-lg border border-[var(--color-lavender)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text-dark)] transition-colors outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
              />
            </div>
          )}

          {needsImage && (
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-dark)]">
                <Upload size={14} />
                Apni Tasveer Upload Karein{" "}
                <span className="text-[var(--color-accent)]">*</span>
              </label>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleQuickImageSelect}
                className="hidden"
                id="quick-image-upload"
              />

              <label
                htmlFor="quick-image-upload"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-lavender)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-dark)]/70 transition-colors hover:border-[var(--color-primary-light)] hover:bg-[var(--color-lavender)]/20"
              >
                <Upload size={16} className="text-[var(--color-primary)]" />
                {uploadedImage ? "Tasveer Badal Dein" : "Uplead Your Image"}
              </label>

              {isUploadingImage && (
                <p className="mt-2 text-xs text-[var(--color-text-dark)]/60">
                  Upload ho raha hai...
                </p>
              )}

              {uploadedImage && !isUploadingImage && (
                <div className="mt-2.5 flex items-center gap-2.5 rounded-lg border border-[var(--color-lavender)] bg-[var(--color-surface)] p-2">
                  <img
                    src={uploadedImage.url}
                    alt="Uploaded"
                    className="h-12 w-12 rounded-md border border-[var(--color-lavender)] object-cover"
                  />
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <Check size={14} />
                    Upload ho gayi
                  </span>
                </div>
              )}

              {lowResWarning && (
                <p className="mt-2 text-xs text-amber-600">
                  ⚠️ Ye image thodi low-resolution hai — print quality behtar rakhne ke
                  liye zyada high-quality image use karein.
                </p>
              )}
            </div>
          )}

          {designError && (
            <p className="text-xs font-medium text-[var(--color-accent)]">
              {designError}
            </p>
          )}

          <div className="flex items-start gap-2 border-t border-[var(--color-lavender)] pt-3">
            <MessageCircle
              size={16}
              className="mt-0.5 flex-shrink-0 text-[var(--color-accent)]"
            />
            <p className="text-xs text-[var(--color-accent)]">
              Printing shuru karne se pehle hum aapse WhatsApp/Call par design confirm
              karenge.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-sm font-medium text-[var(--color-accent)]">{errorMsg}</p>
      )}

      {/* Primary actions: Add to Cart + Buy Now */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canOrder || isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-accent)] py-3 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--color-accent)]"
        >
          {justAdded ? (
            <>
              <Check size={16} />
              Added
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!canOrder || isPending}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors ${
            canOrder && !isPending
              ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]"
              : "cursor-not-allowed bg-[var(--color-accent)]/40"
          }`}
        >
          <Zap size={16} />
          Buy Now
        </button>
      </div>

      {/* Secondary action: Customize Further — full canvas control (fonts, colors, position) */}
      <button
        type="button"
        onClick={handleCustomizeFurther}
        disabled={!isCustomizable || isPending}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
          isCustomizable
            ? "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            : "cursor-not-allowed border-[var(--color-lavender)] text-[var(--color-text-dark)]/30"
        }`}
      >
        <Sparkles size={16} />
        {isCustomizable
          ? "Customize Further (Fonts, Colors, Position)"
          : "Customization Not Available"}
      </button>
    </div>
  );
}
