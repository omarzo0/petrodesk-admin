"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import { useSubscriptions, useSubscriptionActions } from "@/features/subscriptions/hooks/useSubscriptions";
import SubscriptionModal from "@/features/subscriptions/components/SubscriptionModal";
import { Calendar, Clock, CreditCard, ShieldAlert, CheckCircle2, Pencil, Search, Filter } from "lucide-react";
import { Subscription } from "@/types";

export default function SubscriptionsPage() {
    const t = useTranslations("subscriptions");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    const { data: subscriptions, isLoading } = useSubscriptions();
    const actions = useSubscriptionActions();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const handleSave = async (data: any) => {
        if (!selectedSubscription) return;
        try {
            await actions.updateSubscription({ id: selectedSubscription._id, data });
            setIsModalOpen(false);
            setSelectedSubscription(null);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredSubscriptions = subscriptions?.filter(sub => {
        const matchesSearch = sub.station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.station.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? sub.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        t("station"),
        t("plan"),
        t("status"),
        t("endDate"),
        tCommon("actions")
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active": return "badge-success";
            case "trial": return "badge-warning";
            case "expired": return "badge-danger";
            default: return "badge-secondary";
        }
    };

    const rows = filteredSubscriptions?.map(sub => ({
        id: sub._id,
        cells: [
            <div key="station" className="flex flex-col">
                <span className="font-semibold text-slate-800">{sub.station.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{sub.station.code}</span>
            </div>,
            <div key="plan" className="flex flex-col">
                <span className="font-medium text-slate-700">
                    {typeof sub.plan === 'object' ? sub.plan.name : sub.plan}
                </span>
                <span className="text-[10px] text-slate-400">
                    {typeof sub.plan === 'object' ? `${sub.plan.price.toLocaleString()} EGP / ${tCommon(sub.plan.billingCycle)}` : ""}
                </span>
            </div>,
            <span key="status" className={`badge ${getStatusBadge(sub.status)}`}>
                {t(sub.status)}
            </span>,
            <div key="expiry" className="flex items-center gap-2 text-sm text-slate-500 font-mono">
                <Calendar className="w-3.5 h-3.5 opacity-50" />
                {new Date(sub.currentPeriodEnd).toLocaleDateString(locale)}
            </div>,
            <button
                key="actions"
                onClick={() => {
                    setSelectedSubscription(sub);
                    setIsModalOpen(true);
                }}
                className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
            >
                <Pencil className="w-4 h-4" />
            </button>
        ]
    }));

    return (
        <div className="pb-8">
            <Header
                titleKey="subscriptions"
                extra={
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder={tCommon("search")}
                                className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/10"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <select
                                className="bg-transparent text-sm border-none outline-none pr-6"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="">{t("status")}: All</option>
                                <option value="active">{t("active")}</option>
                                <option value="trial">{t("trial")}</option>
                                <option value="expired">{t("expired")}</option>
                                <option value="canceled">{t("canceled")}</option>
                            </select>
                        </div>
                    </div>
                }
            />

            <div className="page-card !p-0 mt-6 overflow-hidden border border-white/5 shadow-sm">
                <DataTable
                    columns={columns}
                    rows={rows || []}
                    isLoading={isLoading}
                />
            </div>

            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                subscription={selectedSubscription}
                isLoading={actions.isUpdating}
            />
        </div>
    );
}
