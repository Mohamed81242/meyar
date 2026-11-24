import React from "react";

interface MeayarLogoProps {
    collapsed?: boolean;
    className?: string;
}

export const MeayarLogo: React.FC<MeayarLogoProps> = ({ collapsed = false, className = "" }) => {
    return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
            {/* Shield Icon with Green Checkmark */}
            <div className="relative w-9 h-10 shrink-0 flex items-center justify-center">
                <svg
                    viewBox="0 0 36 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-xs"
                >
                    {/* Blue Shield Outline */}
                    <path
                        d="M18 1.5L33 6.5V19.5C33 29.5 26.5 37.5 18 40.5C9.5 37.5 3 29.5 3 19.5V6.5L18 1.5Z"
                        fill="#FFFFFF"
                        stroke="#1D4ED8"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                    {/* Inner Accent Path */}
                    <path
                        d="M18 4L30.5 8.2V19.5C30.5 27.8 25 34.6 18 37.5C11 34.6 5.5 27.8 5.5 19.5V8.2L18 4Z"
                        fill="#F0F6FF"
                    />
                    {/* Green Checkmark */}
                    <path
                        d="M10 20.5L15.5 26L26 14.5"
                        stroke="#16A34A"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Brand Text */}
            {!collapsed && (
                <div className="flex flex-col leading-tight">
                    <span className="font-bold text-[#1E293B] text-[15px] tracking-tight">
                        رمز الامتثال
                    </span>
                    <span className="font-extrabold text-[#1E293B] text-[11px] tracking-widest uppercase">
                        MEAYAR
                    </span>
                </div>
            )}
        </div>
    );
};

export default MeayarLogo;
