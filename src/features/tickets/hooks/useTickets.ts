import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsApi } from "../api/tickets.api";

export const useTickets = (filters: any = {}) => {
    return useQuery({
        queryKey: ["tickets", filters],
        queryFn: () => ticketsApi.getAll(filters),
    });
};

export const useMyTickets = () => {
    return useQuery({
        queryKey: ["tickets", "my"],
        queryFn: ticketsApi.getMyTickets,
    });
};

export const useTicketActions = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: ticketsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
    });

    const resolveMutation = useMutation({
        mutationFn: ticketsApi.resolve,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
    });

    const responseMutation = useMutation({
        mutationFn: ({ id, message }: { id: string; message: string }) =>
            ticketsApi.addResponse(id, message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: ticketsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
        },
    });

    return {
        createTicket: createMutation.mutateAsync,
        resolveTicket: resolveMutation.mutateAsync,
        addResponse: responseMutation.mutateAsync,
        deleteTicket: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isResolving: resolveMutation.isPending,
        isResponding: responseMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
