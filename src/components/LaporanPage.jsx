import { X } from 'lucide-react';
import React, { useState } from 'react';
import { formatBulan } from '../utils/formatBulan';

const LaporanPage = ({ data }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Langkah 1: Kelompokkan data berdasarkan bulan
  const grouped = data.reduce((acc, curr) => {
    const bulan = curr.tanggal.slice(0, 7); // ambil "YYYY-MM"
    if (!acc[bulan]) {
      acc[bulan] = { pemasukan: 0, pengeluaran: 0 };
    }

    if (curr.jenis === 'Pemasukan') {
      acc[bulan].pemasukan += curr.jumlah;
    } else {
      acc[bulan].pengeluaran += curr.jumlah;
    }

    return acc;
  }, {});

  // Langkah 2: Ubah jadi array dan urutkan berdasarkan bulan
  const summary = Object.entries(grouped)
    .map(([bulan, value]) => ({
      bulan,
      pemasukan: value.pemasukan,
      pengeluaran: value.pengeluaran,
      saldo: value.pemasukan - value.pengeluaran,
    }))
    .sort((a, b) => (a.bulan < b.bulan ? 1 : -1)); // terbaru duluan

  // Langkah 3: Ambil data transaksi detail per bulan
  const getDetailByMonth = (monthKey) => {
    return data.filter((tx) => tx.tanggal.startsWith(monthKey));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-green-900">
        Laporan Bulanan
      </h2>
      <div className="bg-white p-4 rounded shadow border border-green-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="text-left p-2">Bulan</th>
              <th className="text-left p-2">Pemasukan</th>
              <th className="text-left p-2">Pengeluaran</th>
              <th className="text-left p-2">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item, i) => (
              <tr
                key={i}
                className={`cursor-pointer ${
                  i % 2 === 0 ? 'bg-white' : 'bg-green-50'
                } hover:bg-green-100`}
                onClick={() => {
                  setSelectedMonth({
                    key: item.bulan,
                    details: getDetailByMonth(item.bulan),
                  });
                  setShowModal(true);
                }}
              >
                <td className="p-2">{formatBulan(item.bulan)}</td>
                <td className="p-2 text-green-600">
                  Rp {item.pemasukan.toLocaleString('id-ID')}
                </td>
                <td className="p-2 text-red-600">
                  Rp {item.pengeluaran.toLocaleString('id-ID')}
                </td>
                <td className="p-2 font-semibold">
                  Rp {item.saldo.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {summary.length === 0 && (
          <div className="text-center text-sm py-4">
            Belum ada data laporan.
          </div>
        )}
      </div>

      {showModal && selectedMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl relative animate-fadeIn p-6 border border-green-100">
            {/* Tombol close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition z-10 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="sticky top-0 bg-white pb-3 mb-4 border-b border-green-200">
              <h2 className="text-xl font-semibold text-green-800">
                Detail Transaksi - {formatBulan(selectedMonth.key)}
              </h2>
            </div>

            {/* Konten */}
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-100">
              <table className="w-full text-sm">
                <thead className="bg-green-100 text-green-800 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 text-left">Tanggal</th>
                    <th className="py-2 px-3 text-left">Jenis</th>
                    <th className="py-2 px-3 text-left">Deskripsi</th>
                    <th className="py-2 px-3 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMonth.details.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}
                    >
                      <td className="py-2 px-3">{item.tanggal}</td>
                      <td
                        className={`py-2 px-3 font-medium ${
                          item.jenis === 'Pengeluaran'
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {item.jenis}
                      </td>
                      <td className="py-2 px-3">{item.deskripsi}</td>
                      <td className="py-2 px-3 text-right">
                        Rp {item.jumlah.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaporanPage;
