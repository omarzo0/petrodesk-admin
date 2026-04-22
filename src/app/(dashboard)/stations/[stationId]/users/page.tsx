"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import ActionButtons from "@/components/shared/ActionButtons";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import UserModal from "@/features/station-users/components/UserModal";
import { useStationUsers, useStationUserActions } from "@/features/station-users/hooks/useStationUsers";
import { User, ShieldAlert, Ban, Trash2, Edit, Mail, Phone, Fingerprint } from "lucide-react";

export default function StationUsersPage() {
    const params = useParams();
    const stationId = params.stationId as string;

    const t = useTranslations("stationUsers");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    const { data: users, isLoading } = useStationUsers(stationId);
    const actions = useStationUserActions(stationId);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [banReason, setBanReason] = useState("");

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const filteredUsers = users?.filter(u =>
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateUser = async (data: any) => {
        try {
            await actions.createUser(data);
            setIsUserModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateUser = async (data: any) => {
        if (!editingUser) return;
        try {
            await actions.updateUser({ id: editingUser._id, data });
            setIsUserModalOpen(false);
            setEditingUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBan = async () => {
        if (!selectedUser) return;
        try {
            await actions.banUser({ id: selectedUser._id, reason: banReason });
            setIsBanModalOpen(false);
            setBanReason("");
            setSelectedUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnban = async (id: string) => {
        try {
            await actions.unbanUser(id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(tCommon("confirm") + "?")) return;
        try {
            await actions.deleteUser(id);
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        t("firstName"),
        t("role"),
        t("phone"),
        t("nationalId"),
        t("status"),
        tCommon("actions")
    ];

    const rows = filteredUsers?.map(user => ({
        id: user._id,
        cells: [
            <div key="name" className="flex flex-col">
                <span className="font-medium text-slate-900">{user.firstName} {user.lastName}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {user.email}
                </span>
            </div>,
            <span key="role" className="badge badge-warning !bg-orange-50 !text-orange-600 border-orange-100 capitalize">
                {user.role}
            </span>,
            <span key="phone" className="text-sm text-slate-600 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {user.phoneNumber}
            </span>,
            <span key="id" className="text-sm text-slate-600 flex items-center gap-1">
                <Fingerprint className="w-3 h-3 text-slate-400" /> {user.nationalId}
            </span>,
            <span key="status" className={`badge ${user.isBanned ? 'badge-danger' : 'badge-success'}`}>
                {user.isBanned ? t("banned") : t("active")}
            </span>,
            <div key="actions" className="flex items-center gap-2">
                <button
                    onClick={() => {
                        setEditingUser(user);
                        setIsUserModalOpen(true);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                >
                    <Edit className="w-4 h-4" />
                </button>

                {user.isBanned ? (
                    <button
                        onClick={() => handleUnban(user._id)}
                        className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                        title={tCommon("unban")}
                    >
                        <Ban className="w-4 h-4 rotate-180" />
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setSelectedUser(user);
                            setIsBanModalOpen(true);
                        }}
                        className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                        title={t("banUser")}
                    >
                        <Ban className="w-4 h-4" />
                    </button>
                )}

                <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title={tCommon("delete")}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ]
    }));

    return (
        <div className="pb-8">
            <Header
                titleKey="staff"
                extra={
                    <div className="flex items-center gap-2">
                        <ActionButtons
                            onAdd={() => {
                                setEditingUser(null);
                                setIsUserModalOpen(true);
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

            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                isSubmitting={editingUser ? actions.isUpdating : actions.isCreating}
                initialData={editingUser}
                stationId={stationId}
            />

            <Modal
                isOpen={isBanModalOpen}
                onClose={() => setIsBanModalOpen(false)}
                title={t("banUser") + ": " + (selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "")}
                footer={
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setIsBanModalOpen(false)} className="btn-secondary">{tCommon("cancel")}</button>
                        <button onClick={handleBan} className="btn-primary !bg-rose-600 hover:!bg-rose-700">{tCommon("confirm")}</button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm">
                        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                        <p>Banning this staff member will revoke their access to the station mobile/tablet app immediately.</p>
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
