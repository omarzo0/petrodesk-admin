import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "../api/payments.api";

export const usePayments = (filters: any) => {
    return useQuery({
        queryKey: ["payments", filters],
        queryFn: () => paymentsApi.getAll(filters),
    });
};

export const usePaymentStats = () => {
    return useQuery({
        queryKey: ["payment-stats"],
        queryFn: () => paymentsApi.getStats(),
    });
};

export const usePaymentActions = () => {
    const queryClient = useQueryClient();

    const recordMutation = useMutation({
        mutationFn: paymentsApi.record,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["payment-stats"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            paymentsApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["payment-stats"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
            // Also invalidate stations and subscriptions because payment confirmation activates them
            queryClient.invalidateQueries({ queryKey: ["stations"] });
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
    });

    return {
        recordPayment: recordMutation.mutateAsync,
        updateStatus: updateStatusMutation.mutateAsync,
        isRecording: recordMutation.isPending,
        isUpdating: updateStatusMutation.isPending,
    };
};
