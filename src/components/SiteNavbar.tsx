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
        className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-all duration-200 hover:text-primary ${
          open || isParentActive ? "text-primary" : "text-zinc-550 dark:text-zinc-400"
        }`}
      >
        <span>{item.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        {/* Active Underline Indicator with glow */}
        {isParentActive && (
          <span className="absolute bottom-[-16px] left-3 right-3 h-[2px] rounded-full bg-primary shadow-[0_0_8px_rgba(56,116,255,0.6)]" />
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2.5 w-64 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md py-2.5 shadow-xl shadow-zinc-250/50 dark:shadow-black/40 z-50">
          {item.children?.map((child) => {
            const isChildActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onToggle}
                className={`block px-4.5 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-xl mx-1.5 transition-colors group ${
                  isChildActive ? "bg-primary/5 dark:bg-primary/10" : ""
                }`}
              >
                <p className={`text-sm font-bold transition-colors ${
                  isChildActive ? "text-primary" : "text-zinc-700 dark:text-zinc-350 group-hover:text-zinc-950 dark:group-hover:text-zinc-50"
                }`}>
                  {child.label}
                </p>
                {child.desc && (
                  <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 leading-normal">{child.desc}</p>
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100/80 dark:border-zinc-900/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm transition-all duration-300">
      {/* Dynamic bottom gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8 relative z-10">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          {/* Icon badge with gradient and shadow */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary-hover text-white text-xs font-black tracking-tight select-none shadow-sm shadow-primary/25 transition-transform duration-300 group-hover:scale-105 active:scale-95">
            SM
          </div>
          <span className="text-lg tracking-tight select-none">
            <span className="font-extrabold text-zinc-950 dark:text-zinc-50 transition-colors group-hover:text-primary">SIDARMA</span>
            <span className="font-medium text-primary ml-1">MAJUN</span>
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
                className={`relative px-3 py-2 text-sm font-semibold transition-all duration-200 hover:text-primary ${
                  active ? "text-primary" : "text-zinc-550 dark:text-zinc-400"
                }`}
              >
                {item.label}
                {/* Active Underline Indicator with glow */}
                {active && (
                  <span className="absolute bottom-[-16px] left-3 right-3 h-[2px] rounded-full bg-primary shadow-[0_0_8px_rgba(56,116,255,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── CTA & Theme Toggle ── */}
        <div className="hidden items-center gap-3.5 md:flex">
          {themeReady && (
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-150 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-all duration-300 hover:scale-105 active:scale-95 group"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4.5 w-4.5 text-amber-500 fill-amber-500 transition-transform duration-500 group-hover:rotate-45" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-zinc-650 transition-transform duration-500 group-hover:-rotate-12" />
              )}
            </button>
          )}
          <Button asChild size="sm" className="gap-1.5 bg-primary text-white hover:bg-primary-hover rounded-xl px-4 shadow-sm shadow-primary/15 transition-transform duration-200 active:scale-95">
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
              className="rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-all duration-300 active:scale-90 group"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4.5 w-4.5 text-amber-500 fill-amber-500 transition-transform duration-500 group-hover:rotate-45" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-zinc-650 transition-transform duration-500 group-hover:-rotate-12" />
              )}
            </button>
          )}
          <button
            className="rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-all duration-300 active:scale-90 group"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-zinc-650 dark:text-zinc-350 transition-transform duration-300 rotate-90 group-hover:rotate-180" />
            ) : (
              <Menu className="h-5 w-5 text-zinc-650 dark:text-zinc-350 transition-transform duration-300 group-hover:scale-110" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md ${
          mobileOpen ? "max-h-[600px] opacity-100 py-3" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4">
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <div key={item.label} className="pb-1.5">
                  <p className="px-3 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {item.label}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {item.children.map((child) => {
                      const active = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                            active
                              ? "text-primary bg-primary/5 dark:bg-primary/10 pl-5 font-bold"
                              : "text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:pl-5 hover:text-primary"
                          }`}
                        >
                          <span>{child.label}</span>
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }
            const active = isActive(item.href!);
            return (
              <Link
                key={item.label}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "text-primary bg-primary/5 dark:bg-primary/10 pl-5 font-bold"
                    : "text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:pl-5 hover:text-primary"
                }`}
              >
                <span>{item.label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
              </Link>
            );
          })}
          <div className="mt-3 border-t border-zinc-100 dark:border-zinc-900 pt-3 pb-1">
            <Button asChild className="w-full gap-2 bg-primary text-white hover:bg-primary-hover h-11 text-sm py-2.5 rounded-xl font-bold shadow-md shadow-primary/10 transition-transform duration-200 active:scale-[0.98]">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                Pesan via WhatsApp <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
