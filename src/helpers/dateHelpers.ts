/**
 * Mendapatkan semua minggu dalam sebuah bulan
 * @param year - Tahun
 * @param month - Bulan (0-11, dimana 0 = Januari)
 * @returns Array of week objects dengan start dan end date
 */
export function getWeeksInMonth(year: number, month: number) {
  const weeks = [];
  
  // Mendapatkan tanggal pertama bulan ini
  const firstDay = new Date(year, month, 1);
  // Mendapatkan tanggal terakhir bulan ini
  const lastDay = new Date(year, month + 1, 0);
  
  // Mencari hari Senin pertama (atau sebelum tanggal 1)
  let currentWeekStart = new Date(firstDay);
  
  // getDay() mengembalikan: 0=Minggu, 1=Senin, 2=Selasa, dst.
  // Jika tanggal 1 bukan hari Senin, mundur ke Senin sebelumnya
  const dayOfWeek = currentWeekStart.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Jika Minggu, mundur 6 hari; lainnya mundur (dayOfWeek - 1) hari
  currentWeekStart.setDate(currentWeekStart.getDate() - daysToMonday);
  
  while (currentWeekStart <= lastDay) {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Minggu (6 hari setelah Senin)
    
    weeks.push({
      start: new Date(currentWeekStart),
      end: new Date(weekEnd),
    });
    
    // Pindah ke Senin berikutnya
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }
  
  return weeks;
}

/**
 * Format tanggal ke format "DD Bulan YYYY"
 * @param date - Date object
 * @returns String tanggal terformat
 */
export function formatDate(date: Date): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

/**
 * Format tanggal ke format pendek "DD Bulan"
 * @param date - Date object
 * @returns String tanggal terformat pendek
 */
export function formatDateShort(date: Date): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  
  return `${day} ${month}`;
}

/**
 * Membuat label minggu dari start dan end date
 * @param start - Tanggal mulai minggu
 * @param end - Tanggal akhir minggu
 * @returns String label minggu
 */
export function getWeekLabel(start: Date, end: Date): string {
  // Jika tahun berbeda
  if (start.getFullYear() !== end.getFullYear()) {
    return `${formatDate(start)} - ${formatDate(end)}`;
  }
  
  // Jika bulan berbeda
  if (start.getMonth() !== end.getMonth()) {
    return `${formatDateShort(start)} - ${formatDate(end)}`;
  }
  
  // Jika bulan sama
  return `${start.getDate()} - ${formatDate(end)}`;
}

/**
 * Mendapatkan nama bulan dalam bahasa Indonesia
 * @param month - Bulan (0-11)
 * @returns Nama bulan
 */
export function getMonthName(month: number): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return months[month];
}

/**
 * Generate laporan data untuk beberapa bulan terakhir
 * @param numberOfMonths - Jumlah bulan yang ingin ditampilkan
 * @returns Array of laporan data dengan month dan weeks
 */
export function generateLaporanData(numberOfMonths: number = 6) {
  const laporanData = [];
  const today = new Date();
  
  for (let i = 0; i < numberOfMonths; i++) {
    const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    
    const weeks = getWeeksInMonth(year, month);
    
    laporanData.push({
      month: `${getMonthName(month)} ${year}`,
      weeks: weeks.map(week => ({
        label: getWeekLabel(week.start, week.end),
        start: week.start,
        end: week.end,
      })),
    });
  }
  
  return laporanData;
}
