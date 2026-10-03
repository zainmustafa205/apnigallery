import { MessageCircle, Phone, Mail, Send, Clock, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import ContactForm from "@/components/contact/contact-form";

const WHATSAPP_NUMBER = "923001234567"; // Chat 8 ke whatsapp-button.tsx wala hi number
const CONTACT_PHONE = "+92 300 1234567"; // placeholder
const CONTACT_EMAIL = "support@apnigallery.com"; // placeholder

const CONTACT_LINKS = [
  {
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    external: true,
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Fastest response — chat karein",
    tone: "bg-green-100 text-green-600",
  },
  {
    href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`,
    external: false,
    icon: Phone,
    label: "Call Us",
    value: CONTACT_PHONE,
    tone: "bg-primary/10 text-primary",
  },
  {
    href: `mailto:${CONTACT_EMAIL}`,
    external: false,
    icon: Mail,
    label: "Email",
    value: CONTACT_EMAIL,
    tone: "bg-accent/10 text-accent",
  },
];

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden">
      <div
        className="bg-primary/15 absolute top-10 -left-20 -z-10 h-64 w-64 rounded-full blur-3xl"
        style={{ animation: "float-slow 8s ease-in-out infinite" }}
      />
      <div
        className="bg-accent/15 absolute top-[60%] -right-20 -z-10 h-72 w-72 rounded-full blur-3xl"
        style={{ animation: "float-slow 9s ease-in-out infinite 1.5s" }}
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
            Koi sawal ho, order ke bare mein poochna ho, ya bulk order discuss karna ho —
            hum yahan hain aapki madad ke liye.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Form — mobile pe pehle */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            <div className="bg-surface/45 h-full rounded-[1.75rem] border border-white/30 p-6 shadow-xl backdrop-blur-xl sm:p-8">
              <h2 className="text-text-dark mb-1 text-xl font-semibold">
                Message Bhejein
              </h2>
              <p className="text-text-dark/60 mb-5 text-sm">
                Form fill karein, hum jald hi reply karenge.
              </p>
              <ContactForm />
            </div>
          </div>

          {/* Direct contact panel — mobile pe baad mein */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            <div className="bg-surface/45 relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/30 p-6 shadow-xl backdrop-blur-xl sm:p-7">
              <div
                className="bg-accent/10 absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl"
                aria-hidden
              />

              <div className="relative">
                <h2 className="text-text-dark text-xl font-semibold">
                  Chalein Baat Karte Hain
                </h2>
                <p className="text-text-dark/60 mt-1 text-sm">
                  Jo tareeqa aapko suit kare, wahi choose karein.
                </p>

                <div className="mt-6 space-y-2">
                  {CONTACT_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="group hover:bg-lavender/50 flex items-center gap-4 rounded-2xl p-3 transition-colors"
                      >
                        <span className="from-primary/10 to-accent/10 text-primary group-hover:from-primary group-hover:to-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-300 group-hover:text-white group-hover:shadow-md">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-dark font-medium">{link.label}</p>
                          <p className="text-text-dark/70 truncate text-sm">
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
                {" "}
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
      </div>
    </main>
  );
}
