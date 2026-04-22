"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/features/platform-staff/hooks/useProfile";
import { useStaff, useStaffActions } from "@/features/platform-staff/hooks/useStaff";
import {
    User,
    Shield,
    Mail,
    Globe,
    Lock,
    Plus,
    Search,
    Trash2,
    Edit2,
    CheckCircle2,
    XCircle,
    UserCircle2
} from "lucide-react";
import StaffModal from "@/features/platform-staff/components/StaffModal";
import { User as UserType } from "@/types";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
    const t = useTranslations("settings");
    const tStaff = useTranslations("staff");
    const tCommon = useTranslations("common");
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<"profile" | "staff">("profile");
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<UserType | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { updateProfile, changePassword, isUpdating, isChangingPassword } = useProfile();
    const { data: staffList, isLoading: isStaffLoading } = useStaff();
    const { createStaff, updateStaff: updateStaffAction, deleteStaff, isCreating, isUpdating: isUpdatingStaff } = useStaffActions();

    const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';

    // Profile Form State
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        language: user?.language || "ar"
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(profileData);
            toast.success(t("profileUpdated"));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error(tCommon("error"));
            return;
        }
        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success(t("passwordChanged"));
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleSaveStaff = async (data: any) => {
        try {
            if (selectedStaff) {
                await updateStaffAction({ id: selectedStaff.id, data });
                toast.success(tStaff("updated"));
            } else {
                await createStaff(data);
                toast.success(tStaff("created"));
            }
            setIsStaffModalOpen(false);
            setSelectedStaff(null);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteStaff = async (id: string) => {
        if (!window.confirm(tStaff("deleteConfirm"))) return;
        try {
            await deleteStaff(id);
            toast.success(tStaff("deleted"));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const filteredStaff = staffList?.filter(s =>
        s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-6">
                    <div className="bg-primary/10 p-4 rounded-2xl">
                        <UserCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-text tracking-tight uppercase">{t("title")}</h1>
                        <p className="text-slate-500 font-medium">{t("personalInfo")}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "profile"
                            ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    {t("profile")}
                </button>
                {isAdmin && (
                    <button
                        onClick={() => setActiveTab("staff")}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "staff"
                                ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        {t("staff")}
                    </button>
                )}
            </div>

            {activeTab === "profile" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Information */}
                    <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl">
                        <h3 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> {t("personalInfo")}
                        </h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{tStaff("firstName")}</label>
                                    <input
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={profileData.firstName}
                                        onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{tStaff("lastName")}</label>
                                    <input
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={profileData.lastName}
                                        onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{tStaff("email")}</label>
                                <input
                                    type="email"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={profileData.email}
                                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{tStaff("language")}</label>
                                <select
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={profileData.language}
                                    onChange={e => setProfileData({ ...profileData, language: e.target.value })}
                                >
                                    <option value="ar">العربية</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="btn-primary w-full py-4 mt-4"
                            >
                                {isUpdating ? tCommon("loading") : t("updateProfile")}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl">
                        <h3 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-primary" /> {t("security")}
                        </h3>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("currentPassword")}</label>
                                <input
                                    type="password"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={passwordData.currentPassword}
                                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("newPassword")}</label>
                                <input
                                    type="password"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("confirmNewPassword")}</label>
                                <input
                                    type="password"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="btn-secondary w-full py-4 mt-4 !bg-red-50 !text-red-600 !border-red-100 hover:!bg-red-100 transition-all"
                            >
                                {isChangingPassword ? tCommon("loading") : t("changePassword")}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                /* Platform Staff Roster */
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-lg">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-3 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                placeholder={tCommon("search")}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { setSelectedStaff(null); setIsStaffModalOpen(true); }}
                            className="btn-primary flex items-center gap-2 py-3.5 px-6 rounded-2xl w-full md:w-auto justify-center"
                        >
                            <Plus className="w-5 h-5" /> {tStaff("addStaff")}
                        </button>
                    </div>

                    <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-white/20 text-slate-500 text-xs font-black uppercase tracking-widest">
                                    <th className="px-8 py-5 font-black">{tStaff("firstName")}</th>
                                    <th className="px-8 py-5 font-black">{tStaff("email")}</th>
                                    <th className="px-8 py-5 font-black">{tStaff("role")}</th>
                                    <th className="px-8 py-5 font-black text-right">{tCommon("actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50">
                                {isStaffLoading ? (
                                    <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-400">{tCommon("loading")}</td></tr>
                                ) : filteredStaff?.length === 0 ? (
                                    <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-400">{tCommon("noData")}</td></tr>
                                ) : filteredStaff?.map((s) => (
                                    <tr key={s.id} className="group hover:bg-white/60 transition-all">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-bold">
                                                    {s.firstName[0]}{s.lastName[0]}
                                                </div>
                                                <span className="font-bold text-text">{s.firstName} {s.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-slate-600 font-medium">{s.email}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${s.role === 'super_admin' ? 'bg-indigo-100 text-indigo-700' :
                                                    s.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                {tStaff(s.role)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => { setSelectedStaff(s); setIsStaffModalOpen(true); }}
                                                    className="p-2.5 rounded-xl text-primary hover:bg-primary/10 transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                {s.id !== user?.id && (
                                                    <button
                                                        onClick={() => handleDeleteStaff(s.id)}
                                                        className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <StaffModal
                isOpen={isStaffModalOpen}
                onClose={() => setIsStaffModalOpen(false)}
                onSave={handleSaveStaff}
                staff={selectedStaff}
                isLoading={isCreating || isUpdatingStaff}
            />
        </div>
    );
}
