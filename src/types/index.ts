import { PlatformRole, PlatformModule, PlatformAction, PlatformPermissions } from '@/features/auth/permissions';

export type Role = PlatformRole;
export type Resource = PlatformModule;
export type Action = PlatformAction;
export type Permissions = PlatformPermissions;

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    language: string;
    userType: string;
    isSuperAdmin: boolean;
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

export interface NavItem {
    key: string;
    href: string;
    icon: string;
    resource?: Resource;
    action?: Action;
}

export interface TabItem {
    href: string;
    labelKey: string;
    active: boolean;
    onClick?: () => void;
}

export interface StationUser {
    _id: string;
    station: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalId: string;
    role: string;
    language: string;
    isBanned: boolean;
    banReason?: string;
    bannedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    _id: string;
    station: {
        _id: string;
        name: string;
        nameAr?: string;
        code: string;
    };
    subscription: string;
    amount: number;
    method: 'manual' | 'online' | 'bank_transfer';
    status: 'pending' | 'completed' | 'rejected' | 'refunded';
    reference?: string;
    notes?: string;
    processedBy?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    processedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Plan {
    _id: string;
    name: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
    featuresAr?: string[];
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Subscription {
    _id: string;
    station: {
        _id: string;
        name: string;
        code: string;
    };
    plan: {
        _id: string;
        name: string;
        price: number;
        billingCycle: 'monthly' | 'yearly';
    } | string;
    status: 'active' | 'trial' | 'expired' | 'canceled';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    createdAt: string;
    updatedAt: string;
}

export interface TicketResponse {
    user: string | User;
    userType: 'platform' | 'station';
    message: string;
    createdAt: string;
}

export interface Ticket {
    _id: string;
    ticketType: 'station' | 'internal';
    createdBy: string | User;
    creatorType: 'PlatformUser' | 'StationUser';
    subject: string;
    description: string;
    category: 'technical' | 'billing' | 'general' | 'feature_request';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    station?: Station;
    responses: TicketResponse[];
    resolvedBy?: string | User;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Warning {
    _id: string;
    station?: Station;
    isGlobal: boolean;
    targetRoles: string[];
    type: 'security' | 'financial' | 'operational' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    details?: string;
    issuedBy: string | User;
    responses: WarningResponse[];
    isResolved: boolean;
    resolvedBy?: string | User;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface WarningResponse {
    user: string | User;
    userType: 'platform' | 'station';
    message: string;
    createdAt: string;
}

export interface Station {
    _id: string;
    name: string;
    nameAr?: string;
    code: string;
    logo?: string;
    status: 'active' | 'inactive' | 'banned' | 'trial' | 'expired';
    owner: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    };
    subscription: string | Subscription;
    createdAt: string;
    updatedAt: string;
}

import type { ReactNode } from 'react';

export interface DataRow {
    cells: (string | ReactNode)[];
    id?: string;
    editable?: boolean;
}
