import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/shared/Modal";
import { useStations } from "@/features/stations/hooks/useStations";
import { AlertTriangle, ShieldAlert, Info, Globe, User, MessageCircle, Layers } from "lucide-react";
import { Station } from "@/types";

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export default function WarningModal({ isOpen, onClose, onSave, isLoading }: WarningModalProps) {
    const t = useTranslations("warnings");
    const tCommon = useTranslations("common");

    const { data: stations } = useStations();

    const [formData, setFormData] = useState({
        message: "",
        details: "",
        type: "operational",
        severity: "medium",
        isGlobal: false,
        stationId: "",
        targetRoles: [] as string[]
    });

    const roles = ["admin", "manager", "cashier", "financial"];

    const toggleRole = (role: string) => {
        setFormData(prev => ({
            ...prev,
            targetRoles: prev.targetRoles.includes(role)
                ? prev.targetRoles.filter(r => r !== role)
                : [...prev.targetRoles, role]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { ...payload }: any = formData;
        if (payload.isGlobal) {
            delete payload.stationId;
        } else {
            delete payload.targetRoles;
        }
        await onSave(payload);
        setFormData({
            message: "",
            details: "",
            type: "operational",
            severity: "medium",
            isGlobal: false,
            stationId: "",
            targetRoles: [] as string[]
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("issueWarning")}
            footer={
                <div className="flex gap-3 justify-end mt-4">
                    <button type="button" onClick={onClose} className="btn-secondary">{tCommon("cancel")}</button>
                    <button
                        type="submit"
                        form="warning-form"
                        disabled={isLoading}
                        className="btn-danger min-w-[100px]"
                    >
                        {isLoading ? tCommon("loading") : tCommon("confirm")}
                    </button>
                </div>
            }
        >
            <form id="warning-form" onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Global vs Station Toggle */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isGlobal: false })}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${!formData.isGlobal ? 'bg-white text-red-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {t("stationSpecific")}
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isGlobal: true })}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${formData.isGlobal ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <span className="flex items-center justify-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" /> {t("isGlobal")}
                        </span>
                    </button>
                </div>

                {/* Target Selection */}
                {formData.isGlobal ? (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <User className="w-3 h-3" /> {t("targetRoles")}
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {roles.map(role => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => toggleRole(role)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${formData.targetRoles.includes(role) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="w-3 h-3" /> {t("station")}
                        </label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.stationId}
                            onChange={e => setFormData({ ...formData, stationId: e.target.value })}
                            required
                        >
                            <option value="">{tCommon("select")}</option>
                            {stations?.map((s: any) => (
                                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Category & Severity */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> {t("type")}
                        </label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="operational">{t("operational")}</option>
                            <option value="financial">{t("financial")}</option>
                            <option value="security">{t("security")}</option>
                            <option value="other">{t("other")}</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <ShieldAlert className="w-3 h-3" /> {t("severity")}
                        </label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold"
                            value={formData.severity}
                            onChange={e => setFormData({ ...formData, severity: e.target.value })}
                        >
                            <option value="low" className="text-slate-500">{t("low")}</option>
                            <option value="medium" className="text-blue-600">{t("medium")}</option>
                            <option value="high" className="text-orange-600">{t("high")}</option>
                            <option value="critical" className="text-red-600">{t("critical")}</option>
                        </select>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <MessageCircle className="w-3 h-3" /> {t("message")}
                    </label>
                    <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        required
                    />
                </div>

                {/* Details */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Info className="w-3 h-3" /> {t("details")}
                    </label>
                    <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[100px] resize-none text-sm"
                        value={formData.details}
                        onChange={e => setFormData({ ...formData, details: e.target.value })}
                    />
                </div>
            </form>
        </Modal>
    );
}
