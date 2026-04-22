import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authApi = {
    login: async (email: string, password: string) => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Invalid credentials");

        if (Array.isArray(result.data)) {
            return result.data[0];
        }
        return result.data;
    },

    forgotPassword: async (email: string) => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/auth/forgotpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to send OTP");
        return result;
    },

    verifyOtp: async (email: string, otp: string) => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Invalid OTP");
        return result;
    },

    resetPassword: async (email: string, password: string, otp: string) => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/auth/resetpassword`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, otp })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to reset password");
        return result;
    },

    getMe: async () => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch profile");

        if (Array.isArray(result.data)) {
            return result.data[0];
        }
        return result.data;
    },

    updateProfile: async (data: { email?: string, firstName?: string, lastName?: string, language?: string }) => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/auth/updateprofile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to update profile");
        return result.data;
    },

    changePassword: async (data: { currentPassword?: string, newPassword?: string }) => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/auth/changepassword`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to change password");
        return result.data;
    }
};
