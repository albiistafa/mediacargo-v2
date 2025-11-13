import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumbLaporan";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";
import MonthReport from "../components/MonthReport";
import ChartTab from "@/components/common/ChartTab";
import { generateLaporanData } from "@/helpers/dateHelpers";

export const metadata: Metadata = {
  title: "Media Cargo Admin",
  description:
    "Media Cargo Admin Dashboard Basic Tables Page",
  // other metadata
};

// Generate laporan data untuk 4 bulan terakhir secara otomatis
const laporanData = generateLaporanData(4);


export default function UtamaTables() {
  return (
    <div className="overflow-hidden">
      <PageBreadcrumb pageTitle="Utama" />
      <div className="space-y-6 overflow-hidden">
        <ComponentCard title="Laporan Trip">
          <div className="overflow-hidden">
            {laporanData.map(({ month, weeks }) => (
              <MonthReport key={month} month={month} weeks={weeks} />
            ))}
          </div>
          {/* <BasicTableOne /> */}
        </ComponentCard>
      </div>
    </div>
  );
}
