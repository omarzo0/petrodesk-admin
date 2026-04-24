"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/shared/Modal";
import { Building2, User, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

interface StationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
    initialData?: any;
}

export default function StationModal({ isOpen, onClose, onSubmit, isSubmitting, initialData }: StationModalProps) {
    const t = useTranslations("stationModal");
    const tCommon = useTranslations("common");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "", nameAr: "", code: "", address: "", phone: "", logo: "",
        owner: { firstName: "", lastName: "", email: "", role: "admin", phoneNumber: "", nationalId: "", password: "" }
    });

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            if (initialData) {
                setFormData({
                    name: initialData.name || "",
                    nameAr: initialData.nameAr || "",
                    code: initialData.code || "",
                    address: initialData.address || "",
                    phone: initialData.phone || "",
                    logo: initialData.logo || "",
                    owner: {
                        firstName: initialData.owner?.firstName || "",
                        lastName: initialData.owner?.lastName || "",
                        email: initialData.owner?.email || "",
                        phoneNumber: initialData.owner?.phoneNumber || "",
                        nationalId: initialData.owner?.nationalId || "",
                        role: initialData.owner?.role || "admin",
                        password: "" // Don't populate password during edit
                    }
                });
            } else {
                setFormData({
                    name: "", nameAr: "", code: "", address: "", phone: "", logo: "",
                    owner: { firstName: "", lastName: "", email: "", role: "admin", phoneNumber: "", nationalId: "", password: "" }
                });
            }
        }
    }, [isOpen, initialData]);

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleSubmit = async () => {
        await onSubmit(formData);
        onClose();
    };

    const renderStepNumbers = () => (
        <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2].map((s) => (
                <div key={s} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step === s ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" :
                        step > s ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                        }`}>
                        {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                    </div>
                    {s === 1 && (
                        <div className={`w-16 h-0.5 mx-2 rounded ${step > 1 ? "bg-emerald-500" : "bg-slate-100"}`} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? t("editTitle") : t("addTitle")}
            size="lg"
            footer={
                <div className="flex justify-between w-full">
                    {step > 1 ? (
                        <button onClick={handlePrev} className="btn-secondary flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" /> {tCommon("back")}
                        </button>
                    ) : <div />}

                    {step < 2 ? (
                        <button
                            onClick={handleNext}
                            disabled={!formData.name || !formData.code}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50"
                        >
                            {tCommon("next")} <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !formData.owner.email || !formData.owner.firstName || !formData.owner.phoneNumber || !formData.owner.nationalId || (!initialData && !formData.owner.password)}
                            className="btn-primary"
                        >
                            {isSubmitting ? tCommon("loading") : tCommon("save")}
                        </button>
                    )}
                </div>
            }
        >
            {renderStepNumbers()}

            <div className="space-y-6 min-h-[300px]">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                            <Building2 className="w-5 h-5 text-primary" />
                            <h4>{t("generalInfo")}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("nameEn")}</label>
                                <input
                                    className="form-input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("nameAr")}</label>
                                <input
                                    className="form-input text-right"
                                    dir="rtl"
                                    value={formData.nameAr}
                                    onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("stationCode")}</label>
                                <input
                                    className="form-input font-mono"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("phone")}</label>
                                <input
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("address")}</label>
                            <input
                                className="form-input"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                            <User className="w-5 h-5 text-primary" />
                            <h4>{t("ownerInfo")}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("firstName")}</label>
                                <input
                                    className="form-input"
                                    value={formData.owner.firstName}
                                    onChange={e => setFormData({ ...formData, owner: { ...formData.owner, firstName: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("lastName")}</label>
                                <input
                                    className="form-input"
                                    value={formData.owner.lastName}
                                    onChange={e => setFormData({ ...formData, owner: { ...formData.owner, lastName: e.target.value } })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("email")}</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.owner.email}
                                    onChange={e => setFormData({ ...formData, owner: { ...formData.owner, email: e.target.value } })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("ownerPhone")}</label>
                                <input
                                    className="form-input"
                                    value={formData.owner.phoneNumber}
                                    onChange={e => setFormData({ ...formData, owner: { ...formData.owner, phoneNumber: e.target.value } })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("nationalId")}</label>
                                <input
                                    className="form-input"
                                    value={formData.owner.nationalId}
                                    onChange={e => setFormData({ ...formData, owner: { ...formData.owner, nationalId: e.target.value } })}
                                    required
                                />
                            </div>
                            {!initialData && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("password")}</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={formData.owner.password}
                                        onChange={e => setFormData({ ...formData, owner: { ...formData.owner, password: e.target.value } })}
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
