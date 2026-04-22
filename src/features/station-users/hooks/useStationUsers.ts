import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stationUsersApi } from "../api/station-users.api";
import { StationUser } from "@/types";

export const useStationUsers = (stationId: string) => {
    return useQuery({
        queryKey: ["station-users", stationId],
        queryFn: () => stationUsersApi.getByStation(stationId),
        enabled: !!stationId,
    });
};

export const useStationUserActions = (stationId?: string) => {
    const queryClient = useQueryClient();

    const invalidate = () => {
        if (stationId) {
            queryClient.invalidateQueries({ queryKey: ["station-users", stationId] });
        } else {
            queryClient.invalidateQueries({ queryKey: ["station-users"] });
        }
    };

    const createMutation = useMutation({
        mutationFn: stationUsersApi.create,
        onSuccess: invalidate,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<StationUser> }) =>
            stationUsersApi.update(id, data),
        onSuccess: invalidate,
    });

    const deleteMutation = useMutation({
        mutationFn: stationUsersApi.delete,
        onSuccess: invalidate,
    });

    const banMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            stationUsersApi.ban(id, reason),
        onSuccess: invalidate,
    });

    const unbanMutation = useMutation({
        mutationFn: stationUsersApi.unban,
        onSuccess: invalidate,
    });

    return {
        createUser: createMutation.mutateAsync,
        updateUser: updateMutation.mutateAsync,
        deleteUser: deleteMutation.mutateAsync,
        banUser: banMutation.mutateAsync,
        unbanUser: unbanMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isBanning: banMutation.isPending,
        isUnbanning: unbanMutation.isPending,
    };
};
