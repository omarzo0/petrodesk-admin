import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "../api/subscriptions.api";

export const useSubscriptions = () => {
    return useQuery({
        queryKey: ["subscriptions"],
        queryFn: subscriptionsApi.getAll,
    });
};

export const useSubscriptionActions = () => {
    const queryClient = useQueryClient();

    const assignMutation = useMutation({
        mutationFn: subscriptionsApi.assign,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
            queryClient.invalidateQueries({ queryKey: ["stations"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            subscriptionsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
            queryClient.invalidateQueries({ queryKey: ["stations"] });
        },
    });

    return {
        assignPlan: assignMutation.mutateAsync,
        updateSubscription: updateMutation.mutateAsync,
        isAssigning: assignMutation.isPending,
        isUpdating: updateMutation.isPending,
    };
};
