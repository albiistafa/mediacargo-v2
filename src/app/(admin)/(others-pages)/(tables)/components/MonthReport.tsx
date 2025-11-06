import WeekCard from "./WeekCard";

interface Week {
  label: string;
  start?: Date;
  end?: Date;
}

const MonthReport = ({ month, weeks }: { month: string; weeks: Week[] }) => (
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
      <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Export Data
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {weeks.map((week, i) => (
        <WeekCard 
          key={i} 
          label={week.label} 
          start={week.start}
          end={week.end}
        />
      ))}
    </div>
  </section>
);

export default MonthReport;