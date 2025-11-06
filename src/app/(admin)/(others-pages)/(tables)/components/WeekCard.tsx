"use client";

import TruckIcon from "./TruckIcon";
import { useRouter } from "next/navigation";

interface WeekCardProps {
  label: string;
  start?: Date;
  end?: Date;
}

const WeekCard = ({ label, start, end }: WeekCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (start && end) {
      // Format dates untuk URL params (YYYY-MM-DD)
      const startDate = start.toISOString().split('T')[0];
      const endDate = end.toISOString().split('T')[0];
      router.push(`/utama-tables/week-detail?start=${startDate}&end=${endDate}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="border rounded-md p-4 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow dark:border-gray-700 dark:hover:border-gray-500"
    >
      <div className="flex items-center gap-2">
        <div className="bg-blue-100 p-2 rounded dark:bg-blue-900">
          <TruckIcon />
        </div>
        <div className="ml-auto text-blue-600 text-sm font-medium hover:underline">
          Lihat &gt;&gt;
        </div>
      </div>
      <div className="text-gray-500 text-sm dark:text-white/70">Laporan Mingguan</div>
      <div className="font-bold text-gray-900 dark:text-white">{label}</div>
    </div>
  );
};

export default WeekCard;