export function SectionHeading({
  title,
  dir = "rtl",
}: {
  title: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div
      className="mx-auto mb-6 flex max-w-4xl items-center gap-3 px-4 sm:mb-8"
      dir={dir}
    >
      <div className="h-[3px] flex-1 [animation:gradient-shift_3s_ease_infinite] rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto]" />
      <span className="h-2.5 w-2.5 flex-shrink-0 [animation:gradient-shift_3s_ease_infinite,pulse-glow_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto]" />
      <h2 className="flex-shrink-0 [animation:gradient-shift_3s_ease_infinite] bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto] bg-clip-text px-2 text-xl font-bold whitespace-nowrap text-transparent sm:text-2xl">
        {title}
      </h2>
      <span
        className="h-2.5 w-2.5 flex-shrink-0 [animation:gradient-shift_3s_ease_infinite,pulse-glow_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto]"
        style={{ animationDelay: "0.3s" }}
      />
      <div className="h-[3px] flex-1 [animation:gradient-shift_3s_ease_infinite] rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto]" />
    </div>
  );
}
