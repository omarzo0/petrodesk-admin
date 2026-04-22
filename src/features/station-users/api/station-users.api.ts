import { getHeaders } from "@/utils/api.utils";
import { StationUser } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/station-users`;

export const stationUsersApi = {
    // Get users for a specific station
    getByStation: async (stationId: string): Promise<StationUser[]> => {
        const response = await fetch(`${BASE_URL}?stationId=${stationId}`, {
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Create a new station user
    create: async (userData: Partial<StationUser> & { password?: string }): Promise<StationUser> => {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Update an existing station user
    update: async (id: string, userData: Partial<StationUser>): Promise<StationUser> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Delete a station user
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
    },

    // Ban a station user
    ban: async (id: string, reason: string): Promise<StationUser> => {
        const response = await fetch(`${BASE_URL}/${id}/ban`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ reason }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Unban a station user
    unban: async (id: string): Promise<StationUser> => {
        const response = await fetch(`${BASE_URL}/${id}/unban`, {
            method: "PUT",
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }
};
