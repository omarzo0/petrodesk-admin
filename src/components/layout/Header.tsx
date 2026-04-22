"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { ReactNode } from "react";
import { TabItem } from "@/types";

interface HeaderProps {
    titleKey: string;
    tabs?: TabItem[];
    children?: ReactNode;
    extra?: ReactNode;
}

export default function Header({ titleKey, tabs, children, extra }: HeaderProps) {
    const t = useTranslations("pages");
    const tButtons = useTranslations("buttons");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const nextLocale = locale === "en" ? "ar" : "en";
        document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000`;
        window.location.reload();
    };

    return (
        <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Title */}
                <h1 className="text-2xl font-bold text-text">{t(titleKey)}</h1>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Language Switcher */}
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-text-muted hover:bg-slate-200 text-sm font-medium transition-all"
                        onClick={toggleLanguage}
                    >
                        <i className="bx bx-globe text-lg"></i>
                        <span>{locale === "en" ? "العربية" : "English"}</span>
                    </button>

                    {/* Print Report Button */}
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-text hover:bg-slate-50 text-sm font-medium transition-all shadow-sm"
                        onClick={() => window.print()}
                    >
                        <i className="bx bx-printer text-lg text-primary"></i>
                        <span>{tButtons("printReport")}</span>
                    </button>

                    {/* Sub-navigation tabs */}
                    {tabs && tabs.length > 0 && (
                        <div className="flex gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.href}
                                    onClick={() => tab.onClick ? tab.onClick() : router.push(tab.href)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                        ${tab.active
                                            ? "bg-primary text-white shadow-card"
                                            : "bg-slate-100 text-text-muted hover:bg-slate-200"
                                        }`}
                                >
                                    {t(tab.labelKey)}
                                </button>
                            ))}
                        </div>
                    )}

                    {extra}
                </div>
            </div>

            {/* Extra content (buttons, filters) */}
            {children && <div className="mt-4">{children}</div>}
        </div>
    );
}
