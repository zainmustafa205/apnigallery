"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  MessageCircle,
  Tag,
  Truck,
  ArrowRight,
  Heart,
  ShieldCheck,
  Palette,
  PackageCheck,
} from "lucide-react";
import CtaButton from "@/components/shared/cta-button";
import { SectionHeading } from "@/components/shared/section-heading";
import ScrollReveal from "@/components/shared/scroll-reveal";

const VALUES = [
  {
    icon: Sparkles,
    title: "Quality First",
    description:
      "Har print high-resolution aur durable material ke sath hoti hai, taake aapka design lambay arse tak wesa hi rahe.",
  },
  {
    icon: MessageCircle,
    title: "Customer Support",
    description:
      "WhatsApp par direct baat-cheet — order se delivery tak, har step pe hum aapke sath hain.",
  },
  {
    icon: Tag,
    title: "Affordable Pricing",
    description:
      "Bagair quality compromise kiye, Pakistan ke har customer ke budget ka khayal rakhte hain.",
  },
  {
    icon: Truck,
    title: "Fast Turnaround",
    description:
      "Design confirm hote hi production shuru — taake order jald se jald aap tak pohanche.",
  },
];

const PROCESS_STEPS = [
  {
    image: "https://picsum.photos/seed/design/500/400",
    icon: Palette,
    title: "Design Upload",
    caption: "Apna photo, text ya design upload karein.",
  },
  {
    image: "https://picsum.photos/seed/confirm/500/400",
    icon: MessageCircle,
    title: "Confirmation",
    caption: "Hum WhatsApp/Call par final design confirm karte hain.",
  },
  {
    image: "https://picsum.photos/seed/print/500/400",
    icon: ShieldCheck,
    title: "Printing & Quality Check",
    caption: "Professional printing, har item pe quality check.",
  },
  {
    image: "https://picsum.photos/seed/deliver/500/400",
    icon: PackageCheck,
    title: "Packing & Delivery",
    caption: "Safe packing ke sath, COD delivery seedhi aapke ghar.",
  },
];

