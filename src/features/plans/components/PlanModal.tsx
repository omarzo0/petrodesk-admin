import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Modal from "@/components/shared/Modal";
import { Plan } from "@/types";
import { Plus, X, ListChecks } from "lucide-react";

interface PlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    plan?: Plan | null;
    isLoading?: boolean;
}

export default function PlanModal({ isOpen, onClose, onSave, plan, isLoading }: PlanModalProps) {
    const t = useTranslations("plans");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    const [formData, setFormData] = useState({
        name: "",
        nameAr: "",
        description: "",
        descriptionAr: "",
        price: 0,
        billingCycle: "monthly" as "monthly" | "yearly",
        features: [""] as string[],
        featuresAr: [""] as string[],
        sortOrder: 0
    });

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name || "",
                nameAr: plan.nameAr || "",
                description: plan.description || "",
                descriptionAr: plan.descriptionAr || "",
                price: plan.price || 0,
                billingCycle: plan.billingCycle || "monthly",
                features: plan.features?.length ? plan.features : [""],
                featuresAr: plan.featuresAr?.length ? plan.featuresAr : [""],
                sortOrder: plan.sortOrder || 0
            });
        } else {
            setFormData({
                name: "",
                nameAr: "",
                description: "",
                descriptionAr: "",
                price: 0,
                billingCycle: "monthly",
                features: [""],
                featuresAr: [""],
                sortOrder: 0
            });
        }
    }, [plan, isOpen]);

    const handleFeatureChange = (index: number, value: string, lang: 'en' | 'ar') => {
        const field = lang === 'en' ? 'features' : 'featuresAr';
        const newFeatures = [...formData[field]];
        newFeatures[index] = value;
        setFormData({ ...formData, [field]: newFeatures });
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, ""],
            featuresAr: [...formData.featuresAr, ""]
        });
    };

    const removeFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        const newFeaturesAr = formData.featuresAr.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures, featuresAr: newFeaturesAr });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Filter out empty features
        const cleanedData = {
            ...formData,
            features: formData.features.filter(f => f.trim() !== ""),
            featuresAr: formData.featuresAr.filter(f => f.trim() !== "")
        };
        await onSave(cleanedData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={plan ? t("editPlan") : t("addPlan")}
            footer={
                <div className="flex gap-3 justify-end mt-4">
                    <button type="button" onClick={onClose} className="btn-secondary">{tCommon("cancel")}</button>
                    <button
                        type="submit"
                        form="plan-form"
                        disabled={isLoading}
                        className="btn-primary min-w-[100px]"
                    >
                        {isLoading ? tCommon("loading") : tCommon("confirm")}
                    </button>
                </div>
            }
        >
            <form id="plan-form" onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("name")} (EN)</label>
                        <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("name")} (AR)</label>
                        <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-right"
                            dir="rtl"
                            value={formData.nameAr}
                            onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("price")} (EGP)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("billingCycle")}</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.billingCycle}
                            onChange={e => setFormData({ ...formData, billingCycle: e.target.value as any })}
                        >
                            <option value="monthly">{t("monthly")}</option>
                            <option value="yearly">{t("yearly")}</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("sortOrder")}</label>
                        <input
                            type="number"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.sortOrder}
                            onChange={e => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                        />
                    </div>
                </div>

                {/* Features Section */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                            <ListChecks className="w-5 h-5" />
                            <h4 className="font-bold">{t("features")}</h4>
                        </div>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            <Plus className="w-3 h-3" /> {t("addFeature")}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex gap-4 items-start p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <div className="flex-1 space-y-2">
                                    <input
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/20 outline-none"
                                        placeholder={t("featureEnPlaceholder") || "Feature (EN)"}
                                        value={feature}
                                        onChange={e => handleFeatureChange(index, e.target.value, 'en')}
                                    />
                                    <input
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/20 outline-none text-right"
                                        placeholder={t("featureArPlaceholder") || "الميزة (AR)"}
                                        dir="rtl"
                                        value={formData.featuresAr[index] || ""}
                                        onChange={e => handleFeatureChange(index, e.target.value, 'ar')}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors mt-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </Modal>
    );
}
