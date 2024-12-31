"use client";

import { useActivityLog } from "@/hooks/use-activity-log";
import {
    ActivityAction,
    ActivityCategory,
    ActivitySeverity,
} from "@/server/constants/activity-log";
import { useCallback } from "react";

/**
 * Hook for logging authentication-related activities
 *
 * @example
 * ```tsx
 * const { logSignup, logLogin, logLogout } = useAuthActivity();
 *
 * // Log a signup
 * await logSignup({ details: "User signed up via email" });
 * ```
 */
export const useAuthActivity = () => {
    const { log } = useActivityLog();

    const logSignup = useCallback(
        async (options: {
            details?: string;
            metadata?: Record<string, unknown>;
        }) => {
            return log({
                action: ActivityAction.USER_SIGNUP,
                category: ActivityCategory.AUTH,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logLogin = useCallback(
        async (options: {
            details?: string;
            metadata?: Record<string, unknown>;
        }) => {
            return log({
                action: ActivityAction.USER_LOGIN,
                category: ActivityCategory.AUTH,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logLogout = useCallback(
        async (options: {
            details?: string;
            metadata?: Record<string, unknown>;
        }) => {
            return log({
                action: ActivityAction.USER_LOGOUT,
                category: ActivityCategory.AUTH,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logPasswordResetRequest = useCallback(
        async (options: {
            details?: string;
            metadata?: Record<string, unknown>;
        }) => {
            return log({
                action: ActivityAction.PASSWORD_RESET_REQUEST,
                category: ActivityCategory.AUTH,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logPasswordResetComplete = useCallback(
        async (options: {
            details?: string;
            metadata?: Record<string, unknown>;
        }) => {
            return log({
                action: ActivityAction.PASSWORD_RESET_COMPLETE,
                category: ActivityCategory.AUTH,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logEmailVerificationRequest = useCallback(
        async (options: {
            details?: string;
            metadata?: Record<string, unknown>;
        }) => {
            return log({
                action: ActivityAction.EMAIL_VERIFICATION_REQUEST,
                category: ActivityCategory.AUTH,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logEmailVerificationComplete = useCallback(
        async (options: {
            details?: string;
            metadata?: Record<string, unknown>;
        }) => {
            return log({
                action: ActivityAction.EMAIL_VERIFICATION_COMPLETE,
                category: ActivityCategory.AUTH,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logAccountUpdate = useCallback(
        async (options: {
            details?: string;
            metadata?: Record<string, unknown>;
        }) => {
            return log({
                action: ActivityAction.ACCOUNT_UPDATE,
                category: ActivityCategory.AUTH,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logAccountDelete = useCallback(
        async (options: {
            details?: string;
            metadata?: Record<string, unknown>;
        }) => {
            return log({
                action: ActivityAction.ACCOUNT_DELETE,
                category: ActivityCategory.AUTH,
                severity: ActivitySeverity.WARNING,
                ...options,
            });
        },
        [log],
    );

    return {
        logSignup,
        logLogin,
        logLogout,
        logPasswordResetRequest,
        logPasswordResetComplete,
        logEmailVerificationRequest,
        logEmailVerificationComplete,
        logAccountUpdate,
        logAccountDelete,
    };
};
