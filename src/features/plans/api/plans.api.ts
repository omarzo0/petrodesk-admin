import { getHeaders } from "@/utils/api.utils";
import { Plan } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/plans`;

export const plansApi = {
    // Create a new plan
    create: async (planData: any): Promise<Plan> => {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(planData),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Get all plans
    getAll: async (): Promise<Plan[]> => {
        const response = await fetch(BASE_URL, {
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Update an existing plan
    update: async (id: string, planData: any): Promise<Plan> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(planData),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Deactivate a plan
    deactivate: async (id: string): Promise<Plan> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }
};
