export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--color-primary)] py-10 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold">
              Apni<span className="text-[var(--color-accent)]">Gallery</span>
            </h3>
            <p className="text-sm text-white/70">
              Apni yaadein, hamari printing. Custom mugs, shirts, aur bags — apni design
              ke sath.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="/shop" className="hover:text-white">
                  Shop
                </a>
              </li>
              <li>
                <a href="/track-order" className="hover:text-white">
                  Track Order
                </a>
              </li>
              <li>
                <a href="/bulk-order" className="hover:text-white">
                  Bulk Orders
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Contact</h4>
            <p className="text-sm text-white/70">WhatsApp: 0300-1234567</p>
            <p className="text-sm text-white/70">Email: info@apnigallery.com</p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} ApniGallery.com — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
