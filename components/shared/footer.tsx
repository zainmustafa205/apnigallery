"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto w-full">
      <div className="bg-[var(--color-primary)] py-10 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <span className="text-lg font-extrabold">
                Apni<span className="text-[var(--color-accent)]">Gallery</span>.com
              </span>
              <p className="mt-2 text-sm text-white/70">
                Apni yaadon ko khoobsurat tohfon ki shakal dein — har lamha, ek nayi
                kahani.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <SocialIcon icon={<FacebookIcon />} href="#" bg="#1877F2" />
                <SocialIcon
                  icon={<InstagramIcon />}
                  href="#"
                  bg="linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)"
                />
                <SocialIcon icon={<YoutubeIcon />} href="#" bg="#FF0000" />
                <SocialIcon icon={<TikTokIcon />} href="#" bg="#000000" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-3 font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="transition-colors hover:text-white">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="transition-colors hover:text-white">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-white">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="mb-3 font-semibold">Customer Service</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="/faqs" className="transition-colors hover:text-white">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/track-order"
                    className="transition-colors hover:text-white"
                  >
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/bulk-order" className="transition-colors hover:text-white">
                    Bulk Orders
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition-colors hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-3 font-semibold">Contact</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <Phone size={14} className="flex-shrink-0" />
                  0300-1234567
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} className="flex-shrink-0" />
                  info@apnigallery.com
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  Lahore, Pakistan
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} ApniGallery.com — All rights reserved.
            </p>
            <p className="text-xs text-white/50">
              Cash on Delivery • JazzCash • Easypaisa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  icon,
  href,
  bg,
}: {
  icon: React.ReactNode;
  href: string;
  bg: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
      style={{ background: bg }}
    >
      {icon}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.256 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.059-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.566.683-.747 1.15-.137.352-.3.881-.344 1.857-.048 1.053-.058 1.37-.058 4.04 0 2.67.01 2.987.058 4.04.045.976.207 1.505.344 1.858.181.466.398.8.748 1.15.35.35.683.566 1.15.747.352.137.881.3 1.857.344 1.053.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.181.8-.398 1.15-.748.35-.35.566-.683.747-1.15.137-.352.3-.881.344-1.857.048-1.053.058-1.37.058-4.04 0-2.67-.01-2.987-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.09 3.09 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.747c-.352-.137-.881-.3-1.857-.344-1.053-.048-1.37-.058-4.04-.058zm0 4.594a5.604 5.604 0 1 1 0 11.208 5.604 5.604 0 0 1 0-11.208zm0 1.802a3.802 3.802 0 1 0 0 7.604 3.802 3.802 0 0 0 0-7.604zm5.83-1.998a1.31 1.31 0 1 1-2.62 0 1.31 1.31 0 0 1 2.62 0z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}
