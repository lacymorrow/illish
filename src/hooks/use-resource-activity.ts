"use client";

import { useActivityLog } from "@/hooks/use-activity-log";
import {
    ActivityAction,
    ActivityCategory,
    ActivitySeverity,
} from "@/server/constants/activity-log";
import { useCallback } from "react";

interface ResourceActivityOptions {
    details?: string;
    metadata?: Record<string, unknown>;
    resourceId: string;
    resourceType: string;
}

/**
 * Hook for logging resource-related activities
 *
 * @example
 * ```tsx
 * const { logResourceCreate, logResourceUpdate } = useResourceActivity();
 *
 * // Log a resource creation
 * await logResourceCreate({
 *   resourceId: "doc-123",
 *   resourceType: "document",
 *   details: "Created new document: Project Plan"
 * });
 * ```
 */
export const useResourceActivity = () => {
    const { log } = useActivityLog();

    const logResourceCreate = useCallback(
        async (options: ResourceActivityOptions) => {
            return log({
                action: ActivityAction.RESOURCE_CREATE,
                category: ActivityCategory.RESOURCE,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logResourceUpdate = useCallback(
        async (options: ResourceActivityOptions) => {
            return log({
                action: ActivityAction.RESOURCE_UPDATE,
                category: ActivityCategory.RESOURCE,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logResourceDelete = useCallback(
        async (options: ResourceActivityOptions) => {
            return log({
                action: ActivityAction.RESOURCE_DELETE,
                category: ActivityCategory.RESOURCE,
                severity: ActivitySeverity.WARNING,
                ...options,
            });
        },
        [log],
    );

    const logResourceShare = useCallback(
        async (options: ResourceActivityOptions) => {
            return log({
                action: ActivityAction.RESOURCE_SHARE,
                category: ActivityCategory.RESOURCE,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logResourceUnshare = useCallback(
        async (options: ResourceActivityOptions) => {
            return log({
                action: ActivityAction.RESOURCE_UNSHARE,
                category: ActivityCategory.RESOURCE,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logApiKeyCreate = useCallback(
        async (options: ResourceActivityOptions) => {
            return log({
                action: ActivityAction.API_KEY_CREATE,
                category: ActivityCategory.RESOURCE,
                severity: ActivitySeverity.WARNING,
                ...options,
            });
        },
        [log],
    );

    const logApiKeyDelete = useCallback(
        async (options: ResourceActivityOptions) => {
            return log({
                action: ActivityAction.API_KEY_DELETE,
                category: ActivityCategory.RESOURCE,
                severity: ActivitySeverity.WARNING,
                ...options,
            });
        },
        [log],
    );

    const logConfigUpdate = useCallback(
        async (options: ResourceActivityOptions) => {
            return log({
                action: ActivityAction.CONFIG_UPDATE,
                category: ActivityCategory.RESOURCE,
                severity: ActivitySeverity.WARNING,
                ...options,
            });
        },
        [log],
    );

    const logBackupCreate = useCallback(
        async (options: ResourceActivityOptions) => {
            return log({
                action: ActivityAction.BACKUP_CREATE,
                category: ActivityCategory.RESOURCE,
                severity: ActivitySeverity.INFO,
                ...options,
            });
        },
        [log],
    );

    const logBackupRestore = useCallback(
        async (options: ResourceActivityOptions) => {
            return log({
                action: ActivityAction.BACKUP_RESTORE,
                category: ActivityCategory.RESOURCE,
                severity: ActivitySeverity.WARNING,
                ...options,
            });
        },
        [log],
    );

    return {
        logResourceCreate,
        logResourceUpdate,
        logResourceDelete,
        logResourceShare,
        logResourceUnshare,
        logApiKeyCreate,
        logApiKeyDelete,
        logConfigUpdate,
        logBackupCreate,
        logBackupRestore,
    };
};
