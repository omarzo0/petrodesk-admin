import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Modal from "@/components/shared/Modal";
import { Subscription, Plan, Station } from "@/types";
import { usePlans } from "@/features/plans/hooks/usePlans";
import { Calendar, CreditCard, Clock, CheckCircle2 } from "lucide-react";

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    subscription?: Subscription | null;
    isLoading?: boolean;
}

export default function SubscriptionModal({ isOpen, onClose, onSave, subscription, isLoading }: SubscriptionModalProps) {
    const t = useTranslations("subscriptions");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    const { data: plans } = usePlans();

    const [formData, setFormData] = useState({
        planId: "",
        status: "active",
        currentPeriodEnd: "",
        durationMonths: 1
    });

    useEffect(() => {
        if (subscription) {
            setFormData({
                planId: typeof subscription.plan === 'object' ? subscription.plan._id : (subscription.plan as string),
                status: subscription.status,
                currentPeriodEnd: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toISOString().split('T')[0] : "",
                durationMonths: 1
            });
        } else {
            setFormData({
                planId: "",
                status: "active",
                currentPeriodEnd: "",
                durationMonths: 1
            });
        }
    }, [subscription, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={subscription ? t("updateSubscription") : t("assignPlan")}
            footer={
                <div className="flex gap-3 justify-end mt-4">
                    <button type="button" onClick={onClose} className="btn-secondary">{tCommon("cancel")}</button>
                    <button
                        type="submit"
                        form="subscription-form"
                        disabled={isLoading}
                        className="btn-primary min-w-[100px]"
                    >
                        {isLoading ? tCommon("loading") : tCommon("confirm")}
                    </button>
                </div>
            }
        >
            <form id="subscription-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                {subscription && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t("station")}</p>
                            <p className="font-bold text-slate-800">{subscription.station.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{subscription.station.code}</p>
                        </div>
                    </div>
                )}

                {/* Plan Selection */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <CreditCard className="w-3 h-3" /> {t("plan")}
                    </label>
                    <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        value={formData.planId}
                        onChange={e => setFormData({ ...formData, planId: e.target.value })}
                        required
                    >
                        <option value="">{tCommon("select") || "Select Plan"}</option>
                        {plans?.map((p: Plan) => (
                            <option key={p._id} value={p._id}>
                                {locale === 'ar' && p.nameAr ? p.nameAr : p.name} — {p.price.toLocaleString()} EGP / {tCommon(p.billingCycle)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status and Expiry (if updating) */}
                {subscription ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("status")}</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="active">{t("active")}</option>
                                <option value="expired">{t("expired")}</option>
                                <option value="trial">{t("trial")}</option>
                                <option value="canceled">{t("canceled")}</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> {t("endDate")}
                            </label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                value={formData.currentPeriodEnd}
                                onChange={e => setFormData({ ...formData, currentPeriodEnd: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                ) : (
                    /* Assign Duration (if new assignment) */
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {t("duration")}
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="60"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.durationMonths}
                            onChange={e => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                            required
                        />
                    </div>
                )}
            </form>
        </Modal>
    );
}
