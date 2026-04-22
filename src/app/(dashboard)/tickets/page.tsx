"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import { useTickets, useTicketActions } from "@/features/tickets/hooks/useTickets";
import TicketDetailsModal from "@/features/tickets/components/TicketDetailsModal";
import CreateTicketModal from "@/features/tickets/components/CreateTicketModal";
import { MessageSquare, Calendar, User, Search, Filter, Plus, Trash2, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { Ticket } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export default function TicketsPage() {
    const t = useTranslations("tickets");
    const tCommon = useTranslations("common");
    const locale = useLocale();
    const { user } = useAuth();

    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [viewMode, setViewMode] = useState<"all" | "my">("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filters: any = {};
    if (statusFilter) filters.status = statusFilter;
    if (priorityFilter) filters.priority = priorityFilter;
    if (viewMode === 'my') filters.createdBy = user?.id;

    const { data: tickets, isLoading } = useTickets(filters);
    const actions = useTicketActions();

    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleCreate = async (data: any) => {
        try {
            await actions.createTicket(data);
            setIsCreateOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddResponse = async (message: string) => {
        if (!selectedTicket) return;
        try {
            await actions.addResponse({ id: selectedTicket._id, message });
        } catch (err) {
            console.error(err);
        }
    };

    const handleResolve = async () => {
        if (!selectedTicket) return;
        try {
            await actions.resolveTicket(selectedTicket._id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(tCommon("confirmDelete") || "Are you sure?")) return;
        try {
            await actions.deleteTicket(id);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTickets = tickets?.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "low": return "bg-slate-100 text-slate-600";
            case "medium": return "bg-blue-50 text-blue-600";
            case "high": return "bg-orange-50 text-orange-600";
            case "urgent": return "bg-red-50 text-red-600 border border-red-100";
            default: return "bg-slate-50 text-slate-500";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "open": return "badge-warning";
            case "in_progress": return "badge-info";
            case "resolved": return "badge-success";
            case "closed": return "badge-secondary";
            default: return "badge-secondary";
        }
    };

    const columns = [
        t("subject"),
        t("type"),
        t("priority"),
        t("status"),
        tCommon("actions")
    ];

    const rows = filteredTickets?.map(ticket => ({
        id: ticket._id,
        cells: [
            <div key="subject" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 line-clamp-1">{ticket.subject}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(ticket.createdAt).toLocaleDateString(locale)}
                    </span>
                </div>
            </div>,
            <span key="type" className="text-xs font-medium text-slate-500">
                {ticket.ticketType === 'internal' ? t("internal") : (ticket.station?.name || t("station_ticket"))}
            </span>,
            <span key="priority" className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityBadge(ticket.priority)}`}>
                {t(ticket.priority)}
            </span>,
            <span key="status" className={`badge ${getStatusBadge(ticket.status)}`}>
                {t(ticket.status)}
            </span>,
            <div key="actions" className="flex items-center gap-2">
                <button
                    onClick={() => {
                        setSelectedTicket(ticket);
                        setIsDetailsOpen(true);
                    }}
                    className="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                >
                    <Clock className="w-4 h-4" />
                </button>
                {user?.isSuperAdmin && (
                    <button
                        onClick={(e) => handleDelete(ticket._id, e)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        ],
        onClick: () => {
            setSelectedTicket(ticket);
            setIsDetailsOpen(true);
        }
    }));

    return (
        <div className="pb-8">
            <Header
                titleKey="tickets.title"
                extra={
                    <button onClick={() => setIsCreateOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> {t("createTicket")}
                    </button>
                }
            />

            {/* Sub-Header / Filters */}
            <div className="flex flex-col md:flex-row gap-4 mt-8 mb-6">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                    <button
                        onClick={() => setViewMode("all")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'all' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {t("allTickets")}
                    </button>
                    <button
                        onClick={() => setViewMode("my")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'my' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {t("myTickets")}
                    </button>
                </div>

                <div className="flex-1 flex flex-wrap items-center gap-3 md:justify-end">
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
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="">{t("status")}: All</option>
                            <option value="open">{t("open")}</option>
                            <option value="in_progress">{t("in_progress")}</option>
                            <option value="resolved">{t("resolved")}</option>
                        </select>
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

            <CreateTicketModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSave={handleCreate}
                isLoading={actions.isCreating}
            />

            <TicketDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                ticket={selectedTicket}
                onAddResponse={handleAddResponse}
                onResolve={handleResolve}
                isResponding={actions.isResponding}
                isResolving={actions.isResolving}
            />
        </div>
    );
}
