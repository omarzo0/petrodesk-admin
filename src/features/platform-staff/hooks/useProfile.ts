import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuth } from "@/hooks/useAuth";

export const useProfile = () => {
    const queryClient = useQueryClient();
    const { setUser } = useAuth();

    const updateProfileMutation = useMutation({
        mutationFn: authApi.updateProfile,
        onSuccess: (updatedUser) => {
            // Update local state and storage
            setUser(updatedUser);
            localStorage.setItem("auth_user", JSON.stringify(updatedUser));
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: authApi.changePassword,
    });

    return {
        updateProfile: updateProfileMutation.mutateAsync,
        changePassword: changePasswordMutation.mutateAsync,
        isUpdating: updateProfileMutation.isPending,
        isChangingPassword: changePasswordMutation.isPending,
    };
};
