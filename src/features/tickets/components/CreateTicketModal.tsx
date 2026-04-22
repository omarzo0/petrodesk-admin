import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/shared/Modal";
import { useStations } from "@/features/stations/hooks/useStations";
import { Type, MessageSquare, AlertCircle, Bookmark, Link, Layers } from "lucide-react";
import { Station } from "@/types";

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export default function CreateTicketModal({ isOpen, onClose, onSave, isLoading }: CreateTicketModalProps) {
    const t = useTranslations("tickets");
    const tCommon = useTranslations("common");

    const { data: stations } = useStations();

    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        category: "general",
        priority: "medium",
        ticketType: "station",
        stationId: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { ...payload }: any = formData;
        if (payload.ticketType === 'internal') delete payload.stationId;
        await onSave(payload);
        setFormData({
            subject: "",
            description: "",
            category: "general",
            priority: "medium",
            ticketType: "station",
            stationId: ""
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("createTicket")}
            footer={
                <div className="flex gap-3 justify-end mt-4">
                    <button type="button" onClick={onClose} className="btn-secondary">{tCommon("cancel")}</button>
                    <button
                        type="submit"
                        form="create-ticket-form"
                        disabled={isLoading}
                        className="btn-primary min-w-[100px]"
                    >
                        {isLoading ? tCommon("loading") : tCommon("confirm")}
                    </button>
                </div>
            }
        >
            <form id="create-ticket-form" onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Ticket Type */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, ticketType: 'station' })}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${formData.ticketType === 'station' ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {t("station_ticket")}
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, ticketType: 'internal' })}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${formData.ticketType === 'internal' ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {t("internal")}
                    </button>
                </div>

                {/* Subject */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Type className="w-3 h-3" /> {t("subject")}
                    </label>
                    <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        required
                    />
                </div>

                {/* Station Selection (if station ticket) */}
                {formData.ticketType === 'station' && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Link className="w-3 h-3" /> {t("station")}
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

                {/* Category & Priority */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="w-3 h-3" /> {t("category")}
                        </label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="general">{t("general")}</option>
                            <option value="technical">{t("technical")}</option>
                            <option value="billing">{t("billing")}</option>
                            <option value="feature_request">{t("feature_request")}</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" /> {t("priority")}
                        </label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            value={formData.priority}
                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="low">{t("low")}</option>
                            <option value="medium">{t("medium")}</option>
                            <option value="high">{t("high")}</option>
                            <option value="urgent">{t("urgent")}</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> {t("description")}
                    </label>
                    <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[120px] resize-none"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>
            </form>
        </Modal>
    );
}
