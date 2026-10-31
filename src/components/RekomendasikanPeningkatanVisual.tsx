html
<article class="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
  <!-- Image Container -->
  <div class="relative aspect-square w-full overflow-hidden bg-slate-100">
    <img 
      src="/images/majun-putih.webp" 
      alt="Kain Majun Putih Katun" 
      class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      loading="lazy"
    />
    <!-- Stock Badge -->
    <span class="absolute left-3 top-3 inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
      Stok Habis (Indent Bal)
    </span>
  </div>

  <!-- Content -->
  <div class="flex flex-1 flex-col p-4">
    <!-- Spec Chips -->
    <div class="mb-2 flex flex-wrap gap-1.5">
      <span class="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">Katun 100%</span>
      <span class="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">Jahit Tumpuk</span>
      <span class="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-600/20">Serap Oli Tinggi</span>
    </div>

    <!-- Title & Code -->
    <p class="text-xs font-mono text-slate-400">SKU: MAJUN_PUTIH</p>
    <h3 class="text-base font-semibold text-slate-900 line-clamp-1">Kain Majun Putih Katun Super</h3>

    <!-- Pricing -->
    <div class="mt-3 flex items-baseline gap-1">
      <span class="text-lg font-bold text-slate-900">Rp 12.500</span>
      <span class="text-xs text-slate-500">/ kg</span>
    </div>
    <p class="text-[11px] text-slate-400">Min. order 25 kg (1 karung)</p>

    <!-- Adaptive CTA -->
    <div class="mt-4 pt-2 border-t border-slate-100">
      <a 
        href="https://wa.me/6281234567890?text=Tanya%20jadwal%20bal%20MAJUN_PUTIH" 
        class="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        Tanya Stok via WA
      </a>
    </div>
  </div>
</article>