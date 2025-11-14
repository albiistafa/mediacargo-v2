import WeekCard from "./WeekCard";

interface Week {
  label: string;
  start?: Date;
  end?: Date;
  tipe?: "utama" | "cabang";
}

const MonthReport = ({ month, weeks, tipe }: { month: string; weeks: Week[]; tipe?: "utama" | "cabang" }) => (
  <section className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
          Laporan Bulan {month}
        </h2>
        <p className="text-sm text-gray-500 dark:text-white/70">
          Overview aktivitas kurir dan pengiriman
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {weeks.map((week, i) => (
        <WeekCard 
          key={i} 
          label={week.label} 
          start={week.start}
          end={week.end}
          tipe={tipe}
        />
      ))}
    </div>
  </section>
);

export default MonthReport;