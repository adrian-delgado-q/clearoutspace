"use client";

import { useEffect, useState } from "react";

interface RotatingWordProps {
    words: string[];
    intervalMs?: number;
    className?: string;
}

export default function RotatingWord({
    words,
    intervalMs = 2000,
    className,
}: RotatingWordProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (words.length <= 1) return;

        const timer = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, intervalMs);

        return () => window.clearInterval(timer);
    }, [intervalMs, words]);

    return (
        <span className={className} aria-live="polite">
            {words[index] ?? ""}
        </span>
    );
}
