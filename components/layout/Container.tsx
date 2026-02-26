import { type HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
}

export default function Container({ as: Tag = "div", className = "", children, ...props }: ContainerProps) {
    return (
        <Tag
            className={["mx-auto w-full max-w-[1200px] px-6 md:px-8", className].join(" ")}
            {...props}
        >
            {children}
        </Tag>
    );
}
