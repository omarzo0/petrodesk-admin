import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Station {
    _id: string;
    name: string;
    nameAr: string;
    code: string;
    address?: string;
    phone?: string;
    logo?: string;
    owner?: any;
    isActive: boolean;
    isBanned: boolean;
    banReason?: string;
    bannedAt?: Date;
    createdAt: string;
    updatedAt: string;
}

export interface Subscription {
    _id: string;
    station: string | Station;
    plan: any;
    status: 'trial' | 'active' | 'expired' | 'canceled';
    trialStart?: Date;
    trialEnd?: Date;
    startDate?: Date;
    endDate?: Date;
}

export interface StationEnriched extends Station {
    subscription?: Subscription;
}

export const stationsApi = {
    getAllStations: async (): Promise<StationEnriched[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/stations`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch stations");
        return result.data;
    },

    getStation: async (id: string): Promise<{ station: Station, subscription: Subscription, users: any[] }> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/stations/${id}`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch station details");
        return result.data;
    },

    createStation: async (data: any): Promise<any> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/stations`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to create station");
        return result.data;
    },

    updateStation: async (id: string, data: any): Promise<Station> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/stations/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to update station");
        return result.data;
    },

    banStation: async (id: string, reason: string): Promise<Station> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/stations/${id}/ban`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ reason })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to ban station");
        return result.data;
    },

    unbanStation: async (id: string): Promise<Station> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/stations/${id}/unban`, {
            method: 'PUT',
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to unban station");
        return result.data;
    },

    softDelete: async (id: string): Promise<Station> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/stations/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to deactivate station");
        return result.data;
    },

    hardDelete: async (id: string): Promise<void> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/stations/${id}/hard`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to delete station");
    }
};
