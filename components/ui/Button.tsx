import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    asChild?: boolean;
    href?: string;
}

const variantStyles: Record<Variant, string> = {
    primary:
        "bg-[#146C54] text-white hover:bg-[#0f5540] border border-[#146C54] hover:border-[#0f5540]",
    secondary:
        "bg-transparent text-[#111111] border border-[#111111] hover:bg-[#F7F7F7]",
    ghost:
        "bg-transparent text-[#5A5A5A] border border-transparent hover:text-[#111111] hover:bg-[#F7F7F7]",
    dark:
        "bg-[#111111] text-white border border-[#111111] hover:bg-[#2a2a2a]",
};

const sizeStyles: Record<Size, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-sm",
    lg: "h-[52px] px-8 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "lg", className = "", children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={[
                    "inline-flex items-center justify-center gap-2 font-medium rounded-[6px] transition-colors duration-150",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#146C54] focus-visible:outline-offset-2",
                    "disabled:opacity-50 disabled:pointer-events-none",
                    variantStyles[variant],
                    sizeStyles[size],
                    className,
                ].join(" ")}
                {...props}
            >
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";
export default Button;
