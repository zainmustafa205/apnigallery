"use client";

import { useRef, useState } from "react";
import { MockupCanvas, type DesignElement } from "@/components/customize/mockup-canvas";
import { DesignToolbar, type TextStyle } from "@/components/customize/design-toolbar";
import { CUSTOMIZE_FONT_CLASSNAMES, FONT_OPTIONS } from "@/lib/customize-fonts";

interface Variant {
  id: string;
  size: string | null;
  color: string | null;
  material: string | null;
  sku: string;
  priceAdjustment: number;
  stock: number;
  image: string | null;
}

interface OrderBuilderProps {
  productId: string;
  productName: string;
  productSlug: string;
  basePrice: number;
  customizationType: "IMAGE_ONLY" | "TEXT_ONLY" | "BOTH";
  mockupImageUrl: string | null;
  variants: Variant[];
  initialElements?: DesignElement[];
  initialDesignId?: string | null;
}

export function OrderBuilder(props: OrderBuilderProps) {
  const [elements, setElements] = useState<DesignElement[]>(props.initialElements ?? []);
  // designId abhi track ho raha hai — agla step (canvas se Add to Cart/Buy Now)
  // isay use karega taake naya Design create hone ke bajaye same record update ho.
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

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;
  const isTextSelected = selectedElement?.type === "text";

  // Panel edits the selected text element if one is selected,
  // otherwise it edits the default style for the next "Add Text".
  const activeTextStyle: TextStyle = isTextSelected
    ? {
        fontFamily: selectedElement!.fontFamily ?? defaultTextStyle.fontFamily,
        fontSize: selectedElement!.fontSize ?? defaultTextStyle.fontSize,
        color: selectedElement!.color ?? defaultTextStyle.color,
        bold: selectedElement!.bold ?? false,
        italic: selectedElement!.italic ?? false,
      }
    : defaultTextStyle;

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

    // TEMPORARY: local preview only — Step 4b me Cloudinary upload
    // (design.actions.ts) se replace karenge.
    const url = URL.createObjectURL(file);
    const id = crypto.randomUUID();
    setElements((prev) => [
      ...prev,
      {
        id,
        type: "image",
        url,
        xPercent: 30,
        yPercent: 30,
        widthPercent: 35,
        heightPercent: 35,
        rotation: 0,
      },
    ]);
    setSelectedId(id);
    e.target.value = "";
  }

  function handleDeleteSelected() {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }

  return (
    <div className={`mx-auto max-w-6xl px-4 py-8 ${CUSTOMIZE_FONT_CLASSNAMES}`}>
      <h1 className="mb-4 text-xl font-bold text-[color:var(--color-text-dark)]">
        Customize: {props.productName}
      </h1>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <MockupCanvas
          mockupImageUrl={props.mockupImageUrl}
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdateElement={handleUpdateElement}
        />

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
      </div>

      <pre className="mt-4 overflow-auto rounded-lg bg-[color:var(--color-surface-alt)] p-4 text-xs">
        {JSON.stringify(elements, null, 2)}
      </pre>
    </div>
  );
}
