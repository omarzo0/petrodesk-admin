import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface OverviewData {
    stations: {
        total: number;
        active: number;
        inactive: number;
    };
    subscriptions: Record<string, number>;
    finances: {
        totalRevenue: number;
        paymentCount: number;
    } | null;
    support: {
        tickets: Record<string, number>;
        openWarnings: number;
    };
    recentActivity: any[];
}

export const overviewApi = {
    getOverview: async (): Promise<OverviewData> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/overview`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch overview");

        // Handle case where data is an array [ { ... } ]
        const data = Array.isArray(result.data) ? result.data[0] : result.data;
        return data;
    }
};
