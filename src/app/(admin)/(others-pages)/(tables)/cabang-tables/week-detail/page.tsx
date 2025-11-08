"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WeekTable from "@/components/tables/WeekTable";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getLaporan, formatDateForAPI, LaporanItem } from "../../../../../../../services/laporan.services";

// Komponen untuk konten utama
function WeekDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  const [tableData, setTableData] = useState<LaporanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTrips, setTotalTrips] = useState(0);

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
          setTableData(response.data);
          setTotalTrips(response.data.length);
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

  const totalRevenue = tableData.reduce((sum, item) => {
    return sum + item.rate_after_tax;
  }, 0);

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
    <div>
      <PageBreadcrumb 
        pageTitle={`Laporan Minggu ${formatDate(start)} - ${formatDate(end)}`}
      />
      
      <div className="space-y-6">
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
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2">
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
            Export PDF
          </button>
        </div>

        {/* Tabel Detail Trip */}
        <ComponentCard title="Detail Trip Mingguan">
          <WeekTable data={tableData} isLoading={isLoading} />          {/* Tombol Kembali */}
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

// Komponen utama dengan Suspense wrapper
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
