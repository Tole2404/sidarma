# Color Palette Guidelines — SIDARMA

Panduan sistem warna untuk website SIDARMA. Terinspirasi dari [Color Hunt](https://colorhunt.co/) dengan fokus pada tampilan **profesional**, **modern**, dan **industrial**.

---

## 🎨 Primary Color Palette

Palet utama menggunakan kombinasi **Slate Steel** (industrial) dengan aksen **Amber/Orange** (safety/industrial).

### Light Mode

| Nama | Hex | Tailwind | Penggunaan |
|------|-----|----------|------------|
| **Background** | `#F5F7F8` | `zinc-50` | Latar belakang utama |
| **Surface** | `#FFFFFF` | `white` | Card, modal, sidebar |
| **Border** | `#E4E4E7` | `zinc-200` | Garis pembatas |
| **Text Primary** | `#18181B` | `zinc-950` | Judul, teks utama |
| **Text Secondary** | `#71717A` | `zinc-500` | Teks pendukung |
| **Text Muted** | `#A1A1AA` | `zinc-400` | Placeholder, hint |

### Dark Mode

| Nama | Hex | Tailwind | Penggunaan |
|------|-----|----------|------------|
| **Background** | `#09090B` | `zinc-950` | Latar belakang utama |
| **Surface** | `#18181B` | `zinc-900` | Card, modal, sidebar |
| **Border** | `#3F3F46` | `zinc-700` | Garis pembatas |
| **Text Primary** | `#FAFAFA` | `zinc-50` | Judul, teks utama |
| **Text Secondary** | `#A1A1AA` | `zinc-400` | Teks pendukung |
| **Text Muted** | `#71717A` | `zinc-500` | Placeholder, hint |

---

## 🏭 Industrial Steel Theme (Custom)

Warna kustom yang sudah didefinisikan di `globals.css`:

```css
/* Industrial Steel Works */
--color-zinc-50: #F5F7F8;     /* Off-White Bersih */
--color-zinc-100: #ECF0F1;    /* Silver Mist */
--color-zinc-200: #D8DDE1;    /* Slate Border Terang */
--color-zinc-300: #BDC3C7;    /* Slate Muted */
--color-zinc-400: #95A5A6;    /* Gray-Green Muted */
--color-zinc-500: #7F8C8D;    /* Gray-Green Text */
--color-zinc-600: #34495E;    /* Slate Steel Dark */
--color-zinc-700: #2C3E50;    /* Slate Steel Utama */
--color-zinc-800: #202D3B;    /* Slate Steel Card */
--color-zinc-900: #1A252F;    /* Deep Ink */
--color-zinc-950: #111820;    /* Slate Black */

/* Safety Amber/Orange */
--color-amber-500: #F39C12;   /* Amber Utama */
--color-amber-600: #E67E22;   /* Deep Amber / Safety Orange */
--color-amber-700: #D35400;   /* Dark Orange */
```

---

## 🌈 Accent Colors

Warna aksen untuk status, badge, dan highlight:

### Success (Hijau)
| Nama | Hex | Tailwind | Penggunaan |
|------|-----|----------|------------|
| Light BG | `#ECFDF5` | `emerald-50` | Background badge sukses |
| Default | `#10B981` | `emerald-500` | Icon, text sukses |
| Dark | `#059669` | `emerald-600` | Button, link sukses |

### Warning (Amber)
| Nama | Hex | Tailwind | Penggunaan |
|------|-----|----------|------------|
| Light BG | `#FFFBEB` | `amber-50` | Background badge warning |
| Default | `#F59E0B` | `amber-500` | Icon, text warning |
| Dark | `#D97706` | `amber-600` | Button, link warning |

### Error (Merah)
| Nama | Hex | Tailwind | Penggunaan |
|------|-----|----------|------------|
| Light BG | `#FEF2F2` | `rose-50` | Background badge error |
| Default | `#F43F5E` | `rose-500` | Icon, text error |
| Dark | `#E11D48` | `rose-600` | Button, link error |

### Info (Biru)
| Nama | Hex | Tailwind | Penggunaan |
|------|-----|----------|------------|
| Light BG | `#EFF6FF` | `blue-50` | Background badge info |
| Default | `#3B82F6` | `blue-500` | Icon, text info |
| Dark | `#2563EB` | `blue-600` | Button, link info |

---

## 🎯 Color Hunt Inspirations

Palet warna dari [Color Hunt](https://colorhunt.co/) yang cocok untuk bisnis/SaaS:

### Palette 1: Professional Dark
```
#222831  →  Background gelap
#393E46  →  Surface/card
#00ADB5  →  Accent teal
#EEEEEE  →  Text terang
```
**Cocok untuk:** Dark mode, dashboard admin

### Palette 2: Clean Business
```
#F8F9FA  →  Background terang
#E9ECEF  →  Border/divider
#495057  →  Text utama
#212529  →  Heading
```
**Cocok untuk:** Light mode, landing page

### Palette 3: Industrial
```
#2C3E50  →  Primary dark (Slate Steel)
#34495E  →  Secondary dark
#ECF0F1  →  Background terang
#BDC3C7  →  Border/muted
```
**Cocok untuk:** Tema industrial SIDARMA ✅

### Palette 4: Modern Neutral
```
#1A1A2E  →  Deep background
#16213E  →  Card background
#0F3460  →  Accent blue
#E94560  →  Accent red/CTA
```
**Cocok untuk:** Modern tech look

### Palette 5: Warm Professional
```
#F5F5F5  →  Background
#ECECEC  →  Surface
#3D3D3D  →  Text
#FF6B35  →  Accent orange
```
**Cocok untuk:** Warm, friendly business

---

## 📐 Usage Guidelines

### Button Colors

```tsx
// Primary Button (Dark)
className="bg-zinc-950 hover:bg-zinc-900 text-white"

// Primary Button (Light/Outline)
className="border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-950"

// Success Button
className="bg-emerald-600 hover:bg-emerald-500 text-white"

// Danger Button
className="bg-rose-600 hover:bg-rose-500 text-white"
```

### Card Colors

```tsx
// Light Mode Card
className="bg-white border border-zinc-200 shadow-sm"

// Dark Mode Card
className="dark:bg-zinc-900 dark:border-zinc-800"

// Elevated Card
className="bg-white border border-zinc-200 shadow-md hover:shadow-lg"
```

### Text Hierarchy

```tsx
// Heading
className="text-zinc-950 dark:text-zinc-50"

// Body Text
className="text-zinc-600 dark:text-zinc-400"

// Muted/Caption
className="text-zinc-500 dark:text-zinc-500"

// Placeholder
className="text-zinc-400 dark:text-zinc-600"
```

---

## 🌓 Dark Mode Implementation

Dark mode sudah diimplementasikan menggunakan class `dark` pada `<html>`:

```tsx
// Toggle dark mode
document.documentElement.classList.toggle("dark", isDark);

// Simpan preferensi
localStorage.setItem("majun-theme", isDark ? "dark" : "light");
```

### CSS Variables (globals.css)

```css
@layer base {
  :root {
    color-scheme: light;
  }

  html.dark {
    color-scheme: dark;
  }
}
```

---

## ✅ Do's and Don'ts

### ✅ Do
- Gunakan `zinc` sebagai warna netral utama
- Gunakan `emerald` untuk status sukses/positif
- Gunakan `amber` untuk warning/highlight
- Gunakan `rose` untuk error/danger
- Pertahankan kontras yang baik (WCAG AA minimum)
- Gunakan shadow yang subtle (`shadow-sm`, `shadow-md`)

### ❌ Don't
- Jangan gunakan warna terlalu cerah/neon
- Jangan gunakan gradient berlebihan
- Jangan campur terlalu banyak warna aksen
- Jangan gunakan opacity terlalu rendah untuk teks
- Jangan gunakan warna yang sama untuk background dan text

---

## 🔗 Resources

- [Color Hunt](https://colorhunt.co/) — Inspirasi palet warna
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors) — Referensi warna Tailwind
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) — Cek kontras aksesibilitas
- [Coolors](https://coolors.co/) — Generator palet warna

---

*Dokumen ini adalah panduan warna untuk project SIDARMA. Update sesuai kebutuhan desain.*
