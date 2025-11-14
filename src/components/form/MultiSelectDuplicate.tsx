import React, { useState } from "react";

interface Option {
  value: string;
  text: string;
  selected: boolean;
}

interface MultiSelectDuplicateProps {
  label: string;
  options: Option[];
  selectedItems?: Array<{ id: string; value: string; text: string }>;
  onChange?: (selected: Array<{ id: string; value: string; text: string }>) => void;
  disabled?: boolean;
}

const MultiSelectDuplicate: React.FC<MultiSelectDuplicateProps> = ({
  label,
  options,
  selectedItems = [],
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setSearchTerm(""); // Reset search when opening
    }
  };

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string, optionText: string) => {
    // Generate unique ID untuk setiap selection (dengan timestamp untuk memastikan unik)
    const uniqueId = `${optionValue}-${Date.now()}-${Math.random()}`;
    
    const newSelectedItems = [
      ...selectedItems,
      { id: uniqueId, value: optionValue, text: optionText }
    ];

    if (onChange) onChange(newSelectedItems);
  };

  const removeOption = (itemId: string) => {
    const newSelectedItems = selectedItems.filter((item) => item.id !== itemId);
    if (onChange) onChange(newSelectedItems);
  };

  const selectedValuesText = selectedItems.map((item) => item.text);

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className="relative z-20 inline-block w-full">
        <div className="relative flex flex-col items-center">
          <div onClick={toggleDropdown} className="w-full">
            <div className="mb-2 flex h-11 rounded-lg border border-gray-300 py-1.5 pl-3 pr-3 shadow-theme-xs outline-hidden transition focus:border-brand-300 focus:shadow-focus-ring dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-300">
              <div className="flex flex-wrap flex-auto gap-2">
                {selectedValuesText.length > 0 ? (
                  selectedItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800"
                    >
                      <span className="flex-initial max-w-full">{item.text}</span>
                      <div className="flex flex-row-reverse flex-auto">
                        <div
                          onClick={() => removeOption(item.id)}
                          className="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400"
                        >
                          <svg
                            className="fill-current"
                            role="button"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <input
                    placeholder="Select option"
                    className="w-full h-full p-1 pr-2 text-sm bg-transparent border-0 outline-hidden appearance-none placeholder:text-gray-800 focus:border-0 focus:outline-hidden focus:ring-0 dark:placeholder:text-white/90"
                    readOnly
                    value="Select option"
                  />
                )}
              </div>
              <div className="flex items-center py-1 pl-1 pr-1 w-7">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="w-5 h-5 text-gray-700 outline-hidden cursor-pointer focus:outline-hidden dark:text-gray-400"
                >
                  <svg
                    className={`stroke-current ${isOpen ? "rotate-180" : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <div
              className="absolute left-0 z-40 w-full bg-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 top-full dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="sticky top-0 z-10 p-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <input
                  type="text"
                  placeholder="Cari rute..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>

              {/* Options List with Scroll */}
              <div className="overflow-y-auto" style={{ maxHeight: '240px' }}>
                <div className="flex flex-col">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                      <div key={index}>
                        <div
                          className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 w-full cursor-pointer border-b border-gray-200 dark:border-gray-800 last:border-b-0`}
                          onClick={() => {
                            handleSelect(option.value, option.text);
                            setIsOpen(false);
                            setSearchTerm("");
                          }}
                        >
                          <div className="relative flex w-full items-center p-3 pl-4">
                            <div className="leading-6 text-gray-800 dark:text-white/90">
                              {option.text}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Tidak ada rute ditemukan
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelectDuplicate;