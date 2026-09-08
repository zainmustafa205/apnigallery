import type { DesignElement } from "@/lib/design-types";

export function buildTextOnlyElements(text: string): DesignElement[] {
  return [
    {
      id: crypto.randomUUID(),
      type: "text",
      content: text,
      fontFamily: "var(--font-sans)",
      fontSize: 22,
      color: "#4B1E6E",
      bold: false,
      italic: false,
      xPercent: 15,
      yPercent: 42,
      widthPercent: 70,
      heightPercent: 18,
      rotation: 0,
    },
  ];
}

export function buildImageOnlyElements(url: string, publicId: string): DesignElement[] {
  return [
    {
      id: crypto.randomUUID(),
      type: "image",
      url,
      publicId,
      xPercent: 10,
      yPercent: 10,
      widthPercent: 80,
      heightPercent: 80,
      rotation: 0,
    },
  ];
}

export function buildBothElements(
  text: string,
  imageUrl: string,
  imagePublicId: string
): DesignElement[] {
  return [
    {
      id: crypto.randomUUID(),
      type: "image",
      url: imageUrl,
      publicId: imagePublicId,
      xPercent: 15,
      yPercent: 8,
      widthPercent: 70,
      heightPercent: 55,
      rotation: 0,
    },
    {
      id: crypto.randomUUID(),
      type: "text",
      content: text,
      fontFamily: "var(--font-sans)",
      fontSize: 18,
      color: "#4B1E6E",
      bold: false,
      italic: false,
      xPercent: 15,
      yPercent: 68,
      widthPercent: 70,
      heightPercent: 18,
      rotation: 0,
    },
  ];
}
