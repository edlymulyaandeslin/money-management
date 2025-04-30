import {
  ArrowLeft,
  BarChart2,
  BookDashed,
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search as SearchIcon,
  Trash,
  X,
} from 'lucide-react';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import './App.css';
import LaporanPage from './components/LaporanPage';
import LoginPage from './components/LoginPage';

const MENU_ITEMS = [
  { key: 'pemasukan', label: 'Dashboard', icon: <BookDashed size={20} /> },
  { key: 'laporan', label: 'Laporan', icon: <BarChart2 size={20} /> },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('pemasukan');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [notif, setNotif] = useState({ show: false, message: '' });

  const [allData, setAllData] = useState(() => {
    const saved = localStorage.getItem('dataKeuangan');
    return saved ? JSON.parse(saved) : [];
  });

  // form state
  const [formData, setFormData] = useState({
    jenis: 'Pemasukan',
    jumlah: '',
    deskripsi: '',
  });

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.jumlah || !formData.deskripsi) return;

    const newEntry = {
      tanggal: new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Jakarta',
      }),
      jenis: formData.jenis,
      deskripsi: formData.deskripsi,
      jumlah: parseInt(formData.jumlah),
    };

    const updated = [newEntry, ...allData];
    setAllData(updated);
    localStorage.setItem('dataKeuangan', JSON.stringify(updated));

    setNotif({ show: true, message: 'Data berhasil disimpan!' });

    setTimeout(() => {
      setNotif({ show: false, message: '' });
    }, 3000);

    // Reset form
    setFormData({ jenis: 'Pemasukan', jumlah: '', deskripsi: '' });
  };

  const currentMonth = DateTime.now()
    .setZone('Asia/Jakarta')
    .toFormat('yyyy-MM'); // Format YYYY-MM
  const thisMonthData = allData.filter((item) =>
    item.tanggal.startsWith(currentMonth)
  );

  console.log(currentMonth);

  const totalPemasukan = thisMonthData
    .filter((item) => item.jenis === 'Pemasukan')
    .reduce((sum, item) => sum + item.jumlah, 0);

  const totalPengeluaran = thisMonthData
    .filter((item) => item.jenis === 'Pengeluaran')
    .reduce((sum, item) => sum + item.jumlah, 0);

  const saldo = totalPemasukan - totalPengeluaran;

  // filter & search
  const filtered = allData
    .filter((tx) => tx.tanggal.startsWith(currentMonth))
    .filter((tx) => filterType === 'all' || tx.jenis === filterType)
    .filter(
      (tx) =>
        tx.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
        tx.tanggal.includes(search)
    );

  // pagination
  const perPage = 5;
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleDelete = (indexInPage) => {
    const globalIndex = (currentPage - 1) * perPage + indexInPage;

    if (!window.confirm('Yakin ingin menghapus data ini?')) return;

    const updated = [...allData];
    updated.splice(globalIndex, 1);
    setAllData(updated);
    localStorage.setItem('dataKeuangan', JSON.stringify(updated));

    setNotif({ show: true, message: 'Data berhasil dihapus!' });
    setTimeout(() => setNotif({ show: false, message: '' }), 3000);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="bg-green-600 text-white px-4 py-3 flex items-center justify-between shadow sticky top-0 z-20">
        <div className="flex items-center">
          <button
            className="md:hidden mr-3 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">Money Management</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 rounded bg-white text-green-900 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <SearchIcon
              className="absolute left-2 top-2 text-green-500"
              size={16}
            />
          </div>

          <a
            href="#"
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              setIsLoggedIn(false);
            }}
            className="hover:bg-green-500 px-3 py-1 rounded"
          >
            Logout
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`z-20 fixed inset-y-0 left-0 w-64 bg-green-700 text-white p-5 transform
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            transition-transform duration-200 ease-in-out
            md:relative md:translate-x-0`}
        >
          <div className="flex items-center justify-between md:hidden mb-6">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="focus:outline-none cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = activeMenu === item.key;
              const isExpense = item.key === 'pengeluaran';
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveMenu(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-2 px-3 py-2 rounded transition cursor-pointer
                    ${
                      isActive
                        ? isExpense
                          ? 'bg-red-500'
                          : 'bg-green-500'
                        : isExpense
                        ? 'hover:bg-red-600'
                        : 'hover:bg-green-600'
                    }
                  `}
                >
                  <span className={isExpense ? 'text-red-200' : 'text-white'}>
                    {item.icon}
                  </span>
                  <span className={isActive ? 'text-white' : 'text-white'}>
                    {item.label}
                  </span>
                </button>
              );
            })}
            <a
              href="#"
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                setIsLoggedIn(false);
              }}
              className="w-full flex items-center space-x-2 px-2 py-1 rounded transition md:hidden hover:bg-green-600"
            >
              <span>
                <ArrowLeft />
              </span>
              <span>Logout</span>
            </a>
          </nav>
        </aside>

        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-25 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Notifikasi */}
        {notif.show && (
          <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-slide-in z-50">
            <span className="flex gap-2">
              <Check /> {notif.message}
            </span>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4 text-green-900">
            Pemasukan & Pengeluaran
          </h2>

          {activeMenu === 'pemasukan' && (
            <>
              {/* Ringkasan Bulan Ini */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-100 p-4 rounded-lg shadow border border-green-200">
                  <h3 className="text-green-800 font-semibold text-lg mb-1">
                    Total Pemasukan Bulan Ini
                  </h3>
                  <p className="text-2xl text-green-700 font-bold">
                    Rp {totalPemasukan.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg shadow border border-red-200">
                  <h3 className="text-red-800 font-semibold text-lg mb-1">
                    Total Pengeluaran Bulan Ini
                  </h3>
                  <p className="text-2xl text-red-700 font-bold">
                    Rp {totalPengeluaran.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg shadow border border-green-200">
                  <h3 className="text-green-800 font-semibold text-lg mb-1">
                    Sisa Saldo
                  </h3>
                  <p className="text-2xl text-green-700 font-bold">
                    Rp {saldo.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="bg-white p-6 rounded-lg shadow mb-6 border border-green-100">
                <form
                  onSubmit={handleSubmit}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <div>
                    <label className="block font-medium mb-1 text-green-900">
                      Jenis
                    </label>
                    <select
                      value={formData.jenis}
                      onChange={(e) =>
                        setFormData({ ...formData, jenis: e.target.value })
                      }
                      className="w-full border border-green-300 rounded p-2 focus:ring-green-300 focus:border-green-300"
                    >
                      <option>Pemasukan</option>
                      <option>Pengeluaran</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-green-900">
                      Jumlah
                    </label>
                    <input
                      type="number"
                      value={formData.jumlah}
                      onChange={(e) =>
                        setFormData({ ...formData, jumlah: e.target.value })
                      }
                      min={1000}
                      placeholder="0.00"
                      className="w-full border border-green-300 rounded p-2 focus:ring-green-300 focus:border-green-300"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-1 text-green-900">
                      Deskripsi
                    </label>
                    <input
                      type="text"
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData({ ...formData, deskripsi: e.target.value })
                      }
                      placeholder="Contoh: Gaji Bulanan"
                      className="w-full border border-green-300 rounded p-2 focus:ring-green-300 focus:border-green-300"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 text-right">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition cursor-pointer"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>

              {/* Filter & Search (mobile) */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <label className="text-green-900">Filter:</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-green-300 rounded p-1 focus:ring-green-300 focus:border-green-300"
                  >
                    <option value="all">Semua</option>
                    <option value="Pemasukan">Pemasukan</option>
                    <option value="Pengeluaran">Pengeluaran</option>
                  </select>
                </div>
                <div className="relative md:hidden">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1 rounded bg-white text-green-900 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                  <SearchIcon
                    className="absolute left-2 top-2 text-green-500"
                    size={16}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-white p-4 rounded-lg shadow overflow-x-auto border border-green-100">
                <table className="min-w-full divide-y divide-green-100">
                  <thead className="bg-green-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-green-800">
                        Tanggal
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-green-800">
                        Jenis
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-green-800">
                        Deskripsi
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-green-800">
                        Jumlah
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-green-800">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((tx, i) => (
                      <tr
                        key={i}
                        className={`transition ${
                          i % 2 === 0 ? 'bg-white' : 'bg-green-50'
                        } hover:bg-gray-200`}
                      >
                        <td className="px-4 py-3 text-sm text-green-900">
                          {tx.tanggal}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm ${
                            tx.jenis === 'Pengeluaran'
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {tx.jenis}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-900">
                          {tx.deskripsi}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-green-900">
                          Rp {tx.jumlah.toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(i)}
                            className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                          >
                            <Trash size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {pageData.length == 0 && (
                      <tr className="hover:bg-gray-200">
                        <td
                          colSpan={5}
                          className="text-center px-4 py-3 text-sm"
                        >
                          Data kosong
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-green-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="text-green-600" size={20} />
                  </button>
                  <span className="text-sm text-green-900">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-green-50 disabled:opacity-50"
                  >
                    <ChevronRight className="text-green-600" size={20} />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeMenu === 'laporan' && <LaporanPage data={allData} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-green-100 text-center py-4 text-sm text-green-800">
        &copy; 2025 Money Management. Built with 🔥 by <strong>Elin</strong>.
      </footer>
    </div>
  );
}

export default App;
