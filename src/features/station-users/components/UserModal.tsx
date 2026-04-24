"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/shared/Modal";
import { StationUser } from "@/types";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    initialData?: StationUser | null;
    stationId: string;
}

export default function UserModal({ isOpen, onClose, onSubmit, isSubmitting, initialData, stationId }: UserModalProps) {
    const t = useTranslations("stationUsers");
    const tCommon = useTranslations("common");
    const tButtons = useTranslations("buttons");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        nationalId: "",
        role: "cashier",
        language: "ar",
        password: "",
        stationId: stationId
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName,
                lastName: initialData.lastName,
                email: initialData.email,
                phoneNumber: initialData.phoneNumber,
                nationalId: initialData.nationalId,
                role: initialData.role,
                language: initialData.language,
                password: "",
                stationId: initialData.station
            });
        } else {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                nationalId: "",
                role: "cashier",
                language: "ar",
                password: "",
                stationId: stationId
            });
        }
    }, [initialData, isOpen, stationId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let submissionData: any = { ...formData };

        // If editing and password is empty, remove it from submission
        if (initialData && !formData.password) {
            const { password, ...rest } = formData;
            submissionData = rest;
        }

        onSubmit(submissionData);
    };

    const roles = ["manager", "cashier", "financial", "technician"];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? t("editUser") : t("addUser")}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("firstName")}</label>
                        <input
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("lastName")}</label>
                        <input
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("email")}</label>
                    <input
                        required
                        type="email"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("phone")}</label>
                    <input
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("nationalId")}</label>
                    <input
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={formData.nationalId}
                        onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("role")}</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            {roles.map(r => (
                                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Language</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        >
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        {initialData ? t("password") : "Password"}
                    </label>
                    <input
                        required={!initialData}
                        type="password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        {tCommon("cancel")}
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                    >
                        {isSubmitting ? tCommon("loading") : (initialData ? tCommon("save") : tCommon("add"))}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
