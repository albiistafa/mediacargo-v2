import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Media Cargo Admin",
  description:
    "Media Cargo Admin Dashboard Basic Tables Page",
  // other metadata
};

export default function UtamaTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Utama" />
      <div className="space-y-6">
        <ComponentCard title="Data Pengiriman">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
