"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Nav structure ──────────────────────────────────────────── */
interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; desc?: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Katalog", href: "/katalog" },
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
  pathname,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  pathname: string;
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

  const isParentActive = item.children?.some((child) => pathname === child.href);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-1 py-1 text-sm font-semibold transition-colors duration-150 ${
          open || isParentActive ? "text-primary" : "text-zinc-500 hover:text-zinc-950"
        }`}
      >
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-zinc-100 bg-white py-2 shadow-lg shadow-zinc-200/60 z-50">
          {item.children?.map((child) => {
            const isChildActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onToggle}
                className={`block px-4 py-2.5 hover:bg-zinc-50 transition-colors group ${
                  isChildActive ? "bg-zinc-50/50" : ""
                }`}
              >
                <p className={`text-sm font-semibold transition-colors ${
                  isChildActive ? "text-primary" : "text-zinc-800 group-hover:text-zinc-950"
                }`}>
                  {child.label}
                </p>
                {child.desc && (
                  <p className="mt-0.5 text-xs text-zinc-400">{child.desc}</p>
                )}
              </Link>
            );
          })}
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [themeReady, setThemeReady] = useState(false);
  const pathname = usePathname() || "";

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("majun-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";
    setTheme(nextTheme);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("majun-theme", theme);
  }, [theme, themeReady]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const toggleDropdown = (label: string) =>
    setOpenDropdown((prev) => (prev === label ? null : label));

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/katalog") return pathname === "/katalog" || pathname.startsWith("/produk");
    if (href === "/artikel") return pathname === "/artikel" || pathname.startsWith("/artikel/");
    if (href === "/karir") return pathname === "/karir" || pathname.startsWith("/karir/");
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {/* Icon badge */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold tracking-tight select-none">
            SM
          </div>
          <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            {companyName.replace("CV. ", "")}
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <Dropdown
                  key={item.label}
                  item={item}
                  open={openDropdown === item.label}
                  onToggle={() => toggleDropdown(item.label)}
                  pathname={pathname}
                />
              );
            }
            const active = isActive(item.href!);
            return (
              <Link
                key={item.label}
                href={item.href!}
                className={`px-3 py-1 text-sm font-semibold transition-colors duration-150 ${
                  active ? "text-primary" : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── CTA & Theme Toggle ── */}
        <div className="hidden items-center gap-3.5 md:flex">
          {themeReady && (
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-500 fill-amber-500" /> : <Moon className="h-4 w-4 text-zinc-650" />}
            </button>
          )}
          <Button asChild size="sm" className="gap-1.5 bg-primary text-white hover:bg-primary-hover rounded-lg px-4">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              Pesan Sekarang
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>

        {/* ── Mobile Theme Toggle & Hamburger ── */}
        <div className="flex items-center gap-1 md:hidden">
          {themeReady && (
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5 text-amber-500 fill-amber-500" /> : <Moon className="h-4.5 w-4.5 text-zinc-650" />}
            </button>
          )}
          <button
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 md:hidden">
          <nav className="flex flex-col gap-0.5 p-3">
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="pb-1">
                    <p className="px-2.5 pt-2 pb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {item.label}
                    </p>
                    {item.children.map((child) => {
                      const active = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block rounded-lg px-2.5 py-1.5 text-xs xs:text-sm transition-colors ${
                            active ? "text-primary font-bold bg-zinc-50 dark:bg-zinc-900" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                );
              }
              const active = isActive(item.href!);
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs xs:text-sm transition-colors ${
                    active ? "text-primary font-bold bg-zinc-50 dark:bg-zinc-900" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-zinc-100 dark:border-zinc-900 pt-2.5">
              <Button asChild className="w-full gap-2 bg-primary text-white hover:bg-primary-hover h-8 text-xs py-1.5 rounded-lg font-bold">
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
