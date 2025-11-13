import type { Metadata } from "next";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/tables/BasicTableOne";

export const metadata: Metadata = {
  title: "Media Cargo Admin",
  description: "Media Cargo Admin Dashboard Page",
};

export default function Dashboard() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] gap-6 p-6">
      {/* Row atas - Sambutan */}
      <div className="flex flex-col items-start justify-center">
        <h1 className="text-9xl font-bold text-gray-800 dark:text-white">
          Selamat datang, <span className="text-blue-600">Admin!</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mt-2">
          Situs Trucking PT. Media Realindo Express
        </p>
      </div>

      {/* Row bawah - Tabel */}
      <div className="overflow-hidden">
        <ComponentCard title="Data Pengiriman">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
