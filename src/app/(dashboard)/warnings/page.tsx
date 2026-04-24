"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import { useWarnings, useWarningActions } from "@/features/warnings/hooks/useWarnings";
import WarningModal from "@/features/warnings/components/WarningModal";
import { AlertTriangle, ShieldAlert, CheckCircle2, Globe, Search, Filter, Plus, Info } from "lucide-react";
import { Warning } from "@/types";

export default function WarningsPage() {
    const t = useTranslations("warnings");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    const [severityFilter, setSeverityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const filters: any = {};
    if (severityFilter) filters.severity = severityFilter;
    if (statusFilter) filters.isResolved = statusFilter === 'resolved';

    const { data: warnings, isLoading } = useWarnings(filters);
    const actions = useWarningActions();

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleIssueWarning = async (data: any) => {
        try {
            await actions.issueWarning(data);
            setIsCreateOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleResolve = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(t("resolveMsg"))) return;
        try {
            await actions.resolveWarning(id);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredWarnings = warnings?.filter(w =>
        w.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.station?.name.toLowerCase().includes(searchTerm.toLowerCase()) || "")
    );

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "low": return "bg-slate-100 text-slate-500";
            case "medium": return "bg-blue-50 text-blue-600";
            case "high": return "bg-orange-50 text-orange-600";
            case "critical": return "bg-red-50 text-red-600 border border-red-200 animate-pulse";
            default: return "bg-slate-50 text-slate-400";
        }
    };

    const columns = [
        t("message"),
        t("station"),
        t("severity"),
        t("status"),
        tCommon("actions")
    ];

    const rows = filteredWarnings?.map(w => ({
        id: w._id,
        cells: [
            <div key="msg" className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${w.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                    <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 line-clamp-1">{w.message}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(w.createdAt).toLocaleDateString(locale)}
                    </span>
                </div>
            </div>,
            <div key="target" className="flex items-center gap-2">
                {w.isGlobal ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-lg">
                        <Globe className="w-3 h-3" /> {t("isGlobal")}
                    </span>
                ) : (
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-700">{w.station?.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{w.station?.code}</span>
                    </div>
                )}
            </div>,
            <span key="severity" className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getSeverityBadge(w.severity)}`}>
                {t(w.severity)}
            </span>,
            <span key="status" className={`badge ${w.isResolved ? 'badge-success' : 'badge-danger'}`}>
                {w.isResolved ? t("isResolved") : t("open")}
            </span>,
            <div key="actions" className="flex items-center gap-2">
                {!w.isResolved && (
                    <button
                        onClick={(e) => handleResolve(w._id, e)}
                        className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                        title={t("resolve")}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                    </button>
                )}
                <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                    <Info className="w-4 h-4" />
                </button>
            </div>
        ]
    }));

    return (
        <div className="pb-8">
            <Header
                titleKey="warnings"
                extra={
                    <button onClick={() => setIsCreateOpen(true)} className="btn-danger flex items-center gap-2">
                        <Plus className="w-4 h-4" /> {t("issueWarning")}
                    </button>
                }
            />

            <div className="flex flex-wrap items-center gap-4 mt-8 mb-6 md:justify-end">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder={tCommon("search")}
                        className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 w-full md:w-64"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        className="bg-transparent text-sm border-none outline-none pr-6"
                        value={severityFilter}
                        onChange={e => setSeverityFilter(e.target.value)}
                    >
                        <option value="">{t("severityAll")}</option>
                        <option value="low">{t("low")}</option>
                        <option value="medium">{t("medium")}</option>
                        <option value="high">{t("high")}</option>
                        <option value="critical">{t("critical")}</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        className="bg-transparent text-sm border-none outline-none pr-6"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">{t("statusAll")}</option>
                        <option value="pending">{t("open")}</option>
                        <option value="resolved">{t("isResolved")}</option>
                    </select>
                </div>
            </div>

            <div className="page-card !p-0 overflow-hidden border border-white/5 shadow-sm">
                <DataTable
                    columns={columns}
                    rows={rows || []}
                    isLoading={isLoading}
                />
            </div>

            <WarningModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSave={handleIssueWarning}
                isLoading={actions.isIssuing}
            />
        </div>
    );
}
