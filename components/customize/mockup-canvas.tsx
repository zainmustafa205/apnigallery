"use client";

import { useRef, useState } from "react";
import Moveable from "react-moveable";
import Image from "next/image";

export interface DesignElement {
  id: string;
  type: "text" | "image";
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  rotation: number;
  content?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  url?: string;
}

interface MockupCanvasProps {
  mockupImageUrl: string | null;
  elements: DesignElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
}

export function MockupCanvas({
  mockupImageUrl,
  elements,
  selectedId,
  onSelect,
  onUpdateElement,
}: MockupCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const resizeStartRef = useRef<{ height: number; fontSize: number } | null>(null);

  const selectedTarget = selectedId ? targetRefs.current[selectedId] : null;
  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-lg border border-black/10 bg-[color:var(--color-surface-alt)]"
      onClick={(e) => {
        if (e.target === containerRef.current) onSelect(null);
      }}
    >
      {mockupImageUrl ? (
        <Image
          src={mockupImageUrl}
          alt="Product mockup"
          fill
          className="pointer-events-none object-contain select-none"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
          No Mockup Available
        </div>
      )}

      {elements.map((el) => (
        <div
          key={el.id}
          ref={(node) => {
            targetRefs.current[el.id] = node;
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(el.id);
          }}
          className="absolute flex cursor-move items-center justify-center"
          style={{
            left: `${el.xPercent}%`,
            top: `${el.yPercent}%`,
            width: `${el.widthPercent}%`,
            height: `${el.heightPercent}%`,
            transform: `rotate(${el.rotation}deg)`,
            border: selectedId === el.id ? "1px dashed var(--color-accent)" : "none",
          }}
        >
          {el.type === "text" ? (
            <span
              data-role="text-content"
              style={{
                fontFamily: el.fontFamily,
                color: el.color,
                fontSize: `${el.fontSize}px`,
                fontWeight: el.bold ? 700 : 400,
                fontStyle: el.italic ? "italic" : "normal",
                whiteSpace: "nowrap",
              }}
            >
              {el.content}
            </span>
          ) : el.url ? (
            <img
              src={el.url}
              alt="Design"
              className="pointer-events-none h-full w-full object-fill select-none"
              draggable={false}
            />
          ) : null}
        </div>
      ))}
      {/* Deterrent watermark — mix-blend-mode se background ke hisaab se
          khud adjust hota hai (light/dark dono pe consistent, subtle rehta hai).
          NOTE: "Save Preview Snapshot" (order wali final image) me ye SHAMIL
          NAHI hona chahiye — sirf is live editor preview ke liye hai. */}
      <div
        className="pointer-events-none absolute inset-0 z-30 overflow-hidden select-none"
        style={{ isolation: "isolate" }}
      >
        <div
          className="absolute inset-0 grid scale-150 -rotate-[30deg] grid-cols-3 grid-rows-4 place-items-center"
          style={{ mixBlendMode: "overlay" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold whitespace-nowrap sm:text-xs"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              PREVIEW • ApniGallery.com
            </span>
          ))}
        </div>
      </div>
      {selectedTarget && containerRef.current && (
        <Moveable
          target={selectedTarget}
          container={containerRef.current}
          draggable
          resizable
          rotatable
          keepRatio={false}
          throttleDrag={0}
          throttleResize={0}
          throttleRotate={0}
          onDrag={({ target, left, top }) => {
            target.style.left = `${left}px`;
            target.style.top = `${top}px`;
          }}
          onDragEnd={({ target }) => {
            const container = containerRef.current!;
            const cRect = container.getBoundingClientRect();
            const tRect = target.getBoundingClientRect();
            onUpdateElement(selectedId!, {
              xPercent: ((tRect.left - cRect.left) / cRect.width) * 100,
              yPercent: ((tRect.top - cRect.top) / cRect.height) * 100,
            });
          }}
          onResizeStart={({ target }) => {
            const tRect = target.getBoundingClientRect();
            resizeStartRef.current = {
              height: tRect.height,
              fontSize: selectedElement?.fontSize ?? 16,
            };
          }}
          onResize={({ target, width, height, drag }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
            target.style.left = `${drag.left}px`;
            target.style.top = `${drag.top}px`;

            // Text elements: live-scale font size with the box height
            if (selectedElement?.type === "text" && resizeStartRef.current) {
              const { height: startHeight, fontSize: startFontSize } =
                resizeStartRef.current;
              const scale = height / startHeight;
              const span = target.querySelector<HTMLSpanElement>(
                '[data-role="text-content"]'
              );
              if (span) {
                span.style.fontSize = `${startFontSize * scale}px`;
              }
            }
          }}
          onResizeEnd={({ target }) => {
            const container = containerRef.current!;
            const cRect = container.getBoundingClientRect();
            const tRect = target.getBoundingClientRect();
            const updates: Partial<DesignElement> = {
              xPercent: ((tRect.left - cRect.left) / cRect.width) * 100,
              yPercent: ((tRect.top - cRect.top) / cRect.height) * 100,
              widthPercent: (tRect.width / cRect.width) * 100,
              heightPercent: (tRect.height / cRect.height) * 100,
            };

            if (selectedElement?.type === "text" && resizeStartRef.current) {
              const { height: startHeight, fontSize: startFontSize } =
                resizeStartRef.current;
              const scale = tRect.height / startHeight;
              updates.fontSize = Math.max(8, startFontSize * scale);
            }

            onUpdateElement(selectedId!, updates);
            resizeStartRef.current = null;
          }}
          onRotate={({ target, rotate }) => {
            target.style.transform = `rotate(${rotate}deg)`;
          }}
          onRotateEnd={({ target }) => {
            const match = target.style.transform.match(/rotate\(([-\d.]+)deg\)/);
            const rotation = match ? parseFloat(match[1]) : 0;
            onUpdateElement(selectedId!, { rotation });
          }}
        />
      )}
    </div>
  );
}
