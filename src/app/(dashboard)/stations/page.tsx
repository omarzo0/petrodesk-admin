"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import ActionButtons from "@/components/shared/ActionButtons";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import StationModal from "@/features/stations/components/StationModal";
import { useStations, useStationActions } from "@/features/stations/hooks/useStations";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { Building2, ShieldAlert, Ban, Trash2, Edit, Users } from "lucide-react";

export default function StationsPage() {
    const t = useTranslations("stations");
    const tCommon = useTranslations("common");
    const locale = useLocale();
    const { data: stations, isLoading } = useStations();
    const actions = useStationActions();
    const { isSuperAdmin } = usePermissions();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStation, setSelectedStation] = useState<any>(null);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [banReason, setBanReason] = useState("");

    const [isStationModalOpen, setIsStationModalOpen] = useState(false);
    const [editingStation, setEditingStation] = useState<any>(null);

    const filteredStations = stations?.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nameAr.includes(searchTerm) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateStation = async (data: any) => {
        try {
            await actions.createStation(data);
            setIsStationModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStation = async (data: any) => {
        if (!editingStation) return;
        try {
            await actions.updateStation({ id: editingStation._id, data });
            setIsStationModalOpen(false);
            setEditingStation(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBan = async () => {
        if (!selectedStation) return;
        try {
            await actions.banStation({ id: selectedStation._id, reason: banReason });
            setIsBanModalOpen(false);
            setBanReason("");
            setSelectedStation(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnban = async (id: string) => {
        try {
            await actions.unbanStation(id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleHardDelete = async (id: string) => {
        if (!confirm(t("delete") + "?")) return;
        try {
            await actions.deleteStation(id);
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        t("name"),
        t("code"),
        t("owner"),
        t("subscription"),
        t("status"),
        tCommon("actions")
    ];

    const rows = filteredStations?.map(station => ({
        id: station._id,
        cells: [
            <div key="name" className="flex items-center gap-3">
                {station.logo ? (
                    <img src={station.logo} alt="" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-400" />
                    </div>
                )}
                <span className="font-medium text-slate-900">
                    {locale === "ar" ? station.nameAr : station.name}
                </span>
            </div>,
            <code key="code" className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600 font-mono">
                {station.code}
            </code>,
            <div key="owner" className="flex flex-col">
                <span className="text-sm text-slate-800">
                    {station.owner?.firstName} {station.owner?.lastName}
                </span>
                <span className="text-xs text-slate-500">{station.owner?.email}</span>
            </div>,
            <div key="sub" className="flex flex-col">
                <span className={`text-xs font-bold uppercase ${station.subscription?.status === 'trial' ? 'text-blue-500' :
                    station.subscription?.status === 'active' ? 'text-emerald-500' :
                        'text-rose-500'
                    }`}>
                    {station.subscription ? t(station.subscription.status) : '—'}
                </span>
                {station.subscription?.endDate && (
                    <span className="text-[10px] text-slate-400">
                        {new Date(station.subscription.endDate).toLocaleDateString()}
                    </span>
                )}
            </div>,
            <span key="status" className={`badge ${station.isBanned ? 'badge-danger' :
                station.isActive ? 'badge-success' : 'badge-warning'
                }`}>
                {station.isBanned ? t("banned") : station.isActive ? t("active") : t("inactive")}
            </span>,
            <div key="actions" className="flex items-center gap-2">
                <Link
                    href={`/stations/${station._id}/users`}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                    title={t("staff") || "Users"}
                >
                    <Users className="w-4 h-4" />
                </Link>

                <button
                    onClick={() => {
                        setEditingStation(station);
                        setIsStationModalOpen(true);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                >
                    <Edit className="w-4 h-4" />
                </button>

                {station.isBanned ? (
                    <button
                        onClick={() => handleUnban(station._id)}
                        className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                        title={t("unban")}
                    >
                        <Ban className="w-4 h-4 rotate-180" />
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setSelectedStation(station);
                            setIsBanModalOpen(true);
                        }}
                        className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                        title={t("ban")}
                    >
                        <Ban className="w-4 h-4" />
                    </button>
                )}

                {isSuperAdmin && (
                    <button
                        onClick={() => handleHardDelete(station._id)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        title={t("delete")}
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
                titleKey="stations"
                extra={
                    <div className="flex items-center gap-2">
                        <ActionButtons
                            onAdd={() => {
                                setEditingStation(null);
                                setIsStationModalOpen(true);
                            }}
                            extra={
                                <div className="relative">
                                    <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                    <input
                                        type="text"
                                        placeholder={tCommon("search")}
                                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-64"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            }
                        />
                    </div>
                }
            />

            <div className="page-card !p-0 overflow-hidden border border-white/5 shadow-sm">
                <DataTable
                    columns={columns}
                    rows={rows || []}
                    isLoading={isLoading}
                />
            </div>

            <StationModal
                isOpen={isStationModalOpen}
                onClose={() => setIsStationModalOpen(false)}
                onSubmit={editingStation ? handleUpdateStation : handleCreateStation}
                isSubmitting={editingStation ? actions.isUpdating : actions.isCreating}
                initialData={editingStation}
            />

            {/* Ban Reason Modal */}
            <Modal
                isOpen={isBanModalOpen}
                onClose={() => setIsBanModalOpen(false)}
                title={t("ban") + ": " + (selectedStation ? (locale === "ar" ? selectedStation.nameAr : selectedStation.name) : "")}
                footer={
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setIsBanModalOpen(false)} className="btn-secondary">{tCommon("cancel")}</button>
                        <button onClick={handleBan} className="btn-primary !bg-rose-600 hover:!bg-rose-700">{t("ban")}</button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm">
                        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                        <p>Banning a station will revoke its access to all services immediately.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t("banReason")}</label>
                        <textarea
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[120px]"
                            placeholder="Enter the reason for banning..."
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
