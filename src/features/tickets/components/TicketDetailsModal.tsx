import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Modal from "@/components/shared/Modal";
import { Ticket, TicketResponse } from "@/types";
import { MessageSquare, Calendar, User, ChevronRight, CheckCircle2, ShieldAlert } from "lucide-react";

interface TicketDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: Ticket | null;
    onAddResponse: (message: string) => Promise<void>;
    onResolve: () => Promise<void>;
    isResponding?: boolean;
    isResolving?: boolean;
}

export default function TicketDetailsModal({
    isOpen,
    onClose,
    ticket,
    onAddResponse,
    onResolve,
    isResponding,
    isResolving
}: TicketDetailsModalProps) {
    const t = useTranslations("tickets");
    const tCommon = useTranslations("common");
    const locale = useLocale();
    const [newMessage, setNewMessage] = useState("");

    if (!ticket) return null;

    const handleSubmitResponse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        await onAddResponse(newMessage);
        setNewMessage("");
    };

    const getPriorityColor = (priority: string) => {
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={ticket.subject}
            size="xl"
            footer={
                <div className="flex gap-3 justify-between items-center w-full px-6 py-4 border-t border-slate-100">
                    <div className="flex gap-2">
                        {ticket.status !== "resolved" && (
                            <button
                                onClick={onResolve}
                                disabled={isResolving}
                                className="btn-success flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                {t("resolve")}
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} className="btn-secondary">{tCommon("close")}</button>
                </div>
            }
        >
            <div className="max-h-[70vh] overflow-y-auto">
                {/* Header Info */}
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                            {t(ticket.priority)}
                        </span>
                        <span className={`badge ${getStatusBadge(ticket.status)}`}>
                            {t(ticket.status)}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ticket.createdAt).toLocaleString(locale)}
                        </span>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">
                                {ticket.creatorType === 'PlatformUser' ? t("internal") : (ticket.station?.name || t("station_ticket"))}
                            </p>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{ticket.description}</p>
                        </div>
                    </div>
                </div>

                {/* Responses Thread */}
                <div className="p-6 space-y-8 bg-white">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5" /> {t("responses")}
                    </h3>

                    {ticket.responses.length === 0 ? (
                        <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                            <p className="text-sm text-slate-400">No responses yet</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {ticket.responses.map((resp, idx) => (
                                <div key={idx} className={`flex gap-4 ${resp.userType === 'platform' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${resp.userType === 'platform' ? 'bg-primary/10 text-primary' : 'bg-green-50 text-green-600'}`}>
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${resp.userType === 'platform' ? 'bg-slate-50 text-slate-800' : 'bg-green-50/50 text-green-900'}`}>
                                        <p className="text-xs font-bold mb-1 opacity-50 uppercase tracking-wider">
                                            {resp.userType === 'platform' ? t("internal") : t("station")}
                                        </p>
                                        <p className="text-sm leading-relaxed">{resp.message}</p>
                                        <p className="text-[10px] opacity-40 mt-2 font-mono">
                                            {new Date(resp.createdAt).toLocaleString(locale)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick Response Form */}
                    {ticket.status !== 'resolved' && (
                        <form onSubmit={handleSubmitResponse} className="mt-8 pt-6 border-t border-slate-100">
                            <div className="relative group">
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] resize-none"
                                    placeholder={t("addResponse")}
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    required
                                />
                                <div className="absolute bottom-3 right-3">
                                    <button
                                        type="submit"
                                        disabled={isResponding || !newMessage.trim()}
                                        className="bg-primary text-white p-2 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:grayscale"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Modal>
    );
}
