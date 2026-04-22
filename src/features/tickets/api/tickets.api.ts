import { getHeaders } from "@/utils/api.utils";
import { Ticket } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/tickets`;

export const ticketsApi = {
    // Create a new ticket
    create: async (data: any): Promise<Ticket> => {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Get all tickets with optional filtering
    getAll: async (filters: any = {}): Promise<Ticket[]> => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${BASE_URL}?${queryParams}`, {
            headers: getHeaders(),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Get current staff's tickets
    getMyTickets: async (): Promise<Ticket[]> => {
        const response = await fetch(`${BASE_URL}/my`, {
            headers: getHeaders(),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Add response to a ticket
    addResponse: async (id: string, message: string): Promise<Ticket> => {
        const response = await fetch(`${BASE_URL}/${id}/responses`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ message }),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Resolve a ticket
    resolve: async (id: string): Promise<Ticket> => {
        const response = await fetch(`${BASE_URL}/${id}/resolve`, {
            method: "PUT",
            headers: getHeaders(),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // Delete a ticket (Super Admin only)
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
    }
};
