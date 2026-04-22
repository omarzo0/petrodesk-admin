import { getHeaders } from "@/utils/api.utils";
import { Subscription } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/subscriptions`;

export const subscriptionsApi = {
    // Assign a plan to a station (activate subscription)
    assign: async (data: { stationId: string, planId: string, durationMonths?: number }): Promise<Subscription> => {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Get all subscriptions
    getAll: async (): Promise<Subscription[]> => {
        const response = await fetch(BASE_URL, {
            headers: getHeaders(),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Update or extend a subscription
    update: async (id: string, data: { status?: string, currentPeriodEnd?: string, planId?: string }): Promise<Subscription> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    }
};
