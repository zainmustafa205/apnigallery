import { MousePointerClick, Move, Maximize2, RotateCw } from "lucide-react";

const TIPS = [
  { icon: MousePointerClick, text: "Kisi bhi element pe click karke usay select karein" },
  { icon: Move, text: "Select karne ke baad drag kr ke position badlein" },
  { icon: Maximize2, text: "Corner handle se resize karein" },
  { icon: RotateCw, text: "Upar wale round handle se ghumayein (rotate)" },
];

export function CustomizeTips() {
  return (
    <div className="rounded-xl border border-[color:var(--color-lavender)] bg-[color:var(--color-surface-alt)] p-5">
      <p className="mb-3 text-sm font-semibold text-[color:var(--color-primary)]">
        How to Customize
      </p>
      <ul className="space-y-2.5">
        {TIPS.map((tip, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm text-[color:var(--color-text-dark)]/80"
          >
            <tip.icon
              size={16}
              className="mt-0.5 shrink-0 text-[color:var(--color-accent)]"
            />
            <span>{tip.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
