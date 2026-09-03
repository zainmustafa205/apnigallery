"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Section = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  sections: Section[];
};

export default function ProductDetailsAccordion({ sections }: Props) {
  const [openId, setOpenId] = useState<string | null>(sections[0]?.id ?? null);

  return (
    <div className="divide-y divide-[var(--color-lavender)] overflow-hidden rounded-xl border border-[var(--color-lavender)]">
      {sections.map((section) => {
        const isOpen = openId === section.id;
        return (
          <div key={section.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : section.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-alt)]"
            >
              <span className="font-medium text-[var(--color-text-dark)]">
                {section.title}
              </span>
              <ChevronDown
                size={18}
                className={`text-[var(--color-text-dark)]/60 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm leading-relaxed text-[var(--color-text-dark)]/80">
                {section.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
