import PageBreadcrumbInputData from "@/components/common/PageBreadCrumbInputData";
import CheckboxComponents from "@/components/form/form-elements/CheckboxComponents";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import FileInputExample from "@/components/form/form-elements/FileInputExample";
import InputGroup from "@/components/form/form-elements/InputGroup";
import InputStates from "@/components/form/form-elements/InputStates";
import RadioButtons from "@/components/form/form-elements/RadioButtons";
import RuteInputs from "@/components/form/form-elements/RuteInputs";
import SelectInputs from "@/components/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Media Cargo Admin",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function InputRute() {
  return (
    <div>
    <PageBreadcrumbInputData pageTitle="Rute" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <RuteInputs />
        </div>
      </div>
    </div>
  );
}
