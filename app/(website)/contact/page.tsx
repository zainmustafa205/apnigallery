import { SectionHeading } from "@/components/shared/section-heading";
import ContactForm from "@/components/contact/contact-form";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Mail,
  Send,
  Clock,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";

const WHATSAPP_NUMBER = "923001234567"; // same number as Chat 8's whatsapp-button.tsx
const CONTACT_PHONE = "+92 300 1234567"; // placeholder
const CONTACT_EMAIL = "support@apnigallery.com"; // placeholder

const CONTACT_LINKS = [
  {
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    external: true,
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Fastest response — chat with us",
    tone: "bg-green-500/10 text-green-600 group-hover:bg-green-500",
  },
  {
    href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`,
    external: false,
    icon: Phone,
    label: "Call Us",
    value: CONTACT_PHONE,
    tone: "bg-primary/10 text-primary group-hover:bg-primary",
  },
  {
    href: `mailto:${CONTACT_EMAIL}`,
    external: false,
    icon: Mail,
    label: "Email",
    value: CONTACT_EMAIL,
    tone: "bg-accent/10 text-accent group-hover:bg-accent",
  },
];

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden">
      <div
        className="bg-primary/15 absolute top-10 -left-20 -z-10 h-64 w-64 rounded-full blur-3xl"
        style={{ animation: "float-slow 8s ease-in-out infinite" }}
      />

      <div className="mx-auto max-w-5xl space-y-10 px-4 pt-3 pb-10 sm:px-6 sm:pt-4 sm:pb-14">
        <section className="bg-surface/45 relative overflow-hidden rounded-[2rem] border border-white/30 px-5 py-10 text-center shadow-xl backdrop-blur-xl sm:px-10 sm:py-14">
          <div className="relative mx-auto mb-4 inline-flex overflow-hidden rounded-full p-[1.5px]">
            <div
              className="absolute inset-[-100%] animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,var(--color-primary)_0%,var(--color-accent)_50%,var(--color-primary)_100%)]"
              style={{ animationDuration: "3s" }}
            />
            <div className="bg-surface text-text-dark relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium">
              <Send className="h-3.5 w-3.5" />
              We reply fast
            </div>
          </div>
          <SectionHeading title="Contact Us" subtitle="ہم سے رابطہ کریں" />
          <p className="text-text-dark/70 mx-auto mt-3 max-w-lg text-sm sm:text-base">
            Have a question, need help with an order, or want to discuss a bulk order —
            we&apos;re here to help.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Form — first on mobile */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            <div className="bg-surface/45 h-full rounded-[1.75rem] border border-white/30 p-6 shadow-xl backdrop-blur-xl sm:p-8">
              <h2 className="text-text-dark mb-1 text-xl font-semibold">
                Send a Message
              </h2>
              <p className="text-text-dark/60 mb-5 text-sm">
                Fill out the form and we&apos;ll get back to you soon.
              </p>
              <ContactForm />
            </div>
          </div>

          {/* Direct contact panel — second on mobile */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            <div className="bg-surface/45 relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/30 p-6 shadow-xl backdrop-blur-xl sm:p-7">
              <div
                className="bg-accent/10 absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl"
                aria-hidden
              />

              <div className="relative">
                <h2 className="text-text-dark text-xl font-semibold">Let&apos;s Talk</h2>
                <p className="text-text-dark/60 mt-1 text-sm">
                  Choose whichever way works best for you.
                </p>

                <div className="mt-6 space-y-1.5">
                  {CONTACT_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="group hover:bg-lavender/50 flex items-center gap-3 rounded-xl p-2.5 transition-colors sm:gap-4 sm:p-3"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm transition-all duration-300 group-hover:text-white group-hover:shadow-md sm:h-11 sm:w-11 ${link.tone}`}
                        >
                          <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-dark text-sm font-medium sm:text-base">
                            {link.label}
                          </p>
                          <p className="text-text-dark/70 text-xs leading-snug sm:text-sm">
                            {link.value}
                          </p>
                        </div>
                        <ArrowUpRight className="text-text-dark/30 group-hover:text-primary h-4 w-4 shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="border-primary/25 bg-lavender/15 relative mt-6 flex items-center gap-3 rounded-2xl border p-4">
                <span className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-text-dark text-sm font-medium">Business Hours</p>
                  <p className="text-text-dark/60 text-xs">Mon–Sat, 10am – 8pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="border-primary/15 bg-surface/45 relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border p-6 text-center shadow-md backdrop-blur-xl sm:flex-row sm:justify-between sm:text-left">
          <div
            className="bg-primary/10 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl"
            aria-hidden
          />
          <div className="relative">
            <p className="text-text-dark font-medium">
              Someone may have asked this already
            </p>
            <p className="text-text-dark/60 text-sm">
              Your answer might already be in our FAQs.
            </p>
          </div>
          <Link
            href="/faq"
            className="bg-primary hover:bg-primary-light relative inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            View FAQs
          </Link>
        </section>
      </div>
    </main>
  );
}
