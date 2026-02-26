import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ icon, className = "", ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                {icon && (
                    <span className="absolute left-3 text-[#5A5A5A] pointer-events-none flex items-center">
                        {icon}
                    </span>
                )}
                <input
                    ref={ref}
                    className={[
                        "w-full h-12 border border-[#EAEAEA] rounded-[8px] bg-white text-[#111111]",
                        "placeholder:text-[#5A5A5A] text-sm transition-colors",
                        "focus:outline-none focus:border-[#146C54] focus:ring-1 focus:ring-[#146C54]",
                        icon ? "pl-10 pr-4" : "px-4",
                        className,
                    ].join(" ")}
                    {...props}
                />
            </div>
        );
    },
);

Input.displayName = "Input";
export default Input;
