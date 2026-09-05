"use client";

import { Bold, Italic, Trash2, Plus, Upload } from "lucide-react";
import { FONT_OPTIONS, isUrduScript } from "@/lib/customize-fonts";
import type { DesignElement } from "@/components/customize/mockup-canvas";

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
}

interface DesignToolbarProps {
  customizationType: "IMAGE_ONLY" | "TEXT_ONLY" | "BOTH";
  selectedElement: DesignElement | null;
  textStyle: TextStyle;
  onTextStyleChange: (updates: Partial<TextStyle>) => void;
  onContentChange: (content: string) => void;
  onAddText: () => void;
  onAddImageClick: () => void;
  onDeleteSelected: () => void;
}

export function DesignToolbar({
  customizationType,
  selectedElement,
  textStyle,
  onTextStyleChange,
  onContentChange,
  onAddText,
  onAddImageClick,
  onDeleteSelected,
}: DesignToolbarProps) {
  const canAddText = customizationType === "TEXT_ONLY" || customizationType === "BOTH";
  const canAddImage = customizationType === "IMAGE_ONLY" || customizationType === "BOTH";
  const isTextSelected = selectedElement?.type === "text";

  const currentContent = selectedElement?.content ?? "";
  const typingUrdu = isUrduScript(currentContent);

  // Smart filter: while typing Urdu script, only show Urdu-capable fonts
  const visibleFonts = typingUrdu
    ? FONT_OPTIONS.filter((f) => f.script === "urdu")
    : FONT_OPTIONS;

  function handleContentInputChange(value: string) {
    onContentChange(value);

    const willBeUrdu = isUrduScript(value);
    const currentFontIsUrdu =
      FONT_OPTIONS.find((f) => f.value === textStyle.fontFamily)?.script === "urdu";

    // Auto-switch to a Urdu font the moment Urdu script is typed with a
    // Latin-only font selected — otherwise the text would silently render
    // in the browser's fallback font instead of the chosen style.
    if (willBeUrdu && !currentFontIsUrdu) {
      onTextStyleChange({
        fontFamily: FONT_OPTIONS.find((f) => f.script === "urdu")!.value,
      });
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-black/10 bg-[color:var(--color-surface)] p-4">
      <div className="flex flex-wrap gap-2">
        {canAddText && (
          <button
            type="button"
            onClick={onAddText}
            className="flex items-center gap-1.5 rounded-md bg-[color:var(--color-primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus size={16} /> Add Text
          </button>
        )}
        {canAddImage && (
          <button
            type="button"
            onClick={onAddImageClick}
            className="flex items-center gap-1.5 rounded-md bg-[color:var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Upload size={16} /> Upload Image
          </button>
        )}
      </div>

      {canAddText && (
        <div className="space-y-3 border-t border-black/10 pt-3">
          <p className="text-xs font-semibold text-[color:var(--color-primary)]">
            {isTextSelected ? "Edit Selected Text" : "Default Text Style"}
          </p>

          {isTextSelected && (
            <div>
              <label className="text-xs font-medium text-[color:var(--color-text-dark)]">
                Text
              </label>
              <input
                type="text"
                dir={typingUrdu ? "rtl" : "ltr"}
                value={currentContent}
                onChange={(e) => handleContentInputChange(e.target.value)}
                className="mt-1 w-full rounded-md border border-black/15 px-2 py-1.5 text-sm"
              />
              {typingUrdu && (
                <p className="mt-1 text-[11px] text-[color:var(--color-accent)]">
                  Urdu script detect ho gayi — sirf Urdu fonts dikhaye ja rahe hain
                </p>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-[color:var(--color-text-dark)]">
              Font
            </label>
            <select
              value={textStyle.fontFamily}
              onChange={(e) => onTextStyleChange({ fontFamily: e.target.value })}
              className="mt-1 w-full rounded-md border border-black/15 px-2 py-1.5 text-sm"
            >
              {visibleFonts.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-[color:var(--color-text-dark)]">
                Size ({textStyle.fontSize}px)
              </label>
              <input
                type="range"
                min={8}
                max={72}
                value={textStyle.fontSize}
                onChange={(e) => onTextStyleChange({ fontSize: Number(e.target.value) })}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[color:var(--color-text-dark)]">
                Color
              </label>
              <input
                type="color"
                value={textStyle.color}
                onChange={(e) => onTextStyleChange({ color: e.target.value })}
                className="h-9 w-9 cursor-pointer rounded border border-black/15"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onTextStyleChange({ bold: !textStyle.bold })}
              className={`rounded-md border p-2 ${
                textStyle.bold
                  ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                  : "border-black/15"
              }`}
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => onTextStyleChange({ italic: !textStyle.italic })}
              className={`rounded-md border p-2 ${
                textStyle.italic
                  ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                  : "border-black/15"
              }`}
            >
              <Italic size={16} />
            </button>
          </div>
        </div>
      )}

      {selectedElement && (
        <div className="border-t border-black/10 pt-3">
          <button
            type="button"
            onClick={onDeleteSelected}
            className="flex items-center gap-1.5 rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
            {selectedElement.type === "text" ? "Delete Text" : "Remove Image"}
          </button>
        </div>
      )}
    </div>
  );
}
