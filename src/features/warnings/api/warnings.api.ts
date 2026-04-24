import { getHeaders } from "@/utils/api.utils";
import { Warning } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/warnings`;

export const warningsApi = {
    // Issue a new warning
    create: async (data: any): Promise<Warning> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warnings`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Get all warnings (Platform Staff)
    getAll: async (filters: any = {}): Promise<Warning[]> => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warnings?${queryParams}`, {
            headers: getHeaders(),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Add response to a warning
    addResponse: async (id: string, message: string): Promise<Warning> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warnings/${id}/responses`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ message }),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Resolve a warning
    resolve: async (id: string): Promise<Warning> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warnings/${id}/resolve`, {
            method: "PUT",
            headers: getHeaders(),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    }
};
