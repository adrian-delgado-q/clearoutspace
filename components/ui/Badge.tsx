type Variant = "green" | "dark" | "muted" | "yellow" | "red";

interface BadgeProps {
    variant?: Variant;
    className?: string;
    children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
    green: "bg-[#E6F4F0] text-[#146C54]",
    dark: "bg-[#111111] text-white",
    muted: "bg-[#F7F7F7] text-[#5A5A5A]",
    yellow: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
};

export default function Badge({ variant = "muted", className = "", children }: BadgeProps) {
    return (
        <span
            className={[
                "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full",
                variantStyles[variant],
                className,
            ].join(" ")}
        >
            {children}
        </span>
    );
}
