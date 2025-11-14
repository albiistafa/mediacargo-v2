"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WeekTable from "@/components/tables/WeekTable";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getLaporan, formatDateForAPI, LaporanItem, exportInvoice } from "../../../../../../../services/laporan.services";
import Alert from "@/components/ui/alert/Alert";

// Komponen untuk konten cabang
function WeekDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  const [tableData, setTableData] = useState<LaporanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTrips, setTotalTrips] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; variant: "success" | "error" | "warning" | "info"; title: string; message: string }>({
    visible: false,
    variant: "info",
    title: "",
    message: "",
  });

  const showToast = (variant: "success" | "error" | "warning" | "info", title: string, message: string) => {
    setToast({ visible: true, variant, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 5000);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      setIsLoading(true);
      setError(null);

      try {
        // Parse dates dengan timezone +08:00 (WIB)
        const parseWithTimezone = (dateString: string): Date => {
          return new Date(`${dateString}T00:00:00`);
        }; 

        const start = parseWithTimezone(startDate);
        const end = parseWithTimezone(endDate);

        console.log("Fetching data for:", start, end);

        const response = await getLaporan({
          startDate: formatDateForAPI(start, false),
          endDate: formatDateForAPI(end, true),
          search: "cabang",
          field: "rute",
          page: 1,
          limit: 100, // Ambil semua data untuk minggu ini
        });

        if (response.success && response.data) {
          setTableData(response.data.data);
          setTotalTrips(response.data.data.length);
        }
      } catch (err) {
        console.error("Error fetching laporan:", err);
        setError("Gagal memuat data laporan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (!startDate || !endDate) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Parameter tanggal tidak valid</p>
      </div>
    );
  }
console.log("Rendering WeekDetailContent with:", tableData);
  // Parse dates dengan timezone +08:00 (WIB)
  const parseWithTimezone = (dateString: string): Date => {
    return new Date(`${dateString}T00:00:00`);
  };

  const start = parseWithTimezone(startDate);
  const end = parseWithTimezone(endDate);

  // Format tanggal untuk tampilan
  const formatDate = (date: Date) => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Safe statement: pastikan array & field ada
  const safeData = Array.isArray(tableData) ? tableData : [];
  const totalRevenue = safeData.reduce((sum, item) => sum + (item?.rate_after_tax || 0), 0);

  // Handle Export PDF
  const handleExport = async () => {
    // Jika data kosong, kembalikan JSON sesuai permintaan dan tampilkan pesan
    if (!safeData.length) {
      const noData = {
        success: false,
        message: "Tidak ada laporan pada periode tersebut",
        errors: {},
      } as const;
      console.warn("Export aborted:", noData);
      // tampilkan sebagai notif saja, tanpa mengubah halaman
      showToast("info", "Info", noData.message);
      return;
    }
    try {
      setIsExporting(true);
      // Build payload with +08:00 timezone using helper
      const payload = {
        tipe: "cabang",
        company: "PT Contoh Sejahtera",
        contactPerson: "Budi",
        address: "Jl. Gatot Subroto No. 123, Denpasar",
        startDate: formatDateForAPI(start, false), // 00:00:00+08:00
        endDate: formatDateForAPI(end, true),      // 23:59:59+08:00
      };

      const pdfBlob = await exportInvoice(payload);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      const fmt = (d: Date) => `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
      a.href = url;
      a.download = `invoice_${fmt(start)}-${fmt(end)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export invoice failed', e);
      setError('Gagal export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  // Show error state
  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Laporan Mingguan" />
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-right-5 duration-300">
          <Alert variant={toast.variant} title={toast.title} message={toast.message} />
        </div>
      )}
      <PageBreadcrumb 
        pageTitle={`Laporan Minggu ${formatDate(start)} - ${formatDate(end)}`}
      />
      
      <div className="space-y-6 overflow-hidden">
        {/* Statistik Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Total Trip">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {isLoading ? "..." : totalTrips}
            </div>
          </ComponentCard>
          
          <ComponentCard title="Total Revenue">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {isLoading ? "..." : `Rp ${totalRevenue.toLocaleString('id-ID')}`}
            </div>
          </ComponentCard>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleExport}
            disabled={isExporting || isLoading}
            className={`bg-blue-600 text-white px-6 py-2 rounded transition flex items-center gap-2 ${
              isExporting || isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            > 
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>

        {/* Tabel Detail Trip */}
        <ComponentCard title="Detail Trip Mingguan">
          <div className="overflow-hidden">
            <WeekTable data={tableData} isLoading={isLoading} />
          </div>          {/* Tombol Kembali */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali
            </button>
            
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}

// Komponen cabang dengan Suspense wrapper
export default function WeekDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <WeekDetailContent />
    </Suspense>
  );
}
