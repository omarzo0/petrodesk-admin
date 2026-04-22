"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { AuthProvider } from "@/hooks/useAuth";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

type Step = "email" | "otp" | "reset";

function ForgotPasswordForm() {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const t = useTranslations("forgotPassword");

    const { forgotPassword, isSendingOtp, verifyOtp, isVerifyingOtp, resetPassword, isResettingPassword } = useAuthActions();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        try {
            await forgotPassword(email);
            setSuccessMsg(t("otpSent"));
            setStep("otp");
        } catch (err: any) {
            setLocalError(err.message);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        try {
            await verifyOtp({ email, otp });
            setSuccessMsg(t("otpVerified"));
            setStep("reset");
        } catch (err: any) {
            setLocalError(err.message);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        if (newPassword !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }
        try {
            await resetPassword({ email, password: newPassword, otp });
            setSuccessMsg(t("passwordReset"));
        } catch (err: any) {
            setLocalError(err.message);
        }
    };

    const isLoading = isSendingOtp || isVerifyingOtp || isResettingPassword;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-full h-12 flex items-center justify-center p-2 group transition-all duration-300">
                            <span className="text-3xl font-black text-white tracking-tight">Petro<span className="text-secondary opacity-80">Desk</span></span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                        {t("title")}
                    </h2>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {(["email", "otp", "reset"] as Step[]).map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === s ? "bg-white text-primary scale-110" : "bg-white/20 text-white/60"}`}>
                                    {i + 1}
                                </div>
                                {i < 2 && <div className={`w-8 h-0.5 ${step === s || (["otp", "reset"].indexOf(step) > i) ? "bg-white/60" : "bg-white/20"}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Step: Email */}
                    {step === "email" && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <p className="text-white/70 text-sm text-center mb-4">{t("emailStep")}</p>
                            <input
                                type="email"
                                placeholder={t("email")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                                required
                                disabled={isLoading}
                            />
                            {localError && <p className="text-red-300 text-sm text-center">{localError}</p>}
                            <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-white text-primary font-semibold rounded-xl text-sm hover:bg-white/90 transition-all disabled:opacity-50">
                                {isSendingOtp ? <i className="bx bx-loader-alt animate-spin text-lg"></i> : t("sendOtp")}
                            </button>
                        </form>
                    )}

                    {/* Step: OTP */}
                    {step === "otp" && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <p className="text-white/70 text-sm text-center mb-4">{t("otpStep")}</p>
                            <input
                                type="text"
                                placeholder={t("otp")}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-center tracking-[0.3em] text-lg"
                                required
                                maxLength={6}
                                disabled={isLoading}
                            />
                            {successMsg && <p className="text-emerald-300 text-sm text-center">{successMsg}</p>}
                            {localError && <p className="text-red-300 text-sm text-center">{localError}</p>}
                            <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-white text-primary font-semibold rounded-xl text-sm hover:bg-white/90 transition-all disabled:opacity-50">
                                {isVerifyingOtp ? <i className="bx bx-loader-alt animate-spin text-lg"></i> : t("verifyOtp")}
                            </button>
                        </form>
                    )}

                    {/* Step: Reset */}
                    {step === "reset" && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <p className="text-white/70 text-sm text-center mb-4">{t("resetStep")}</p>
                            <input
                                type="password"
                                placeholder={t("newPassword")}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                                required
                                disabled={isLoading}
                            />
                            <input
                                type="password"
                                placeholder={t("confirmPassword")}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                                required
                                disabled={isLoading}
                            />
                            {successMsg && <p className="text-emerald-300 text-sm text-center">{successMsg}</p>}
                            {localError && <p className="text-red-300 text-sm text-center">{localError}</p>}
                            <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-white text-primary font-semibold rounded-xl text-sm hover:bg-white/90 transition-all disabled:opacity-50">
                                {isResettingPassword ? <i className="bx bx-loader-alt animate-spin text-lg"></i> : t("resetPassword")}
                            </button>
                        </form>
                    )}

                    {/* Back to login */}
                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
                            ← {t("backToLogin")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <AuthProvider>
            <ForgotPasswordForm />
        </AuthProvider>
    );
}
