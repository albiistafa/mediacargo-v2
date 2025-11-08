"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import TextArea from "../input/TextArea";
import Label from "../Label";
import Input from "../input/InputField";

export default function TextAreaInput() {
  const [message, setMessage] = useState("");
  const [messageTwo, setMessageTwo] = useState("");
  return (
    <ComponentCard title="Input Tax">
      <div className="space-y-6">
      <div>
          <Label>Rate Sebelum Tax</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>PPN 1.1%</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>PPH 2%</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Total Setelah Tax</Label>
          <Input type="text" />
        </div>

        {/* Default TextArea */}
        <div>
          <Label>Keterangan</Label>
          <TextArea
            value={message}
            onChange={(value) => setMessage(value)}
            rows={6}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
