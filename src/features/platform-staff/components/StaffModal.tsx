import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/shared/Modal";
import { User, Mail, Shield, User as UserIcon, Globe, Lock } from "lucide-react";
import { User as UserType } from "@/types";

interface StaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    staff?: UserType | null;
    isLoading?: boolean;
}

export default function StaffModal({ isOpen, onClose, onSave, staff, isLoading }: StaffModalProps) {
    const t = useTranslations("staff");
    const tCommon = useTranslations("common");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "employee",
        language: "ar"
    });

    useEffect(() => {
        if (staff) {
            setFormData({
                email: staff.email,
                password: "", // Don't show password on edit
                firstName: staff.firstName,
                lastName: staff.lastName,
                role: staff.role,
                language: staff.language || "ar"
            });
        } else {
            setFormData({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                role: "employee",
                language: "ar"
            });
        }
    }, [staff, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { ...payload }: any = formData;
        if (staff) delete payload.password; // Don't send empty password on update
        await onSave(payload);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={staff ? t("editStaff") : t("addStaff")}
            footer={
                <div className="flex gap-3 justify-end mt-4">
                    <button type="button" onClick={onClose} className="btn-secondary">{tCommon("cancel")}</button>
                    <button
                        type="submit"
                        form="staff-form"
                        disabled={isLoading}
                        className="btn-primary min-w-[100px]"
                    >
                        {isLoading ? tCommon("loading") : tCommon("confirm")}
                    </button>
                </div>
            }
        >
            <form id="staff-form" onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <UserIcon className="w-3 h-3" /> {t("firstName")}
                        </label>
                        <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.firstName}
                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {t("lastName")}
                        </label>
                        <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.lastName}
                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {t("email")}
                    </label>
                    <input
                        type="email"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>

                {!staff && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Lock className="w-3 h-3" /> {t("password")}
                        </label>
                        <input
                            type="password"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Shield className="w-3 h-3" /> {t("role")}
                        </label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="employee">{t("employee")}</option>
                            <option value="admin">{t("admin")}</option>
                            <option value="super_admin">{t("super_admin")}</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Globe className="w-3 h-3" /> {t("language")}
                        </label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.language}
                            onChange={e => setFormData({ ...formData, language: e.target.value })}
                        >
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
