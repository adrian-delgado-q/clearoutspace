"use client";

import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-3" role="list">
            {faqs.map((faq, i) => {
                const isOpen = openIdx === i;
                return (
                    <div key={i} role="listitem" className="border border-[#EAEAEA] rounded-[8px] px-6 py-5">
                        <button
                            onClick={() => setOpenIdx(isOpen ? null : i)}
                            aria-expanded={isOpen}
                            aria-controls={`faq-answer-${i}`}
                            id={`faq-question-${i}`}
                            className="flex w-full items-start justify-between text-left gap-4 group"
                        >
                            <span className="text-[16px] font-medium text-[#111111] leading-snug">{faq.question}</span>
                            <span
                                className={["flex-shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full border border-[#EAEAEA] transition-transform duration-200",
                                    isOpen ? "rotate-45 border-[#146C54] text-[#146C54]" : "text-[#5A5A5A]",
                                ].join(" ")}
                                aria-hidden="true"
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </span>
                        </button>

                        {isOpen && (
                            <div
                                id={`faq-answer-${i}`}
                                role="region"
                                aria-labelledby={`faq-question-${i}`}
                                className="mt-3 text-[15px] text-[#5A5A5A] leading-relaxed pr-8"
                            >
                                {faq.answer}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
