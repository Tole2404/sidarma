import Link from "next/link";
import { Factory } from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com/sidarmamajun",
    svg: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/sidarmamajun",
    svg: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/6281234567890",
    svg: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

interface SiteFooterProps {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  hoursWeekday?: string;
  hoursSaturday?: string;
  hoursSunday?: string;
  footerDesc?: string;
}

export default function SiteFooter({
  companyName = "CV. SIDARMA MAJUN",
  address = "Jl. Industri Maju No. 18, Bandung",
  phone = "0812-3456-7890",
  email = "sidarmamajun@gmail.com",
  hoursWeekday = "Senin — Jumat: 08.00 — 17.00",
  hoursSaturday = "Sabtu: 08.00 — 14.00",
  hoursSunday = "Minggu: Tutup",
  footerDesc = "Penyedia kain majun putih dan warna berkualitas untuk kebutuhan industri, bengkel, rumah sakit, dan cleaning service.",
}: SiteFooterProps) {
  const navLinks: [string, string][] = [
    ["/#produk", "Produk"],
    ["/jual-bongkaran", "Jual Bongkaran"],
    ["/artikel", "Artikel"],
    ["/karir", "Karir"],
    ["/kalkulator", "Kalkulator"],
    ["/lacak-pesanan", "Lacak Pesanan"],
  ];
  return (
    <footer
      id="kontak"
      className="border-t border-zinc-900 bg-zinc-950 px-6 py-10 sm:py-16 lg:px-8 text-zinc-400"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20">
                <Factory className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                {companyName}
              </span>
            </div>
            <div 
              className="text-xs sm:text-sm leading-relaxed text-zinc-400 max-w-sm prose prose-invert"
              dangerouslySetInnerHTML={{ __html: footerDesc }}
            />
            <div className="flex gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-450 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-zinc-900 transition-all duration-300"
                >
                  {s.svg}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
              <div>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500">WhatsApp</p>
                <p className="mt-0.5 text-xs sm:text-sm font-semibold text-zinc-200">{phone}</p>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500">Email</p>
                <p className="mt-0.5 text-xs sm:text-sm font-semibold text-zinc-200">{email}</p>
              </div>
            </div>
          </div>
 
          {/* Navigation column */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">Navigasi</h4>
            <ul className="mt-3 sm:mt-5 space-y-2">
              {navLinks.map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs sm:text-sm text-zinc-400 hover:text-emerald-400 transition-colors duration-200 font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Hours column */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">Jam Operasional</h4>
            <ul className="mt-3 sm:mt-5 space-y-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              <li className="flex justify-between border-b border-zinc-900 pb-1">
                <span className="text-zinc-500">Weekday</span>
                <span className="font-medium text-zinc-350">{hoursWeekday.replace("Senin — Jumat: ", "")}</span>
              </li>
              <li className="flex justify-between border-b border-zinc-900 pb-1">
                <span className="text-zinc-500">Sabtu</span>
                <span className="font-medium text-zinc-350">{hoursSaturday.replace("Sabtu: ", "")}</span>
              </li>
              <li className="flex justify-between pb-1">
                <span className="text-zinc-500">Minggu</span>
                <span className="font-medium text-rose-400">{hoursSunday.replace("Minggu: ", "")}</span>
              </li>
            </ul>
            <div className="mt-4 rounded-xl bg-zinc-900/30 border border-zinc-900 px-3 py-2.5">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500">Alamat Kantor</p>
              <p className="mt-0.5 text-[11px] sm:text-xs leading-relaxed text-zinc-450">{address}</p>
            </div>
          </div>
        </div>
 
        <div className="mt-10 sm:mt-16 border-t border-zinc-900 pt-6 text-center text-[10px] sm:text-xs text-zinc-600">
          © {new Date().getFullYear()} {companyName}. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
