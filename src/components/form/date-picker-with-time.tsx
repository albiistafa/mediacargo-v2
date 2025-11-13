import { useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  value?: string;
  label?: string;
  placeholder?: string;
  enableTime?: boolean; // Tambah opsi untuk enable time picker
  timeFormat?: string; // Format jam (default: H:i)
  dateFormat?: string; // Format tanggal (default: Y-m-d H:i)
};

export default function DatePickerWithTime({
  id,
  mode = "single",
  onChange,
  label,
  defaultDate,
  value,
  placeholder,
  enableTime = true,
  timeFormat = "H:i",
  dateFormat = "Y-m-d H:i",
}: PropsType) {
  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode,
      static: false,
      monthSelectorType: "static",
      dateFormat: dateFormat,
      enableTime: enableTime,
      time_24hr: true, // Format 24 jam
      defaultDate: value || defaultDate,
      onChange,
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate, enableTime, dateFormat, value]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          value={value || ''}
          onChange={() => {}}
          readOnly
          placeholder={placeholder || "YYYY-MM-DD HH:MM"}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 pr-10 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-white text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 cursor-pointer"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-5" />
        </span>
      </div>
    </div>
  );
}
