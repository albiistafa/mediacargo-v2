import PageBreadcrumbInputData from "@/components/common/PageBreadCrumbInputData";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import DriverInputs from "@/components/form/form-elements/DriverInputs";
import SelectInputs from "@/components/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import Button from "@/components/ui/button/Button";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumbInputData pageTitle="Laporan" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DefaultInputs />
          <DriverInputs />
          <SelectInputs />
          <TextAreaInput />
          <Button>
            Kirim
          </Button>
        <div className="space-y-6">
          
        </div>
        <div className="space-y-6">
          
          
        </div>
      </div>
    </div>
  );
}
