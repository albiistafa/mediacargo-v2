"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { 
  getAllLaporan, 
  LaporanItem, 
  formatRuteLaporan, 
  formatDateTime, 
  GetAllLaporanParams
} from "../../../services/laporan.services";
import Alert from "../ui/alert/Alert";
import { useDeleteLaporan } from "@/hooks/useDeleteLaporan";
import EditLaporanModal from "./EditLaporanModal";
import Button from "../ui/button/Button";

export default function BasicTableOne() {
  const [tableData, setTableData] = useState<LaporanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LaporanItem | null>(null);
  const [editAlert, setEditAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");

  const { handleDelete: deleteItem, error: deleteError, success: deleteSuccess } = useDeleteLaporan(() => {
    // Callback ketika delete berhasil - refresh data
    fetchData();
  });

  // Jumlah data per halaman (ubah sesuai kebutuhan)
  const itemsPerPage = 10;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle Edit
  const handleEdit = (item: LaporanItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleUpdateSuccess = (updatedItem: LaporanItem) => {
    setTableData(prev => prev.map(item => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item)));
    setEditAlert({ type: "success", message: "Laporan berhasil diperbarui" });
    setTimeout(() => setEditAlert(null), 5000);
  };

  // Normalisasi response agar selalu berupa array
  const normalizeLaporanData = (payload: unknown): LaporanItem[] => {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && typeof payload === "object") {
      const nested = (payload as { data?: unknown; rows?: unknown; items?: unknown }).data
        ?? (payload as { data?: unknown; rows?: unknown; items?: unknown }).rows
        ?? (payload as { data?: unknown; rows?: unknown; items?: unknown }).items;

      if (Array.isArray(nested)) {
        return nested as LaporanItem[];
      }
    }

    console.warn("Unexpected laporan payload shape", payload);
    return [];
  };

  const fieldOptions = [
    { label: "Semua Field", value: "all" },
    { label: "Ritase", value: "ritase" },
    { label: "Nama Rute", value: "rute" },
    { label: "Jenis Trip", value: "trip" },
    { label: "Nama Driver", value: "driver" },
    { label: "Plat Nomor", value: "no_plat" },
    { label: "Nomor Invoice", value: "no_invoice" },
    { label: "Nomor Surat Jalan", value: "surat_jalan" },
  ];

  // Fetch all data (tanpa pagination backend)
  const fetchData = async (override?: { search?: string; field?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const activeSearchTerm = override?.search ?? searchTerm;
      const activeField = override?.field ?? searchField;

      const trimmedSearch = activeSearchTerm?.trim();

      let params: GetAllLaporanParams | undefined;

      if (trimmedSearch) {
        params = {
          search: trimmedSearch,
          field: activeField !== "all" ? activeField : undefined,
        };
      }

      const response = await getAllLaporan(params);

      if (!response.success) {
        setError(response.message || "Gagal memuat data laporan");
        setTableData([]);
        return;
      }

      const normalizedData = normalizeLaporanData(response.data as unknown);
      setTableData(normalizedData);
      if (override) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error fetching laporan:", err);
      setError("Gagal memuat data laporan");
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    const nextTerm = trimmed;
    setSearchTerm(nextTerm);
    fetchData({ search: nextTerm, field: searchField });
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSearchField(value);
    if (searchTerm.trim()) {
      fetchData({ search: searchTerm.trim(), field: value });
    }
  };

  const handleClearFilters = () => {
    if (!searchTerm && searchField === "all") {
      return;
    }
    setSearchTerm("");
    setSearchField("all");
    fetchData({ search: "", field: "all" });
  };

  // Handle Delete dengan hook
  const handleDelete = async (item: LaporanItem) => {
    const success = await deleteItem(item.id, item.surat_jalan);
    if (success) {
      setShowDeleteAlert(true);
      setTimeout(() => setShowDeleteAlert(false), 5000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination manual di frontend
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  // State Loading
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            Memuat semua data laporan...
          </div>
        </div>
      </div>
    );
  }

  // State Error
  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  // State Kosong
  if (!tableData || tableData.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            Belum ada data laporan
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      {editAlert && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-right-5 duration-300">
          <Alert
            variant={editAlert.type}
            title={editAlert.type === "success" ? "Berhasil" : "Error"}
            message={editAlert.message}
          />
        </div>
      )}

      {/* Table */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full">
          <form onSubmit={handleSearchSubmit} className="hidden lg:block">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    fill=""
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari sesuatu di laporan..."
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
              />
            </div>
          </form>

          <form onSubmit={handleSearchSubmit} className="lg:hidden">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari laporan..."
                  className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <Button type="submit" className="w-full">
                Cari
              </Button>
            </div>
          </form>
        </div>

        <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center lg:gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="laporan-field-filter" className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Filter Berdasarkan
            </label>
            <select
              id="laporan-field-filter"
              value={searchField}
              onChange={handleFieldChange}
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            >
              {fieldOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || searchField !== "all") && (
            <Button variant="outline" onClick={handleClearFilters} className="lg:w-auto">
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[2000px] relative">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] sticky top-0 z-40 bg-white dark:bg-gray-900">
                <TableRow>
                  {/* Other Headers */}
                  {[
                    "No",
                    "No Surat Jalan",
                    "No Seal",
                    "Nama Driver",
                    "Nama Rute",
                    "Jenis Rute",
                    "Ritase",
                    "Plat Nomor",
                    "Keterangan Plat",
                    "Jenis Kendaraan",
                    "Jenis Trip",
                    "Waktu Berangkat",
                    "Waktu Tiba",
                    "Rate Sebelum Tax",
                    "PPN 1,1%",
                    "PPH 2%",
                    "Total Setelah Tax",
                    "Keterangan",
                  ].map((header, idx) => (
                    <TableCell
                      key={idx}
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      {header}
                    </TableCell>
                  ))}

                  {/* Sticky Aksi Column Header */}
                  <TableCell
                    isHeader
                    className="sticky right-0 z-50 px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-white/[0.05]"
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      {/* Regular Columns */}
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                        {indexOfFirstItem + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90">
                        {item.surat_jalan}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90">
                        {item.no_seal}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90 font-medium">
                        {item.driver}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90">
                        {formatRuteLaporan(item.ruteLaporan)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-600 dark:text-gray-400">
                        {item.rute}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-600 dark:text-gray-400">
                        {item.ritase}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90 font-medium">
                        {item.no_plat}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-600 dark:text-gray-400">
                        {item.ket_plat}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-600 dark:text-gray-400">
                        {item.mobil}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-600 dark:text-gray-400">
                        {item.trip}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-600 dark:text-gray-400">
                        {formatDateTime(item.keberangkatan)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-600 dark:text-gray-400">
                        {formatDateTime(item.kedatangan)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90 font-medium">
                        {formatCurrency(item.rate_before_tax)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.ppn_rate)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.pph_rate)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90 font-semibold">
                        {formatCurrency(item.rate_after_tax)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-600 dark:text-gray-400">
                        {item.keterangan || "-"}
                      </TableCell>

                      {/* Sticky Aksi Column di akhir */}
                      <TableCell className="sticky right-0 z-40 px-4 py-3 text-center bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-white/[0.05]">
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

      {/* Pagination Manual */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <EditLaporanModal
        isOpen={isEditModalOpen}
        item={editingItem}
        onClose={closeEditModal}
        onUpdated={handleUpdateSuccess}
      />
    </div>
  );
}
