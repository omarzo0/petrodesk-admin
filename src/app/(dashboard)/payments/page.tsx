"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import ActionButtons from "@/components/shared/ActionButtons";
import { usePayments, usePaymentStats, usePaymentActions } from "@/features/payments/hooks/usePayments";
import { CreditCard, CheckCircle, XCircle, Clock, Search, Filter, Calendar, Receipt, Landmark, Wallet } from "lucide-react";

export default function PaymentsPage() {
    const t = useTranslations("payments");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    const [filters, setFilters] = useState({
        status: "",
        stationId: "",
        startDate: "",
        endDate: ""
    });

    const { data: payments, isLoading } = usePayments(filters);
    const { data: stats } = usePaymentStats();
    const actions = usePaymentActions();

    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [confirmAction, setConfirmAction] = useState<"completed" | "rejected" | null>(null);

    const handleUpdateStatus = async () => {
        if (!selectedPayment || !confirmAction) return;
        try {
            await actions.updateStatus({ id: selectedPayment._id, status: confirmAction });
            setSelectedPayment(null);
            setConfirmAction(null);
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        t("date"),
        tCommon("stations") || "Station",
        t("amount"),
        t("method"),
        t("status"),
        tCommon("actions")
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed": return "badge-success";
            case "pending": return "badge-warning";
            case "rejected": return "badge-danger";
            default: return "badge-secondary";
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case "online": return <Wallet className="w-3 h-3" />;
            case "bank_transfer": return <Landmark className="w-3 h-3" />;
            default: return <Receipt className="w-3 h-3" />;
        }
    };

    const rows = payments?.map(payment => ({
        id: payment._id,
        cells: [
            <span key="date" className="text-sm text-slate-500 font-mono">
                {new Date(payment.createdAt).toLocaleDateString(locale)}
            </span>,
            <div key="station" className="flex flex-col">
                <span className="font-semibold text-slate-800">
                    {locale === "ar" && payment.station.nameAr ? payment.station.nameAr : payment.station.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{payment.station.code}</span>
            </div>,
            <span key="amount" className="font-bold text-slate-900">
                {payment.amount.toLocaleString()} <span className="text-[10px] text-slate-400">EGP</span>
            </span>,
            <div key="method" className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit">
                {getMethodIcon(payment.method)}
                {t(payment.method)}
            </div>,
            <span key="status" className={`badge ${getStatusBadge(payment.status)}`}>
                {t(payment.status)}
            </span>,
            <div key="actions" className="flex items-center gap-2">
                {payment.status === "pending" && (
                    <>
                        <button
                            onClick={() => {
                                setSelectedPayment(payment);
                                setConfirmAction("completed");
                            }}
                            className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                            title={t("confirm")}
                        >
                            <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPayment(payment);
                                setConfirmAction("rejected");
                            }}
                            className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                            title={t("reject")}
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        ]
    }));

    return (
        <div className="pb-8">
            <Header
                titleKey="payments"
                extra={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <select
                                className="bg-transparent text-sm border-none outline-none pr-6"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="">{t("status")}: All</option>
                                <option value="pending">{t("pending")}</option>
                                <option value="completed">{t("completed")}</option>
                                <option value="rejected">{t("rejected")}</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                className="bg-transparent text-sm border-none outline-none"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>
                    </div>
                }
            />

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-2">
                <div className="page-card !bg-white/40 backdrop-blur-md border-emerald-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("completed")}</p>
                        <h4 className="text-2xl font-black text-emerald-600">
                            {stats?.summary?.completed?.total?.toLocaleString() || 0} <span className="text-xs">EGP</span>
                        </h4>
                    </div>
                    <div className="p-3 bg-emerald-100/50 rounded-2xl">
                        <Wallet className="w-6 h-6 text-emerald-600" />
                    </div>
                </div>
                <div className="page-card !bg-white/40 backdrop-blur-md border-amber-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("pending")}</p>
                        <h4 className="text-2xl font-black text-amber-600">
                            {stats?.summary?.pending?.total?.toLocaleString() || 0} <span className="text-xs">EGP</span>
                        </h4>
                    </div>
                    <div className="p-3 bg-amber-100/50 rounded-2xl">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                </div>
                <div className="page-card !bg-white/40 backdrop-blur-md border-rose-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t("rejected")}</p>
                        <h4 className="text-2xl font-black text-rose-600">
                            {stats?.summary?.rejected?.total?.toLocaleString() || 0} <span className="text-xs">EGP</span>
                        </h4>
                    </div>
                    <div className="p-3 bg-rose-100/50 rounded-2xl">
                        <XCircle className="w-6 h-6 text-rose-600" />
                    </div>
                </div>
            </div>

            <div className="page-card !p-0 overflow-hidden border border-white/5 shadow-sm">
                <DataTable
                    columns={columns}
                    rows={rows || []}
                    isLoading={isLoading}
                />
            </div>

            {/* Confirm / Reject Modal */}
            <Modal
                isOpen={!!confirmAction}
                onClose={() => {
                    setConfirmAction(null);
                    setSelectedPayment(null);
                }}
                title={confirmAction === "completed" ? t("confirm") : t("reject")}
                footer={
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setConfirmAction(null)} className="btn-secondary">{tCommon("cancel")}</button>
                        <button
                            onClick={handleUpdateStatus}
                            disabled={actions.isUpdating}
                            className={`btn-primary ${confirmAction === "rejected" ? "!bg-rose-600 hover:!bg-rose-700" : ""}`}
                        >
                            {actions.isUpdating ? tCommon("loading") : tCommon("confirm")}
                        </button>
                    </div>
                }
            >
                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className={`p-4 rounded-2xl ${confirmAction === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                        {confirmAction === "completed" ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                    </div>
                    <div>
                        <p className="text-slate-900 font-medium">{confirmAction === "completed" ? t("confirmMsg") : t("rejectMsg")}</p>
                        {selectedPayment && (
                            <div className="mt-2 text-sm text-slate-500 flex flex-col gap-1">
                                <span>{t("amount")}: <strong className="text-slate-900">{selectedPayment.amount} EGP</strong></span>
                                <span>Station: <strong className="text-slate-900">{selectedPayment.station.name}</strong></span>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
