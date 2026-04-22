"use client";

import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface ActionButtonsProps {
    onSave?: () => void;
    onAdd?: () => void;
    onPrint?: () => void;
    extra?: ReactNode;
}

export default function ActionButtons({ onSave, onAdd, onPrint, extra }: ActionButtonsProps) {
    const t = useTranslations("buttons");

    return (
        <div className="flex flex-wrap gap-3">
            {onAdd && (
                <button onClick={onAdd} className="btn-primary">
                    <i className="bx bx-plus me-1 text-lg"></i>
                    {t("add")}
                </button>
            )}
            {onSave && (
                <button onClick={onSave} className="btn-primary">
                    <i className="bx bx-save me-1 text-lg"></i>
                    {t("save")}
                </button>
            )}
            {onPrint && (
                <button onClick={onPrint} className="btn-secondary">
                    <i className="bx bx-printer me-1 text-lg text-primary"></i>
                    {t("printReport")}
                </button>
            )}
            {extra}
        </div>
    );
}
