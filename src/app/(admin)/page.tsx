import type { Metadata } from "next";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/tables/BasicTableOne";

export const metadata: Metadata = {
  title:
    "Media Cargo Admin",
  description: "Media Cargo Admin Dashboard Page",
};

export default function Dashboard() {
  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Data Pengiriman">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
