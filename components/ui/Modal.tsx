"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ModalProps {
    children: React.ReactNode;
    /** Called when the modal should close. Defaults to router.back(). */
    onClose?: () => void;
    maxWidth?: string;
}

export default function Modal({ children, onClose, maxWidth = "max-w-[960px]" }: ModalProps) {
    const router = useRouter();
    const overlayRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    const close = () => {
        if (onClose) {
            onClose();
        } else {
            router.back();
        }
    };

    // Lock body scroll
    useEffect(() => {
        document.body.classList.add("modal-open");
        return () => document.body.classList.remove("modal-open");
    }, []);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    });

    // Close on backdrop click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) close();
    };

    // Focus trap – move focus into dialog on mount
    useEffect(() => {
        const el = dialogRef.current;
        if (!el) return;
        const focusable = el.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        focusable[0]?.focus();
    }, []);

    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in px-4 py-8 overflow-y-auto"
        >
            <div
                ref={dialogRef}
                className={["relative bg-white rounded-[8px] w-full shadow-xl animate-slide-up", maxWidth].join(" ")}
            >
                <button
                    onClick={close}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full border border-[#EAEAEA] text-[#5A5A5A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-colors"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
}
