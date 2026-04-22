"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { TrendingUp, Wallet, Users, Info, Building2, Ticket, ShieldAlert } from "lucide-react";
import { useOverview } from "@/features/overview/hooks/useOverview";
import { usePaymentStats } from "@/features/payments/hooks/usePayments";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import DataTable from "@/components/shared/DataTable";

const COLORS = ["#003a5d", "#0088FE", "#00C49F", "#FFBB28"];

export default function OverviewPage() {
    const t = useTranslations("overview");
    const tCommon = useTranslations("common");
    const { data: overview, isLoading, isError } = useOverview();
    const { data: payStats } = usePaymentStats();
    const { isAdmin, isSuperAdmin } = usePermissions();

    const showFinances = isAdmin || isSuperAdmin;

    // Use actual monthly revenue from payment stats if available, otherwise fallback to empty
    const revenueData = React.useMemo(() => {
        if (!payStats?.monthlyRevenue) return [];
        return payStats.monthlyRevenue
            .map((item: any) => ({
                name: item._id,
                amount: item.revenue
            }))
            .reverse();
    }, [payStats]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isError || !overview) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <i className="bx bx-error-circle text-6xl text-danger mb-4"></i>
                <h2 className="text-xl font-bold">{tCommon("error")}</h2>
            </div>
        );
    }

    // Map subscription statuses for the pie chart
    const subscriptionPieData = Object.entries(overview.subscriptions).map(([status, count]) => ({
        name: status,
        value: count
    }));

    const cards = [
        {
            key: "totalStations",
            value: overview.stations.total.toString(),
            icon: <Building2 className="w-6 h-6" />,
            color: "text-blue-600",
            bg: "bg-blue-600/10"
        },
        {
            key: "activeSubscriptions",
            value: overview.subscriptions.active?.toString() || "0",
            icon: <Wallet className="w-6 h-6" />,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            key: "openTickets",
            value: overview.support.tickets.open?.toString() || "0",
            icon: <Ticket className="w-6 h-6" />,
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        },
        ...(showFinances && overview.finances ? [{
            key: "totalRevenue",
            value: `${overview.finances.totalRevenue.toLocaleString()} EGP`,
            icon: <TrendingUp className="w-6 h-6" />,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }] : [{
            key: "openWarnings",
            value: overview.support.openWarnings.toString(),
            icon: <ShieldAlert className="w-6 h-6" />,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }])
    ];

    return (
        <div className="pb-8">
            <Header titleKey="overview" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, i) => (
                    <div key={i} className="page-card group hover:shadow-xl transition-all duration-300 border border-white/5 ring-1 ring-black/5">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                                    {t(card.key)}
                                </p>
                                <p className="text-xl font-bold text-slate-900 tracking-tight">
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Overview (Admin only) or Station Distribution */}
                <div className="page-card border border-white/5 shadow-sm overflow-hidden h-96">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">
                            {showFinances ? t("revenueOverview") : t("stationStatus")}
                        </h3>
                    </div>
                    <div className="h-full pb-12">
                        {showFinances ? (
                            revenueData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#003a5d" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#003a5d" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="amount" stroke="#003a5d" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                    {tCommon("noData") || "No revenue data yet"}
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                                        <p className="text-slate-500 text-sm mb-1">Active</p>
                                        <p className="text-2xl font-bold text-blue-600">{overview.stations.active}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                        <p className="text-slate-500 text-sm mb-1">Inactive</p>
                                        <p className="text-2xl font-bold text-slate-600">{overview.stations.inactive}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subscription Distribution */}
                <div className="page-card border border-white/5 shadow-sm overflow-hidden h-96">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">{t("subscriptionDistribution")}</h3>
                    <div className="h-full pb-12">
                        {subscriptionPieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={subscriptionPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {subscriptionPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                {tCommon("noData")}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity (Admin only) */}
            {showFinances && overview.recentActivity.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{t("recentActivity")}</h3>
                    <DataTable
                        columns={["Date", "Station", "Amount", "Status"]}
                        rows={overview.recentActivity.map((activity: any) => ({
                            cells: [
                                new Date(activity.createdAt).toLocaleDateString(),
                                activity.station?.name || "Unknown",
                                `${activity.amount} EGP`,
                                activity.status
                            ]
                        }))}
                    />
                </div>
            )}

            {/* Insights Section */}
            <div className="page-card border border-white/5 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-slate-800">{t("insights")}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <i className="bx bx-bulb text-blue-500 text-xl"></i>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {t("insight1")}
                        </p>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <ShieldAlert className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {t("insight2")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
