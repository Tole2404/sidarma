"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tags,
  ChevronLeft,
  X,
  HandCoins,
  LayoutDashboard,
  Layout,
  LogOut,
  Menu,
  Moon,
  Package,
  PackageOpen,
  Palette,
  Scissors,
  Search,
  ShoppingBag,
  Sun,
  Truck,
  Users,
  Wallet,
  Settings,
  Globe,
  Building2,
  BookOpen,
  Briefcase,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
}

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pembelian", href: "/purchases", icon: ShoppingBag },
  { name: "Bongkaran", href: "/bongkaran", icon: PackageOpen },
  { name: "Penjualan", href: "/sales", icon: HandCoins },
  { name: "Pengeluaran", href: "/expenses", icon: Wallet },
  { name: "Stok", href: "/stock", icon: Package },
  { name: "Harga Bal", href: "/bale-prices", icon: Tags },
  { name: "Customer", href: "/customers", icon: Users },
  { name: "Supplier", href: "/suppliers", icon: Truck },
  { name: "Konveksi", href: "/konveksi", icon: Building2 },
];

const settingsGroup = {
  name: "Pengaturan",
  icon: Settings,
  children: [
    { name: "Landing Page", href: "/dashboard/landing", icon: Globe },
    { name: "Footer", href: "/dashboard/footer", icon: Layout },
    { name: "Tema & Warna", href: "/dashboard/theme", icon: Palette },
    { name: "SEO", href: "/dashboard/seo", icon: Search },
    { name: "Artikel & Blog", href: "/dashboard/articles", icon: BookOpen },
    { name: "Karir & Pelamar", href: "/dashboard/careers", icon: Briefcase },
  ],
};

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const storedCollapsed = window.localStorage.getItem("majun-sidebar-collapsed");
    const storedTheme = window.localStorage.getItem("majun-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const nextCollapsed = storedCollapsed === "true";
    const nextTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";

    setCollapsed(nextCollapsed);
    setTheme(nextTheme);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem("majun-sidebar-collapsed", String(collapsed));
    document.documentElement.style.setProperty("--sidebar-width", collapsed ? "5.5rem" : "18rem");
  }, [collapsed, ready]);

  useEffect(() => {
    const syncCollapsedForViewport = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(false);
      }
    };

    syncCollapsedForViewport();
    window.addEventListener("resize", syncCollapsedForViewport);
    return () => window.removeEventListener("resize", syncCollapsedForViewport);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("majun-theme", theme);
  }, [ready, theme]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (
      pathname?.startsWith("/dashboard/landing") ||
      pathname?.startsWith("/dashboard/footer") ||
      pathname?.startsWith("/dashboard/theme") ||
      pathname?.startsWith("/dashboard/seo") ||
      pathname?.startsWith("/dashboard/articles") ||
      pathname?.startsWith("/dashboard/careers")
    ) {
      setSettingsOpen(true);
    }
  }, [pathname]);

  const navContent = (
    <div className="flex min-h-full lg:h-full flex-col">
      <div
        className={cn(
          "hidden lg:flex items-center border-b border-zinc-200 px-4 py-5",
          collapsed ? "flex-col justify-center gap-3" : "gap-3",
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
          <Package className="h-5 w-5" />
        </div>
        {!collapsed ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-950">Majun Admin</p>
              <p className="text-xs text-zinc-500">Administrasi usaha kain majun</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="sr-only">Ubah tema</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 lg:hidden"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Tutup navigasi</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hidden text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 lg:inline-flex"
                onClick={() => setCollapsed(true)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Ciutkan sidebar</span>
              </Button>
            </div>
          </>
        ) : null}
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Ubah tema</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 lg:inline-flex"
              onClick={() => setCollapsed(false)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Buka sidebar penuh</span>
            </Button>
          </div>
        ) : null}
      </div>

      <nav
        className={cn(
          "space-y-1 py-4 lg:flex-1 lg:min-h-0 lg:overflow-y-auto",
          collapsed ? "px-2" : "px-3",
        )}
      >
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname?.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              title={collapsed ? link.name : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center",
                isActive
                  ? "bg-primary text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed ? <span>{link.name}</span> : null}
            </Link>
          );
        })}

        {/* Settings section with dropdown */}
        {!collapsed ? (
          <div className="px-3 pt-4">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <Settings className="h-4 w-4" />
              <span>{settingsGroup.name}</span>
              <ChevronLeft className={`ml-auto h-4 w-4 transition-transform ${settingsOpen ? "rotate-90" : ""}`} />
            </button>
            {settingsOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-zinc-200 pl-3 dark:border-zinc-800">
                {settingsGroup.children.map((child) => {
                  const isActive = pathname === child.href || pathname?.startsWith(child.href + "/");
                  const ChildIcon = child.icon;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      )}
                    >
                      <ChildIcon className="h-4 w-4" />
                      {child.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={settingsGroup.children[0].href}
            title={settingsGroup.name}
            className={cn(
              "flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              settingsGroup.children.some((c) => pathname?.startsWith(c.href))
                ? "bg-primary text-white"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            )}
          >
            <Settings className="h-4 w-4" />
          </Link>
        )}
      </nav>

      {user ? (
        <div className={cn("border-t border-zinc-200 dark:border-zinc-800 p-3", collapsed && "px-2")}>
          <div
            className={cn(
              "rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-3",
              collapsed && "flex flex-col items-center px-2",
            )}
          >
            {!collapsed ? <p className="text-sm font-medium text-zinc-950 dark:text-zinc-250">{user.name}</p> : null}
            {!collapsed ? <p className="truncate text-xs text-zinc-500 dark:text-zinc-450">{user.email}</p> : null}
            <Button
              variant="ghost"
              title={collapsed ? "Keluar" : undefined}
              className={cn(
                "mt-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300",
                collapsed ? "h-10 w-10 rounded-full px-0" : "w-full justify-start px-2",
              )}
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed ? "Keluar" : null}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-950">Majun Admin</p>
              <p className="text-xs text-zinc-500">Dashboard</p>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Ubah tema</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCollapsed(false);
                setOpen(!open);
              }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle navigasi</span>
            </Button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {open && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto pb-8 backdrop-blur">
            {navContent}
          </div>
        )}
      </header>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 hidden border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-[width] duration-200 lg:block",
          collapsed ? "w-[5.5rem]" : "w-72",
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
