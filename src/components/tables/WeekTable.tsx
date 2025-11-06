import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { LaporanItem, formatRuteLaporan, formatDateTime } from "../../../services/laporan.services";

interface WeekTableProps {
  data: LaporanItem[];
  isLoading?: boolean;
}

export default function WeekTable({ data, isLoading = false }: WeekTableProps) {
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[2000px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
