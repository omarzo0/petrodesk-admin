import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { warningsApi } from "../api/warnings.api";

export const useWarnings = (filters: any = {}) => {
    return useQuery({
        queryKey: ["warnings", filters],
        queryFn: () => warningsApi.getAll(filters),
    });
};

export const useWarningActions = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: warningsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["warnings"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
    });

    const resolveMutation = useMutation({
        mutationFn: warningsApi.resolve,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["warnings"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
    });

    const responseMutation = useMutation({
        mutationFn: ({ id, message }: { id: string; message: string }) =>
            warningsApi.addResponse(id, message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["warnings"] });
        },
    });

    return {
        issueWarning: createMutation.mutateAsync,
        resolveWarning: resolveMutation.mutateAsync,
        addResponse: responseMutation.mutateAsync,
        isIssuing: createMutation.isPending,
        isResolving: resolveMutation.isPending,
        isResponding: responseMutation.isPending,
    };
};
