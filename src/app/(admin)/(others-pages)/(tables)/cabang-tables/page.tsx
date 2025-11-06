import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
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

export default function CabangTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Cabang" />
      <div className="space-y-6">
        <ComponentCard title="Laporan Trip">
          {laporanData.map(({ month, weeks }) => (
            <MonthReport key={month} month={month} weeks={weeks} />
          ))}
          {/* <BasicTableOne /> */}
        </ComponentCard>
      </div>
    </div>
  );
}
