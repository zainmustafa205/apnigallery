import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface flex min-h-screen flex-col">
      {/* Minimal header — logo only, no nav, no links */}
      <header className="border-lavender border-b py-4">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="text-xl font-bold sm:text-2xl">
            <span className="text-primary">Apni</span>
            <span className="text-accent">Gallery</span>
            <span className="text-primary">.com</span>
          </span>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Minimal trust footer — contact only, no site links */}
      <footer className="border-lavender border-t py-6">
        <div className="text-text-dark/60 mx-auto max-w-5xl px-4 text-center text-sm">
          <p>Sawal ho to WhatsApp pe rabta karein — hum jaldi jawab dete hain.</p>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