const STORY_POINTS = [
  {
    number: "01",
    title: "Your Idea",
  },
  {
    number: "02",
    title: "We Create",
  },
  {
    number: "03",
    title: "You Enjoy",
  },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Floating background glow */}
      <div
        className="bg-primary/15 absolute top-24 -left-24 -z-10 h-64 w-64 rounded-full blur-3xl"
        style={{ animation: "float-slow 8s ease-in-out infinite" }}
      />
      <div
        className="bg-accent/15 absolute top-[45%] -right-24 -z-10 h-72 w-72 rounded-full blur-3xl"
        style={{ animation: "float-slow 9s ease-in-out infinite 1s" }}
      />
      <div
        className="bg-primary/10 absolute bottom-20 -left-20 -z-10 h-64 w-64 rounded-full blur-3xl"
        style={{ animation: "float-slow 8s ease-in-out infinite 2s" }}
      />

      <div className="mx-auto max-w-6xl space-y-20 px-4 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-12 lg:space-y-28 lg:px-8">
        {" "}
        {/* =====================================================
            OUR STORY
        ====================================================== */}
        <ScrollReveal>
          <section className="bg-surface/45 relative overflow-hidden rounded-[2rem] border border-white/30 px-5 pt-6 pb-10 shadow-xl backdrop-blur-xl sm:px-10 sm:pt-8 sm:pb-14 lg:px-16 lg:pt-10 lg:pb-20">
            {" "}
            {/* Decorative glow */}
            <div className="bg-primary/10 absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl" />
            <div className="bg-accent/10 absolute -bottom-20 -left-20 h-48 w-48 rounded-full blur-3xl" />
            <div className="relative mx-auto max-w-3xl text-center">
              {/* Small label */}
              <div className="border-primary/20 bg-primary/10 text-primary mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium">
                <Heart className="h-3.5 w-3.5" />
                Made with your ideas
              </div>

              <SectionHeading
                title="Our Story"
                subtitle="ہماری کہانی، آپ کے یقین کے ساتھ"
              />

              {/* Story paragraph */}
              <p className="text-text-dark/80 mt-6 text-justify text-[15px] leading-7 sm:text-base sm:leading-8 lg:text-lg">
                <strong className="text-primary font-semibold">ApniGallery</strong> ka
                maqsad simple hai — aapki apni{" "}
                <strong className="text-accent">soch, design aur pasand</strong> ko ek
                aise product mein badalna jo waqai aapka ho. Yahan aap sirf product
                khareedte nahi, balkay apne ideas ko{" "}
                <strong className="text-accent">khud create</strong> karte hain. Hum
                Pakistan bhar mein custom printing ko{" "}
                <strong className="text-accent">asaan, affordable aur reliable</strong>{" "}
                banane par kaam kar rahe hain — taake har idea ko ek real product mein
                badla ja sake,{" "}
                <strong className="text-primary">ek order ek waqt mein.</strong>
              </p>

              {/* Story journey cards */}
              <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-2.5 sm:gap-4">
                {STORY_POINTS.map((item, index) => (
                  <div
                    key={item.number}
                    className="group border-primary/20 bg-surface/65 hover:border-accent/40 relative overflow-hidden rounded-2xl border px-2 py-4 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-md sm:rounded-3xl sm:px-4 sm:py-5"
                    style={{
                      animation: `fade-in-up 0.6s ease-out ${300 + index * 120}ms both`,
                    }}
                  >
                    {/* Hover glow */}
                    <div className="bg-accent/10 absolute -top-8 -right-8 h-20 w-20 rounded-full opacity-0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />

                    <div className="relative text-center">
                      <span className="text-primary block text-xl font-bold tracking-tight sm:text-2xl">
                        {item.number}
                      </span>

                      <span className="text-text-dark/65 mt-1.5 block text-[10px] font-semibold sm:text-xs">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
        {/* =====================================================
            MISSION & VALUES
        ====================================================== */}
        <section>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <SectionHeading title="Mission & Values" subtitle="ہمارا مقصد اور اصول" />

              <p className="text-text-dark/60 mt-4 text-sm leading-6 sm:text-base">
                Har product ke peeche ek simple goal — quality, trust aur personalization
                ko ek jagah lana.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
            {VALUES.map((value, index) => {
              const Icon = value.icon;

              return (
                <ScrollReveal key={value.title} delay={index * 100}>
                  <article className="group bg-surface/45 relative h-full overflow-hidden rounded-3xl border border-white/30 p-5 shadow-md backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl sm:p-6">
                    {/* Decorative glow */}
                    <div className="bg-primary/5 absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />

                    <div className="relative">
                      <div className="mb-5 flex items-center justify-between">
                        <div className="bg-primary/10 text-primary group-hover:bg-accent/10 group-hover:text-accent flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="text-text-dark/20 text-xs font-bold">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="text-text-dark mb-2 text-base font-semibold sm:text-lg">
                        {value.title}
                      </h3>

                      <p className="text-text-dark/65 text-justify text-sm leading-6">
                        {value.description}
                      </p>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
        {/* =====================================================
            OUR PROCESS
        ====================================================== */}
        <section>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <SectionHeading title="Our Process" subtitle="آرڈر سے ڈیلیوری تک کا سفر" />
              <p className="text-text-dark/60 mt-4 text-sm leading-6 sm:text-base">
                Simple process, clear communication aur hassle-free experience.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 sm:mt-12">
            {PROCESS_STEPS.map((step, index) => {
              const reversed = index % 2 === 1;
              const Icon = step.icon;

              return (
                <div key={step.title}>
                  <ScrollReveal delay={index * 120}>
                    <div
                      className={`group bg-surface/45 relative grid grid-cols-1 items-center gap-5 rounded-2xl border border-white/30 p-4 shadow-md backdrop-blur-xl transition-all duration-500 hover:shadow-xl sm:rounded-[1.75rem] sm:p-5 lg:grid-cols-2 lg:gap-16 lg:p-6 ${
                        reversed ? "lg:[&>div:first-child]:order-2" : ""
                      }`}
                    >
                      <div className="relative">
                        <div className="relative aspect-[5/3.5] overflow-hidden rounded-2xl">
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/5" />
                        </div>
                      </div>

                      <div
                        className={`text-center lg:text-left ${reversed ? "lg:text-right" : ""}`}
                      >
                        <div
                          className={`mb-3 flex items-center justify-center gap-2 lg:justify-start ${
                            reversed ? "lg:justify-end" : ""
                          }`}
                        >
                          <span className="bg-primary/10 text-primary group-hover:bg-accent/10 group-hover:text-accent flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                            Step {index + 1}
                          </span>
                        </div>
                        <h3 className="text-text-dark text-xl font-semibold sm:text-2xl">
                          {step.title}
                        </h3>
                        <p className="text-text-dark/65 mx-auto mt-2 max-w-md text-sm leading-6 sm:text-base sm:leading-7 lg:mx-0">
                          {step.caption}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>

                  {index < PROCESS_STEPS.length - 1 && (
                    <div
                      className="border-primary/25 mx-auto my-4 h-8 w-px border-l-2 border-dashed sm:h-10 lg:h-12"
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
        {/* =====================================================
             CTA
              ====================================================== */}
        <ScrollReveal>
          <section className="group border-primary/20 bg-surface/55 relative overflow-hidden rounded-[2rem] border px-5 py-10 shadow-xl backdrop-blur-xl sm:px-8 sm:py-14 lg:px-12 lg:py-16">
            {/* Background decorative glow */}
            <div
              className="bg-primary/10 absolute -top-24 -right-20 h-56 w-56 rounded-full blur-3xl"
              style={{
                animation: "float-slow 7s ease-in-out infinite",
              }}
            />

            <div
              className="bg-accent/10 absolute -bottom-24 -left-20 h-56 w-56 rounded-full blur-3xl"
              style={{
                animation: "float-slow 8s ease-in-out infinite 1s",
              }}
            />

            {/* Decorative dots */}
            <div className="absolute top-8 right-8 grid grid-cols-3 gap-1.5 opacity-30 sm:top-10 sm:right-12">
              {[...Array(9)].map((_, index) => (
                <span key={index} className="bg-primary h-1.5 w-1.5 rounded-full" />
              ))}
            </div>

            <div className="absolute bottom-8 left-8 grid grid-cols-3 gap-1.5 opacity-20 sm:bottom-10 sm:left-12">
              {[...Array(9)].map((_, index) => (
                <span key={index} className="bg-accent h-1.5 w-1.5 rounded-full" />
              ))}
            </div>

            <div className="relative mx-auto max-w-3xl text-center">
              {/* Icon */}
              <div className="border-primary/15 bg-primary/10 text-primary group-hover:bg-accent/10 group-hover:text-accent mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Sparkles className="h-6 w-6" />
              </div>

              {/* Small label */}
              <span className="text-accent text-xs font-semibold tracking-[0.18em] uppercase">
                Your idea starts here
              </span>

              {/* Heading */}
              <h2 className="text-text-dark mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Apna Design <span className="text-accent">Aaj Hi</span> Shuru Karein
              </h2>

              {/* Description */}
              <p className="text-text-dark/65 mx-auto mt-4 max-w-xl text-justify text-sm leading-6 sm:text-center sm:text-base sm:leading-7">
                Aapke paas idea hai? Hum usay ek real product mein badalne mein madad
                karte hain. Mugs, shirts, bags aur bahut kuch — apni pasand ke design ke
                sath.
              </p>

              {/* CTA button */}
              <div className="mt-7 flex justify-center">
                <CtaButton href="/shop">Start Creating</CtaButton>
              </div>

              {/* Bottom trust line */}
              <div className="text-text-dark/45 mt-6 flex items-center justify-center gap-2 text-xs">
                <span className="bg-primary/15 h-1.5 w-1.5 rounded-full" />
                Custom printing made simple
                <span className="bg-accent/30 h-1.5 w-1.5 rounded-full" />
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}
