"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";
import {
  LaporanItem,
  formatRuteLaporan,
  updateLaporan,
} from "../../../services/laporan.services";
import { UpdateLaporanRequest } from "../../../types/laporan";

interface EditLaporanModalProps {
  isOpen: boolean;
  item: LaporanItem | null;
  onClose: () => void;
  onUpdated: (item: LaporanItem) => void;
}

interface LaporanFormState {
  surat_jalan: string;
  no_seal: string;
  no_invoice: string;
  driver: string;
  rute: string;
  ritase: string;
  trip: string;
  no_plat: string;
  ket_plat: string;
  mobil: string;
  keberangkatan: string;
  kedatangan: string;
  rate_before_tax: string;
  ppn_rate: string;
  pph_rate: string;
  rate_after_tax: string;
  keterangan: string;
}

const emptyFormState: LaporanFormState = {
  surat_jalan: "",
  no_seal: "",
  no_invoice: "",
  driver: "",
  rute: "",
  ritase: "",
  trip: "",
  no_plat: "",
  ket_plat: "",
  mobil: "",
  keberangkatan: "",
  kedatangan: "",
  rate_before_tax: "0",
  ppn_rate: "0",
  pph_rate: "0",
  rate_after_tax: "0",
  keterangan: "",
};

const toDatetimeLocal = (value: string): string => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16);

  return localISOTime;
};

const parseDateTime = (value: string): string => {
  if (!value) {
    throw new Error("Tanggal dan waktu wajib diisi");
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Format tanggal atau waktu tidak valid");
  }

  return date.toISOString();
};

const toNumber = (value: string): number => {
  if (value === "" || value === null) {
    return 0;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
};

const EditLaporanModal: React.FC<EditLaporanModalProps> = ({
  isOpen,
  item,
  onClose,
  onUpdated,
}) => {
  const [formState, setFormState] = useState<LaporanFormState>(emptyFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item && isOpen) {
      setFormState({
        surat_jalan: item.surat_jalan ?? "",
        no_seal: item.no_seal ?? "",
        no_invoice: item.no_invoice ?? "",
        driver: item.driver ?? "",
        rute: item.rute ?? "",
        ritase: item.ritase ?? "",
        trip: item.trip ?? "",
        no_plat: item.no_plat ?? "",
        ket_plat: item.ket_plat ?? "",
        mobil: item.mobil ?? "",
        keberangkatan: toDatetimeLocal(item.keberangkatan),
        kedatangan: toDatetimeLocal(item.kedatangan),
        rate_before_tax: String(item.rate_before_tax ?? 0),
        ppn_rate: String(item.ppn_rate ?? 0),
        pph_rate: String(item.pph_rate ?? 0),
        rate_after_tax: String(item.rate_after_tax ?? 0),
        keterangan: item.keterangan ?? "",
      });
      setError(null);
    } else if (!isOpen) {
      setFormState(emptyFormState);
      setError(null);
    }
  }, [item, isOpen]);

  const ruteDisplay = useMemo(() => {
    if (!item?.ruteLaporan || item.ruteLaporan.length === 0) {
      return "-";
    }
    return formatRuteLaporan(item.ruteLaporan);
  }, [item]);

  const handleInputChange = (
    field: keyof LaporanFormState,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!item) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: UpdateLaporanRequest = {
        id: item.id,
        surat_jalan: formState.surat_jalan,
        no_seal: formState.no_seal,
        no_invoice: formState.no_invoice,
        driver: formState.driver,
        rute: formState.rute,
        ritase: formState.ritase,
        trip: formState.trip,
        no_plat: formState.no_plat,
        ket_plat: formState.ket_plat,
        mobil: formState.mobil,
        keberangkatan: parseDateTime(formState.keberangkatan),
        kedatangan: parseDateTime(formState.kedatangan),
        rate_before_tax: toNumber(formState.rate_before_tax),
        ppn_rate: toNumber(formState.ppn_rate),
        pph_rate: toNumber(formState.pph_rate),
        rate_after_tax: toNumber(formState.rate_after_tax),
        keterangan: formState.keterangan,
      } as UpdateLaporanRequest;

      if (item.ruteLaporan && item.ruteLaporan.length > 0) {
        payload.ruteList = item.ruteLaporan.map((rute) => ({
          rute_id: rute.rute_id,
          urutan: rute.urutan,
        }));
      }

      const response = await updateLaporan(payload);

      const updatedItem: LaporanItem = {
        ...item,
        ...response.data,
        ruteLaporan: item.ruteLaporan,
      };

      onUpdated(updatedItem);
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui laporan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[90vh] w-full max-w-5xl overflow-y-auto p-8"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Laporan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Perbarui detail laporan lalu simpan perubahan.
          </p>
        </div>

        {error && (
          <Alert variant="error" title="Gagal" message={error} />
        )}

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-gray-400">
          <p>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Rute Detail:
            </span>{" "}
            {ruteDisplay}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Nomor Surat Jalan</Label>
              <Input
                value={formState.surat_jalan}
                onChange={(e) => handleInputChange("surat_jalan", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nomor Seal</Label>
              <Input
                value={formState.no_seal}
                onChange={(e) => handleInputChange("no_seal", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nomor Invoice</Label>
              <Input
                value={formState.no_invoice}
                onChange={(e) => handleInputChange("no_invoice", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Nama Driver</Label>
              <Input
                value={formState.driver}
                onChange={(e) => handleInputChange("driver", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Plat Nomor</Label>
              <Input
                value={formState.no_plat}
                onChange={(e) => handleInputChange("no_plat", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Keterangan Plat</Label>
              <Input
                value={formState.ket_plat}
                onChange={(e) => handleInputChange("ket_plat", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Jenis Kendaraan</Label>
              <Input
                value={formState.mobil}
                onChange={(e) => handleInputChange("mobil", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nama Rute</Label>
              <Input
                value={formState.rute}
                onChange={(e) => handleInputChange("rute", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Jenis Trip</Label>
              <Input
                value={formState.trip}
                onChange={(e) => handleInputChange("trip", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Ritase</Label>
              <Input
                value={formState.ritase}
                onChange={(e) => handleInputChange("ritase", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Waktu Berangkat</Label>
              <Input
                type="datetime-local"
                value={formState.keberangkatan}
                onChange={(e) =>
                  handleInputChange("keberangkatan", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Waktu Tiba</Label>
              <Input
                type="datetime-local"
                value={formState.kedatangan}
                onChange={(e) => handleInputChange("kedatangan", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Rate Sebelum Tax</Label>
              <Input
                type="number"
                value={formState.rate_before_tax}
                onChange={(e) =>
                  handleInputChange("rate_before_tax", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>PPN 1,1%</Label>
              <Input
                type="number"
                value={formState.ppn_rate}
                onChange={(e) => handleInputChange("ppn_rate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>PPH 2%</Label>
              <Input
                type="number"
                value={formState.pph_rate}
                onChange={(e) => handleInputChange("pph_rate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Setelah Tax</Label>
              <Input
                type="number"
                value={formState.rate_after_tax}
                onChange={(e) =>
                  handleInputChange("rate_after_tax", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Keterangan</Label>
            <textarea
              value={formState.keterangan}
              onChange={(e) => handleInputChange("keterangan", e.target.value)}
              className="h-28 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-700 shadow-theme-xs focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[160px]"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditLaporanModal;
