"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { NavItem } from "@/types";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";

const navItems: NavItem[] = [
    { key: "overview", href: "/", icon: "bxs-home" },
    { key: "payments", href: "/payments", icon: "bx-credit-card", resource: 'payment', action: 'read' },
    { key: "plans", href: "/plans", icon: "bx-package", resource: 'plan', action: 'read' },
    { key: "subscriptions", href: "/subscriptions", icon: "bx-calendar-check", resource: 'subscription', action: 'read' },
    { key: "stations", href: "/stations", icon: "bx-gas-pump", resource: 'station', action: 'read' },
    { key: "tickets", href: "/tickets", icon: "bx-support", resource: 'ticket', action: 'read' },
    { key: "warnings", href: "/warnings", icon: "bx-error", resource: 'warning', action: 'read' },
    { key: "settings", href: "/settings", icon: "bx-cog" },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const t = useTranslations("sidebar");
    const tApp = useTranslations("app");
    const { can } = usePermissions();
    const { logout } = useAuth();

    const filteredNavItems = navItems.filter(item => {
        if (!item.resource) return true;
        return can(item.resource, item.action || 'read');
    });

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Hamburger toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 start-4 z-50 lg:hidden bg-primary text-white p-2 rounded-lg shadow-elevated"
            >
                <i className={`bx ${isOpen ? "bx-x" : "bx-menu"} text-xl`}></i>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 start-0 h-full w-64 bg-sidebar z-50 shadow-sidebar transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"} lg:translate-x-0 rtl:lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-white/10 flex-shrink-0">
                    <div className="relative w-full h-24 bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-2 backdrop-blur-sm border border-white/5">
                        <div className="relative w-full h-24 bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-2 backdrop-blur-sm border border-white/5">
                            <span className="text-2xl font-black text-white tracking-tight">Petro<span className="text-primary-light">Desk</span></span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hidden">
                    <ul className="space-y-1">
                        {filteredNavItems.map((item) => (
                            <li key={item.key}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
                                >
                                    <i className={`bx ${item.icon} text-lg`}></i>
                                    <span className="text-sm">{t(item.key)}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-white/10 flex-shrink-0">
                    <button
                        onClick={logout}
                        className="sidebar-link text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full"
                    >
                        <i className="bx bx-log-out text-lg"></i>
                        <span className="text-sm">{tApp("logout")}</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
