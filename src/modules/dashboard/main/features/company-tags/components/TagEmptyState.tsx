import React from "react";

export const TagEmptyState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-28 select-none">
            {/* Soft Gray Circle with Document Box Graphic matching Screenshot 1 */}
            <div className="w-16 h-16 rounded-full bg-[#F1F5F9] dark:bg-dashboard-secondary flex items-center justify-center shadow-2xs">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="1.6"
                    className="w-8 h-8"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            </div>
        </div>
    );
};
