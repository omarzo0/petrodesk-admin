import { getHeaders } from "@/utils/api.utils";
import { Payment } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/payments`;

export const paymentsApi = {
    // Record a new manual payment
    record: async (paymentData: any): Promise<Payment> => {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(paymentData),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Get all payments with optional filters
    getAll: async (filters: {
        stationId?: string;
        status?: string;
        startDate?: string;
        endDate?: string
    } = {}): Promise<Payment[]> => {
        const queryParams = new URLSearchParams();
        if (filters.stationId) queryParams.append("stationId", filters.stationId);
        if (filters.status) queryParams.append("status", filters.status);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);

        const response = await fetch(`${BASE_URL}?${queryParams.toString()}`, {
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Get transaction stats for overview/dashboards
    getStats: async (): Promise<any> => {
        const response = await fetch(`${BASE_URL}/stats`, {
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Update payment status (Confirm/Reject)
    updateStatus: async (id: string, status: string): Promise<Payment> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }
};
