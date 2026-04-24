"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import ActionButtons from "@/components/shared/ActionButtons";
import { usePlans, usePlanActions } from "@/features/plans/hooks/usePlans";
import PlanModal from "@/features/plans/components/PlanModal";
import { Package, Plus, Pencil, Trash2, ArrowUpDown, CheckCircle2, ShieldAlert } from "lucide-react";
import { Plan } from "@/types";

export default function PlansPage() {
    const t = useTranslations("plans");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    const { data: plans, isLoading } = usePlans();
    const actions = usePlanActions();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

    const handleSave = async (data: any) => {
        try {
            if (selectedPlan) {
                await actions.updatePlan({ id: selectedPlan._id, data });
            } else {
                await actions.createPlan(data);
            }
            setIsModalOpen(false);
            setSelectedPlan(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeactivate = async () => {
        if (!selectedPlan) return;
        try {
            await actions.deactivatePlan(selectedPlan._id);
            setIsDeactivateModalOpen(false);
            setSelectedPlan(null);
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        t("sortOrder"),
        t("name"),
        t("price"),
        t("billingCycle"),
        t("isActive"),
        tCommon("actions")
    ];

    const rows = plans?.map(plan => ({
        id: plan._id,
        cells: [
            <span key="sort" className="font-mono text-slate-400">#{plan.sortOrder}</span>,
            <div key="name" className="flex flex-col">
                <span className="font-semibold text-slate-800">
                    {locale === "ar" && plan.nameAr ? plan.nameAr : plan.name}
                </span>
                <span className="text-[10px] text-slate-400">
                    {plan.features.length} {t("features")}
                </span>
            </div>,
            <span key="price" className="font-bold text-primary">
                {plan.price.toLocaleString()} <span className="text-[10px] opacity-70">EGP</span>
            </span>,
            <span key="cycle" className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {t(plan.billingCycle)}
            </span>,
            <div key="status" className="flex items-center gap-1.5">
                {plan.isActive ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t("isActive")}
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                        <ShieldAlert className="w-3.5 h-3.5" /> {tCommon("inactive")}
                    </span>
                )}
            </div>,
            <div key="actions" className="flex items-center gap-1">
                <button
                    onClick={() => {
                        setSelectedPlan(plan);
                        setIsModalOpen(true);
                    }}
                    className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                {plan.isActive && (
                    <button
                        onClick={() => {
                            setSelectedPlan(plan);
                            setIsDeactivateModalOpen(true);
                        }}
                        className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        ]
    }));

    return (
        <div className="pb-8">
            <Header
                titleKey="plans"
                extra={
                    <button
                        onClick={() => {
                            setSelectedPlan(null);
                            setIsModalOpen(true);
                        }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> {t("addPlan")}
                    </button>
                }
            />

            <div className="page-card !p-0 mt-6 overflow-hidden border border-white/5 shadow-sm">
                <DataTable
                    columns={columns}
                    rows={rows || []}
                    isLoading={isLoading}
                />
            </div>

            <PlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                plan={selectedPlan}
                isLoading={actions.isCreating || actions.isUpdating}
            />

            {/* Deactivate Confirmation Modal */}
            <Modal
                isOpen={isDeactivateModalOpen}
                onClose={() => setIsDeactivateModalOpen(false)}
                title={t("deactivate")}
                footer={
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setIsDeactivateModalOpen(false)} className="btn-secondary">{tCommon("cancel")}</button>
                        <button
                            onClick={handleDeactivate}
                            disabled={actions.isDeactivating}
                            className="btn-danger"
                        >
                            {actions.isDeactivating ? tCommon("loading") : tCommon("confirm")}
                        </button>
                    </div>
                }
            >
                <div className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-900 font-medium">{t("deactivateMsg")}</p>
                        {selectedPlan && (
                            <p className="mt-2 text-sm text-slate-500">
                                {locale === "ar" && selectedPlan.nameAr ? selectedPlan.nameAr : selectedPlan.name}
                            </p>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
