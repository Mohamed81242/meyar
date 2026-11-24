import React, { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export function IconBriefcase(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M3 12h18" />
            <path d="M10.5 12h3" />
        </svg>
    );
}

export function IconGavel(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="m14.5 4.5 5 5" />
            <path d="m9.5 9.5-6 6a2 2 0 0 0 0 3l1 1a2 2 0 0 0 3 0l6-6" />
            <path d="m12 7 5 5" />
            <path d="M16 16h6" />
            <path d="M17 20h6" />
        </svg>
    );
}

export function IconShieldCheck(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M12 3 4.5 6v6c0 4.6 3.2 8 7.5 9 4.3-1 7.5-4.4 7.5-9V6L12 3Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

export function IconUsers(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <circle cx="9" cy="8" r="3" />
            <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M15.5 20a4.5 4.5 0 0 1 5.5-4.4" />
        </svg>
    );
}

export function IconBell(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M6 9a6 6 0 0 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 13.5 6 9Z" />
            <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
    );
}

export function IconDocument(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M7 3h7l4 4v14H7z" />
            <path d="M14 3v4h4" />
            <path d="M9.5 13h5" />
            <path d="M9.5 16.5h5" />
        </svg>
    );
}

export function IconChat(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M4 5h16v11H8l-4 4V5Z" />
            <path d="M8 9.5h8" />
            <path d="M8 12.5h5" />
        </svg>
    );
}

export function IconStar(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="m12 3 2.6 5.6 6 .6-4.5 4.1 1.2 6-5.3-3.1-5.3 3.1 1.2-6-4.5-4.1 6-.6L12 3Z" />
        </svg>
    );
}

export function IconMapPin(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
            <circle cx="12" cy="9" r="2.5" />
        </svg>
    );
}

export function IconCheck(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="m5 12 5 5 9-11" />
        </svg>
    );
}

export function IconClock(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
        </svg>
    );
}

export function IconArrowLeft(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M19 12H5" />
            <path d="m11 6-6 6 6 6" />
        </svg>
    );
}

export function IconMenu(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
        </svg>
    );
}

export function IconX(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="m6 6 12 12" />
            <path d="m18 6-12 12" />
        </svg>
    );
}

export function IconApple(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M16.7 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.3 1.2 9.6.8 1.2 1.7 2.5 3 2.4 1.2 0 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.7 1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.2-2.6 1.3-2.7-.1 0-2.6-1-2.6-3.9-.1-2.4 2-3.6 2.1-3.7Z" />
            <path d="M14.7 5.4c.6-.8 1-1.9.9-3-.9.1-2 .6-2.6 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3Z" />
        </svg>
    );
}

export function IconGooglePlay(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M4.3 3.3c-.3.3-.5.8-.5 1.3v14.8c0 .5.2 1 .5 1.3l.1.1L13 12.5v-.1L4.4 3.2l-.1.1Z" />
            <path d="M15.9 15.4 13 12.5v-.1l2.9-2.9 3.4 1.9c1 .5 1 1.4 0 1.9l-3.4 2.1Z" />
            <path d="m13 12.4-8.6 8.7c.3.3.9.4 1.5 0l9.8-5.6-2.7-3.1Z" />
            <path d="m15.7 9.3-9.8-5.6c-.6-.3-1.1-.3-1.5 0l8.6 8.7 2.7-3.1Z" />
        </svg>
    );
}
