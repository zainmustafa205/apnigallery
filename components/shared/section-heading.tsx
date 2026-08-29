export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-6 max-w-4xl px-4 sm:mb-8">
      <div className="flex items-center gap-3" dir="ltr">
        <div className="h-[3px] flex-1 [animation:gradient-shift_3s_ease_infinite] rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto]" />

        <span className="h-2.5 w-2.5 flex-shrink-0 [animation:gradient-shift_3s_ease_infinite,pulse-glow_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto]" />

        <h2 className="flex-shrink-0 [animation:gradient-shift_3s_ease_infinite] bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto] bg-clip-text px-2 text-xl font-bold tracking-tight whitespace-nowrap text-transparent sm:text-2xl">
          {title}
        </h2>

        <span
          className="h-2.5 w-2.5 flex-shrink-0 [animation:gradient-shift_3s_ease_infinite,pulse-glow_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto]"
          style={{ animationDelay: "0.3s" }}
        />

        <div className="h-[3px] flex-1 [animation:gradient-shift_3s_ease_infinite] rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto]" />
      </div>

      {subtitle && (
        <p
          dir="rtl"
          className="mt-2 text-center text-xs font-[var(--font-heading-ur)] font-medium text-[var(--color-text-dark)]/55 sm:text-sm"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
