import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { plansApi } from "../api/plans.api";

export const usePlans = () => {
    return useQuery({
        queryKey: ["plans"],
        queryFn: plansApi.getAll,
    });
};

export const usePlanActions = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: plansApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            plansApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
    });

    const deactivateMutation = useMutation({
        mutationFn: plansApi.deactivate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
    });

    return {
        createPlan: createMutation.mutateAsync,
        updatePlan: updateMutation.mutateAsync,
        deactivatePlan: deactivateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeactivating: deactivateMutation.isPending,
    };
};
