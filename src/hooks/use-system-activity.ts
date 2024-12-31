"use client";

import { useActivityLog } from "@/hooks/use-activity-log";
import {
    ActivityAction,
    ActivityCategory,
    ActivitySeverity,
} from "@/server/constants/activity-log";
import { useCallback } from "react";

interface SystemActivityOptions {
    details?: string;
    metadata?: Record<string, unknown>;
    resourceId?: string;
    severity?: ActivitySeverity;
}

/**
 * Hook for logging system-related activities
 *
 * @example
 * ```tsx
 * const { logSystemError, logPerformanceAlert } = useSystemActivity();
 *
 * // Log a system error
 * await logSystemError({
 *   details: "Database connection failed",
 *   metadata: { error: "Connection timeout" }
 * });
 * ```
 */
export const useSystemActivity = () => {
    const { log } = useActivityLog();

    const logSystemStatusChange = useCallback(
        async (options: SystemActivityOptions) => {
            return log({
                action: ActivityAction.SYSTEM_STATUS_CHANGE,
                category: ActivityCategory.SYSTEM,
                severity: options.severity || ActivitySeverity.INFO,
                resourceType: "system",
                ...options,
            });
        },
        [log],
    );

    const logPerformanceAlert = useCallback(
        async (options: SystemActivityOptions) => {
            return log({
                action: ActivityAction.SYSTEM_PERFORMANCE_ALERT,
                category: ActivityCategory.SYSTEM,
                severity: options.severity || ActivitySeverity.WARNING,
                resourceType: "system",
                ...options,
            });
        },
        [log],
    );

    const logSecurityAlert = useCallback(
        async (options: SystemActivityOptions) => {
            return log({
                action: ActivityAction.SYSTEM_SECURITY_ALERT,
                category: ActivityCategory.SYSTEM,
                severity: options.severity || ActivitySeverity.ERROR,
                resourceType: "system",
                ...options,
            });
        },
        [log],
    );

    const logSystemError = useCallback(
        async (options: SystemActivityOptions) => {
            return log({
                action: ActivityAction.SYSTEM_ERROR,
                category: ActivityCategory.SYSTEM,
                severity: options.severity || ActivitySeverity.ERROR,
                resourceType: "system",
                ...options,
            });
        },
        [log],
    );

    const logMaintenanceStart = useCallback(
        async (options: SystemActivityOptions) => {
            return log({
                action: ActivityAction.SYSTEM_MAINTENANCE_START,
                category: ActivityCategory.SYSTEM,
                severity: ActivitySeverity.INFO,
                resourceType: "system",
                ...options,
            });
        },
        [log],
    );

    const logMaintenanceEnd = useCallback(
        async (options: SystemActivityOptions) => {
            return log({
                action: ActivityAction.SYSTEM_MAINTENANCE_END,
                category: ActivityCategory.SYSTEM,
                severity: ActivitySeverity.INFO,
                resourceType: "system",
                ...options,
            });
        },
        [log],
    );

    const logApiRateLimitWarning = useCallback(
        async (options: SystemActivityOptions) => {
            return log({
                action: ActivityAction.API_RATE_LIMIT_WARNING,
                category: ActivityCategory.SYSTEM,
                severity: ActivitySeverity.WARNING,
                resourceType: "api",
                ...options,
            });
        },
        [log],
    );

    const logApiRateLimitExceeded = useCallback(
        async (options: SystemActivityOptions) => {
            return log({
                action: ActivityAction.API_RATE_LIMIT_EXCEEDED,
                category: ActivityCategory.SYSTEM,
                severity: ActivitySeverity.ERROR,
                resourceType: "api",
                ...options,
            });
        },
        [log],
    );

    return {
        logSystemStatusChange,
        logPerformanceAlert,
        logSecurityAlert,
        logSystemError,
        logMaintenanceStart,
        logMaintenanceEnd,
        logApiRateLimitWarning,
        logApiRateLimitExceeded,
    };
};
