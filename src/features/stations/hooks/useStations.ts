import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsApi, Station, StationEnriched } from '../api/stations.api';

export function useStations() {
    return useQuery<StationEnriched[]>({
        queryKey: ['stations'],
        queryFn: () => stationsApi.getAllStations(),
    });
}

export function useStation(id: string) {
    return useQuery({
        queryKey: ['stations', id],
        queryFn: () => stationsApi.getStation(id),
        enabled: !!id,
    });
}

export function useStationActions() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: any) => stationsApi.createStation(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stations'] }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => stationsApi.updateStation(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stations'] }),
    });

    const banMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string, reason: string }) => stationsApi.banStation(id, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stations'] }),
    });

    const unbanMutation = useMutation({
        mutationFn: (id: string) => stationsApi.unbanStation(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stations'] }),
    });

    const softDeleteMutation = useMutation({
        mutationFn: (id: string) => stationsApi.softDelete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stations'] }),
    });

    const hardDeleteMutation = useMutation({
        mutationFn: (id: string) => stationsApi.hardDelete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stations'] }),
    });

    return {
        createStation: createMutation.mutateAsync,
        isCreating: createMutation.isPending,

        updateStation: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,

        banStation: banMutation.mutateAsync,
        isBanning: banMutation.isPending,

        unbanStation: unbanMutation.mutateAsync,
        isUnbanning: unbanMutation.isPending,

        deactivateStation: softDeleteMutation.mutateAsync,
        isDeactivating: softDeleteMutation.isPending,

        deleteStation: hardDeleteMutation.mutateAsync,
        isDeleting: hardDeleteMutation.isPending,
    };
}
