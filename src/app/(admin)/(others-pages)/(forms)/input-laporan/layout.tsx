import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Cargo Admin",
  description: "Form input data laporan pengiriman - PT. Media Realindo Express",
};

export default function InputLaporanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
