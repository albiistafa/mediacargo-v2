export interface RuteListItem {
  rute_id: number;
  urutan: number;
}

export interface PostLaporanRequest {
  ritase: string;
  trip: string;
  rute: string;
  driver: string;
  surat_jalan: string;
  no_seal: string;
  no_plat: string;
  ket_plat: string;
  mobil: string;
  keberangkatan: string;
  kedatangan: string;
  rate_before_tax: number;
  ppn_rate: number;
  pph_rate: number;
  rate_after_tax: number;
  keterangan: string;
  no_invoice: string;
  ruteList?: RuteListItem[]; // Array rute dengan urutan
}

export interface RuteSelection {
  id: string; // unique ID untuk setiap selection (bisa duplikat)
  ruteId: number; // ID dari rute
  ruteName: string; // nama rute
}

export interface PostLaporanResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    ritase: string;
    trip: string;
    rute: string;
    driver: string;
    surat_jalan: string;
    no_seal: string;
    no_plat: string;
    ket_plat: string;
    mobil: string;
    keberangkatan: string;
    kedatangan: string;
    rate_before_tax: number;
    ppn_rate: number;
    pph_rate: number;
    rate_after_tax: number;
    keterangan: string;
    no_invoice: string;
    createdAt: string;
    updatedAt: string;
  };
}
