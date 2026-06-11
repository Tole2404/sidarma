"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Nav structure ──────────────────────────────────────────── */
interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; desc?: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Produk", href: "/#produk" },
  {
    label: "Layanan",
    children: [
      { label: "Jual Bongkaran", href: "/jual-bongkaran", desc: "Kami beli kain sisa konveksi Anda" },
      { label: "Kalkulator Harga", href: "/kalkulator", desc: "Estimasi biaya sebelum order" },
      { label: "Lacak Pesanan", href: "/lacak-pesanan", desc: "Cek status pengiriman real-time" },
    ],
  },
  { label: "Artikel", href: "/artikel" },
  { label: "Karir", href: "/karir" },
  {
    label: "Info",
    children: [
      { label: "Tentang Kami", href: "/#tentang", desc: "Kenali CV. SIDARMA MAJUN" },
      { label: "Kontak", href: "/#kontak", desc: "Hubungi tim kami" },
    ],
  },
];

/* ─── Dropdown ───────────────────────────────────────────────── */
function Dropdown({
  item,
  open,
  onToggle,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (open) onToggle();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-1 py-1 text-sm font-medium transition-colors duration-150 ${
          open ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-950"
        }`}
      >
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-zinc-100 bg-white py-2 shadow-lg shadow-zinc-200/60 z-50">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onToggle}
              className="block px-4 py-2.5 hover:bg-zinc-50 transition-colors group"
            >
              <p className="text-sm font-medium text-zinc-800 group-hover:text-zinc-950">
                {child.label}
              </p>
              {child.desc && (
                <p className="mt-0.5 text-xs text-zinc-400">{child.desc}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Navbar ────────────────────────────────────────────── */
interface SiteNavbarProps {
  companyName?: string;
}

export default function SiteNavbar({ companyName = "CV. SIDARMA MAJUN" }: SiteNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) =>
    setOpenDropdown((prev) => (prev === label ? null : label));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {/* Icon badge */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white text-xs font-bold tracking-tight select-none">
            SM
          </div>
          <span className="text-base font-bold tracking-tight text-zinc-950">
            {companyName.replace("CV. ", "")}
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <Dropdown
                key={item.label}
                item={item}
                open={openDropdown === item.label}
                onToggle={() => toggleDropdown(item.label)}
              />
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="px-3 py-1 text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors duration-150"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* ── CTA ── */}
        <div className="hidden items-center gap-3 md:flex">
          <Button asChild size="sm" className="gap-1.5 bg-zinc-950 text-white hover:bg-zinc-800 rounded-lg px-4">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              Pesan Sekarang
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-colors md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="border-t border-zinc-100 bg-white md:hidden">
          <nav className="flex flex-col gap-0.5 p-4">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-3 border-t border-zinc-100 pt-3">
              <Button asChild size="sm" className="w-full gap-2 bg-zinc-950 text-white hover:bg-zinc-800">
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                  Pesan via WhatsApp <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
