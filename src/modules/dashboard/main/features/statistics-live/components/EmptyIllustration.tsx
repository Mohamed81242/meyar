import React from "react";

interface Props {
    message?: string;
    className?: string;
}

export const EmptyIllustration: React.FC<Props> = ({
    message = "لا يوجد بيانات",
    className = "",
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-8 select-none ${className}`}>
            <svg
                viewBox="0 0 80 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-20 mb-3"
                aria-hidden="true"
            >
                {/* Document Body */}
                <path
                    d="M16 6C16 3.79086 17.7909 2 20 2H54L68 16V80C68 80 62 84 56 80C50 76 44 84 38 80C32 76 26 84 20 80C17.7909 78.5 16 76 16 73V6Z"
                    fill="#CBD5E1"
                />
                <path
                    d="M16 10C16 6.68629 18.6863 4 22 4H52L64 16V76C64 76 58 80 52 76C46 72 40 80 34 76C28 72 22 80 18 76C16.5 74.5 16 72.5 16 70V10Z"
                    fill="#E2E8F0"
                />
                {/* Fold Corner */}
                <path
                    d="M52 4V14C52 15.1046 52.8954 16 54 16H64L52 4Z"
                    fill="#94A3B8"
                />
                {/* Wavy Bottom Cutout */}
                <path
                    d="M16 68C22 72 28 64 34 68C40 72 46 64 52 68C58 72 64 68 64 68V76C64 76 58 80 52 76C46 72 40 80 34 76C28 72 22 80 18 76C16.5 74.5 16 72.5 16 70V68Z"
                    fill="#FFFFFF"
                />
            </svg>
            <span className="text-xs font-semibold text-[#64748B]">{message}</span>
        </div>
    );
};
