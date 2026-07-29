import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | Admin Panel",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-black/10 p-4">
        <p className="text-sm text-black/50">[Admin Sidebar placeholder — Chat 14]</p>
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
