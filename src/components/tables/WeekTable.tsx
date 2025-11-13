import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { LaporanItem, formatRuteLaporan, formatDateTime } from "../../../services/laporan.services";
import Alert from "../ui/alert/Alert";
import { useDeleteLaporan } from "@/hooks/useDeleteLaporan";

interface WeekTableProps {
  data: LaporanItem[];
  isLoading?: boolean;
}

export default function WeekTable({ data, isLoading = false }: WeekTableProps) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const { handleDelete: deleteItem, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDeleteLaporan();

  // Handle Edit
  const handleEdit = (item: LaporanItem) => {
    console.log("Edit laporan:", item.id);
    // TODO: Implementasi edit logic
  };

  // Handle Delete dengan hook
  const handleDelete = async (item: LaporanItem) => {
    const success = await deleteItem(item.id, item.surat_jalan);
    if (success) {
      setShowDeleteAlert(true);
      setTimeout(() => setShowDeleteAlert(false), 5000);
    }
  };
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-8">
        <div className="flex justify-center items-center">
          <div className="text-gray-500 dark:text-gray-400">Memuat data...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-8">
        <div className="flex justify-center items-center">
          <div className="text-gray-500 dark:text-gray-400">Tidak ada data untuk periode ini</div>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {/* Delete Alert */}
      {showDeleteAlert && deleteSuccess && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-right-5 duration-300">
          <Alert
            variant="success"
            title="Berhasil"
            message="Laporan berhasil dihapus"
          />
        </div>
      )}

      {showDeleteAlert && deleteError && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-right-5 duration-300">
          <Alert
            variant="error"
            title="Error"
            message={deleteError}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto max-h-[600px] overflow-y-auto">
        <div className="min-w-[2000px] relative">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] sticky top-0 z-40 bg-white dark:bg-gray-900">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  No
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  No Surat Jalan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  No Seal
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nama Driver
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nama Rute
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Jenis Rute
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ritase
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Plat Nomor
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Keterangan Plat
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Jenis Kendaraan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Jenis Trip
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Waktu Berangkat
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Waktu Tiba
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Rate Sebelum Tax
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  PPN 1,1%
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  PPH 2%
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Setelah Tax
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Keterangan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="text-gray-800 dark:text-white/90 font-medium">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-start text-theme-sm">
                    {item.surat_jalan}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-start text-theme-sm">
                    {item.no_seal}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-start text-theme-sm font-medium">
                    {item.driver}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-start text-theme-sm">
                    {formatRuteLaporan(item.ruteLaporan)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-start text-theme-sm">
                    {item.rute}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-start text-theme-sm">
                    {item.ritase}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-start text-theme-sm font-medium">
                    {item.no_plat}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-start text-theme-sm">
                    {item.ket_plat}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-start text-theme-sm">
                    {item.mobil}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-start text-theme-sm">
                    {item.trip}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-start text-theme-sm">
                    {formatDateTime(item.keberangkatan)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-start text-theme-sm">
                    {formatDateTime(item.kedatangan)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-start text-theme-sm font-medium">
                    {formatCurrency(item.rate_before_tax)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-start text-theme-sm">
                    {formatCurrency(item.ppn_rate)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-start text-theme-sm">
                    {formatCurrency(item.pph_rate)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90 text-start text-theme-sm font-semibold">
                    {formatCurrency(item.rate_after_tax)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-start text-theme-sm">
                    {item.keterangan || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 rounded transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
    </>
  );
}
