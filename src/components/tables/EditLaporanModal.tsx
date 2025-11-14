"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";
import Select from "../form/Select";
import MultiSelectDuplicate from "../form/MultiSelectDuplicate";
import { ChevronDownIcon } from "@/icons";
import { useRute } from "@/hooks/useRute";
import DatePickerWithTime from "@/components/form/date-picker-with-time";
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
  rate_before_tax: "",
  ppn_rate: "",
  pph_rate: "",
  rate_after_tax: "",
  keterangan: "",
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

// Format angka ke format Rupiah (tanpa "Rp")
const formatRupiah = (value: number | string): string => {
  if (!value && value !== 0) return '';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numValue);
};

// Parse format Rupiah kembali ke number
const parseRupiah = (value: string): number => {
  const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
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
  const [ruteSelections, setRuteSelections] = useState<Array<{ id: string; ruteId: number; ruteName: string }>>([]);
  const { ruteList, fetchRute } = useRute();

  // Fetch rute list on mount
  useEffect(() => {
    fetchRute();
  }, []);

  // Dropdown options
  const jenisTrip = [
    { value: "satu pihak", label: "Satu Pihak" },
    { value: "dua pihak", label: "Dua Pihak" },
  ];

  const jenisRute = [
    { value: "utama", label: "Utama" },
    { value: "cabang", label: "Cabang" },
  ];

  const jenisRitase = [
    { value: "reguler", label: "Reguler" },
    { value: "dorongan", label: "Dorongan" },
  ];

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
        keberangkatan: item.keberangkatan ?? "",
        kedatangan: item.kedatangan ?? "",
        rate_before_tax: item.rate_before_tax ? formatRupiah(item.rate_before_tax) : '',
        ppn_rate: item.ppn_rate ? formatRupiah(item.ppn_rate) : '',
        pph_rate: item.pph_rate ? formatRupiah(item.pph_rate) : '',
        rate_after_tax: item.rate_after_tax ? formatRupiah(item.rate_after_tax) : '',
        keterangan: item.keterangan ?? "",
      });
      
      // Populate rute selections from item.ruteLaporan
      if (item.ruteLaporan && item.ruteLaporan.length > 0) {
        const selections = item.ruteLaporan.map((rute, index) => ({
          id: `rute-${index}-${Date.now()}`,
          ruteId: rute.rute_id,
          ruteName: rute.rute?.rute || "",
        }));
        setRuteSelections(selections);
      } else {
        setRuteSelections([]);
      }
      
      setError(null);
    } else if (!isOpen) {
      setFormState(emptyFormState);
      setRuteSelections([]);
      setError(null);
    }
  }, [item, isOpen]);

  const ruteDisplay = useMemo(() => {
    if (!item?.ruteLaporan || item.ruteLaporan.length === 0) {
      return "-";
    }
    return formatRuteLaporan(item.ruteLaporan);
  }, [item]);

  // Auto-calculate rate_after_tax
  useEffect(() => {
    if (formState.rate_before_tax && formState.rate_before_tax !== '') {
      const rateBefore = typeof formState.rate_before_tax === 'string' 
        ? parseRupiah(formState.rate_before_tax) 
        : (formState.rate_before_tax || 0);
      const ppn = typeof formState.ppn_rate === 'string'
        ? parseRupiah(formState.ppn_rate)
        : (formState.ppn_rate || 0);
      const pph = typeof formState.pph_rate === 'string'
        ? parseRupiah(formState.pph_rate)
        : (formState.pph_rate || 0);
      
      const calculatedTotal = rateBefore + ppn - pph;
      
      if (rateBefore > 0 || ppn > 0 || pph > 0) {
        setFormState(prev => ({
          ...prev,
          rate_after_tax: formatRupiah(calculatedTotal)
        }));
      }
    }
  }, [formState.rate_before_tax, formState.ppn_rate, formState.pph_rate]);

  const handleInputChange = (
    field: keyof LaporanFormState,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle currency input dengan format Rupiah
  const handleCurrencyInput = (value: string, field: keyof LaporanFormState) => {
    if (value === '') {
      handleInputChange(field, '');
      return;
    }

    const regex = /^-?[\d.,]*$/;
    
    if (regex.test(value)) {
      const numValue = parseRupiah(value);
      const formatted = formatRupiah(numValue);
      handleInputChange(field, formatted);
    }
  };

  const handleMultiSelectChange = (items: Array<{ id: string; value: string; text: string }>) => {
    const newRuteSelections = items.map((item) => ({
      id: item.id,
      ruteId: parseInt(item.value),
      ruteName: item.text,
    }));
    setRuteSelections(newRuteSelections);
  };

  // Convert ruteList to multiOptions format
  const multiOptions = ruteList.map((rute) => ({
    value: rute.id.toString(),
    text: rute.rute,
    selected: false,
  }));

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
        rate_before_tax: typeof formState.rate_before_tax === 'string' ? parseRupiah(formState.rate_before_tax) : toNumber(formState.rate_before_tax),
        ppn_rate: typeof formState.ppn_rate === 'string' ? parseRupiah(formState.ppn_rate) : toNumber(formState.ppn_rate),
        pph_rate: typeof formState.pph_rate === 'string' ? parseRupiah(formState.pph_rate) : toNumber(formState.pph_rate),
        rate_after_tax: typeof formState.rate_after_tax === 'string' ? parseRupiah(formState.rate_after_tax) : toNumber(formState.rate_after_tax),
        keterangan: formState.keterangan,
      } as UpdateLaporanRequest;

      // Use updated rute selections
      if (ruteSelections.length > 0) {
        payload.ruteList = ruteSelections.map((rute, index) => ({
          rute_id: rute.ruteId,
          urutan: index + 1,
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
              <Label>Rute Utama/Cabang</Label>
              <div className="relative">
                <Select
                  options={jenisRute}
                  placeholder="Pilih Rute"
                  value={formState.rute}
                  onChange={(value) => handleInputChange("rute", value)}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Jenis Trip</Label>
              <div className="relative">
                <Select
                  options={jenisTrip}
                  placeholder="Pilih Trip"
                  value={formState.trip}
                  onChange={(value) => handleInputChange("trip", value)}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <MultiSelectDuplicate
              label="Input Rute"
              options={multiOptions}
              selectedItems={ruteSelections.map(r => ({
                id: r.id,
                value: r.ruteId.toString(),
                text: r.ruteName
              }))}
              onChange={handleMultiSelectChange}
            />
            {ruteSelections.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rute yang dipilih ({ruteSelections.length}):
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {ruteSelections.map((rute, idx) => (
                    <li key={rute.id} className="flex items-center">
                      <span className="inline-block w-5 h-5 mr-2 text-center bg-blue-200 dark:bg-blue-800 rounded-full text-xs font-bold">
                        {idx + 1}
                      </span>
                      {rute.ruteName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Jenis Ritase</Label>
              <div className="relative">
                <Select
                  options={jenisRitase}
                  placeholder="Pilih Ritase"
                  value={formState.ritase}
                  onChange={(value) => handleInputChange("ritase", value)}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <DatePickerWithTime
                id="edit-date-picker-keberangkatan"
                label="Waktu Berangkat"
                placeholder="YYYY-MM-DD HH:MM"
                value={formState.keberangkatan}
                enableTime={true}
                dateFormat="Y-m-d H:i"
                onChange={(selectedDates, dateStr) => {
                  handleInputChange("keberangkatan", dateStr);
                }}
              />
            </div>
            <div className="space-y-2">
              <DatePickerWithTime
                id="edit-date-picker-kedatangan"
                label="Waktu Tiba"
                placeholder="YYYY-MM-DD HH:MM"
                value={formState.kedatangan}
                enableTime={true}
                dateFormat="Y-m-d H:i"
                onChange={(selectedDates, dateStr) => {
                  handleInputChange("kedatangan", dateStr);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Rate Sebelum Tax</Label>
              <Input
                type="text"
                value={formState.rate_before_tax}
                onChange={(e) =>
                  handleCurrencyInput(e.target.value, "rate_before_tax")
                }
                placeholder="Masukkan rate"
              />
            </div>
            <div className="space-y-2">
              <Label>PPN 1,1%</Label>
              <Input
                type="text"
                value={formState.ppn_rate}
                onChange={(e) => handleCurrencyInput(e.target.value, "ppn_rate")}
                placeholder="Masukkan PPN"
              />
            </div>
            <div className="space-y-2">
              <Label>PPH 2%</Label>
              <Input
                type="text"
                value={formState.pph_rate}
                onChange={(e) => handleCurrencyInput(e.target.value, "pph_rate")}
                placeholder="Masukkan PPH"
              />
            </div>
            <div className="space-y-2">
              <Label>Total Setelah Tax</Label>
              <Input
                type="text"
                value={formState.rate_after_tax}
                onChange={(e) =>
                  handleCurrencyInput(e.target.value, "rate_after_tax")
                }
                placeholder="Otomatis terhitung (bisa diedit)"
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
