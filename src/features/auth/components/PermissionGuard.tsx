import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { PlatformAction as Action, PlatformModule as Resource, PlatformRole as Role } from '../permissions';

interface PermissionGuardProps {
    resource: Resource;
    action: Action;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function PermissionGuard({
    resource,
    action,
    children,
    fallback = null,
}: PermissionGuardProps) {
    const { can } = usePermissions();

    if (!can(resource, action)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

interface RoleGuardProps {
    roles: ('super_admin' | 'admin' | 'employee')[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RoleGuard({
    roles,
    children,
    fallback = null,
}: RoleGuardProps) {
    const { role } = usePermissions();

    if (!role || !roles.includes(role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
