import Link from "next/link";
import { HelpCircle, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import FaqAccordion from "@/components/faq/faq-accordion";

export default function FaqPage() {
  return (
    <main className="relative overflow-hidden">
      <div
        className="bg-primary/15 absolute top-10 -left-20 -z-10 h-64 w-64 rounded-full blur-3xl"
        style={{ animation: "float-slow 8s ease-in-out infinite" }}
      />
      <div
        className="bg-accent/15 absolute top-[55%] -right-20 -z-10 h-72 w-72 rounded-full blur-3xl"
        style={{ animation: "float-slow 9s ease-in-out infinite 1.5s" }}
      />

      <div className="mx-auto max-w-3xl space-y-8 px-4 pt-8 pb-10 sm:px-6 sm:pt-10 sm:pb-14">
        <div className="text-center">
          <SectionHeading
            title="Frequently Asked Questions"
            mobileTitle="Frequently Asked Q's"
            subtitle="اکثر پوچھے جانے والے سوالات"
          />
          <p className="text-text-dark/70 mx-auto mt-3 max-w-lg text-sm sm:text-base">
            Order, payment, delivery ya custom design se related sawalat ke jawab yahan
            maujood hain.
          </p>
        </div>

        <FaqAccordion />

        <section className="bg-surface/45 flex flex-col items-center gap-3 rounded-2xl border border-white/30 p-6 text-center shadow-md backdrop-blur-xl sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-text-dark font-medium">Apka sawal yahan nahi mila?</p>
            <p className="text-text-dark/60 text-sm">
              Hum seedha aapki madad karte hain.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-primary hover:bg-primary-light inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Contact Us
          </Link>
        </section>
      </div>
    </main>
  );
}
