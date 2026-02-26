import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    padding?: "sm" | "md" | "lg";
    elevated?: boolean;
}

const paddingStyles = {
    sm: "p-5",
    md: "p-8",
    lg: "p-10",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ padding = "lg", elevated = false, className = "", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={[
                    "border border-[#EAEAEA] rounded-[8px] bg-white",
                    elevated ? "shadow-sm" : "",
                    paddingStyles[padding],
                    className,
                ].join(" ")}
                {...props}
            >
                {children}
            </div>
        );
    },
);

Card.displayName = "Card";
export default Card;
