export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b border-black/10 px-6 py-4">
        <p className="text-sm text-black/50">[Website Header placeholder — Chat 8]</p>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-black/10 px-6 py-8">
        <p className="text-sm text-black/50">[Website Footer placeholder — Chat 8]</p>
      </footer>
    </>
  );
}
