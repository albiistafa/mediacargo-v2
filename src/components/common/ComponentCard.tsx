import React from "react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
        <h3 className="text-sm sm:text-base font-medium text-gray-800 dark:text-white/90">
          {title}
        </h3>
        {desc && (
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-2 sm:p-4 lg:p-6 border-t border-gray-100 dark:border-gray-800">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
