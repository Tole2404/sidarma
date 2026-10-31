html
<!-- Container tabel -->
<div class="overflow-x-auto border-2 border-black bg-white">
  <table class="w-full text-left text-base text-black">
    <!-- Header: hitam solid, teks putih, font tebal -->
    <thead class="bg-black text-white font-black tracking-wide">
      <tr>
        <th class="px-4 py-3 border-r-2 border-white">KODE</th>
        <th class="px-4 py-3 border-r-2 border-white">PRODUK</th>
        <th class="px-4 py-3 border-r-2 border-white text-right">STOK (KG)</th>
        <th class="px-4 py-3 text-center">STATUS</th>
      </tr>
    </thead>
    <!-- Body: teks hitam pekat, batas tebal, striping kontras -->
    <tbody class="divide-y-2 divide-black font-bold">
      <tr class="bg-white">
        <td class="px-4 py-3 border-r-2 border-black">MP-01</td>
        <td class="px-4 py-3 border-r-2 border-black">Majun Putih</td>
        <td class="px-4 py-3 border-r-2 border-black text-right text-neutral-950">0</td>
        <td class="px-4 py-3 text-center">
          <span class="inline-block px-2 py-1 bg-amber-400 text-black border-2 border-black font-black">
            KOSONG
          </span>
        </td>
      </tr>
      <tr class="bg-neutral-100">
        <td class="px-4 py-3 border-r-2 border-black">MW-01</td>
        <td class="px-4 py-3 border-r-2 border-black">Majun Warna</td>
        <td class="px-4 py-3 border-r-2 border-black text-right text-red-950 font-black">-200</td>
        <td class="px-4 py-3 text-center">
          <span class="inline-block px-2 py-1 bg-red-700 text-white border-2 border-black font-black">
            MINUS
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>