import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "../api/staff.api";

export const useStaff = () => {
    return useQuery({
        queryKey: ["staff"],
        queryFn: staffApi.getAll,
    });
};

export const useStaffActions = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: staffApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            staffApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: staffApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });

    return {
        createStaff: createMutation.mutateAsync,
        updateStaff: updateMutation.mutateAsync,
        deleteStaff: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
