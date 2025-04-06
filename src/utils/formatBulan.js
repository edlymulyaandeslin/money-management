export const formatBulan = (bulanStr) => {
  const [tahun, bulan] = bulanStr.split('-');
  const date = new Date(tahun, bulan - 1); // bulan dimulai dari 0
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
};
