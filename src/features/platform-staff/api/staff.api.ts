import { getHeaders } from "@/utils/api.utils";
import { User } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/staff`;

export const staffApi = {
    // Get all platform staff
    getAll: async (): Promise<User[]> => {
        const response = await fetch(BASE_URL, {
            headers: getHeaders(),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Create a new platform staff member
    create: async (data: any): Promise<User> => {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Update a platform staff member
    update: async (id: string, data: any): Promise<User> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Delete a platform staff member
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
    }
};
