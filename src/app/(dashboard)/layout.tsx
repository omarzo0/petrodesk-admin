"use client";

import Sidebar from "@/components/layout/Sidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-surface">
                <Sidebar />
                <main className="lg:ms-64 min-h-screen">
                    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
                        {children}
                    </div>
                </main>
            </div>
        </AuthProvider>
    );
}
