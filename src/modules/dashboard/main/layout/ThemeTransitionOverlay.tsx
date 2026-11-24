export function ThemeTransitionOverlay() {
    return (
        <style>{`
            @property --sweep-progress {
                syntax: '<percentage>';
                inherits: false;
                initial-value: -130%;
            }

            ::view-transition-image-pair(root) {
                isolation: auto;
            }

            ::view-transition-old(root),
            ::view-transition-new(root) {
                animation: none;
                mix-blend-mode: normal;
                overflow: hidden;
            }
            ::view-transition-new(root) {
                -webkit-mask-image: linear-gradient(135deg, black var(--sweep-progress), transparent calc(var(--sweep-progress) + 25%));
                mask-image: linear-gradient(135deg, black var(--sweep-progress), transparent calc(var(--sweep-progress) + 25%));
                -webkit-mask-size: 100% 100%;
                mask-size: 100% 100%;
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                animation: 2000ms cubic-bezier(0.22, 1, 0.36, 1) reveal-mask-diagonal forwards;
            }
            html[dir="rtl"]::view-transition-new(root) {
                -webkit-mask-image: linear-gradient(225deg, black var(--sweep-progress), transparent calc(var(--sweep-progress) + 25%));
                mask-image: linear-gradient(225deg, black var(--sweep-progress), transparent calc(var(--sweep-progress) + 25%));
            }

            @keyframes reveal-mask-diagonal {
                from {
                    --sweep-progress: -130%;
                }
                to {
                    --sweep-progress: 130%;
                }
            }
        `}</style>
    );
}
