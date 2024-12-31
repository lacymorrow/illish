"use client";

import { useActivityLog } from "@/hooks/use-activity-log";
import {
    ActivityAction,
    ActivityCategory,
    ActivitySeverity,
} from "@/server/constants/activity-log";
import { useCallback } from "react";

interface TeamActivityOptions {
    details?: string;
    metadata?: Record<string, unknown>;
    resourceId?: string;
}

/**
 * Hook for logging team-related activities
 *
 * @example
 * ```tsx
 * const { logTeamCreate, logTeamUpdate, logTeamDelete } = useTeamActivity();
 *
 * // Log a team creation
 * await logTeamCreate({
 *   details: "Created new team: Engineering",
 *   resourceId: "team-123"
 * });
 * ```
 */
export const useTeamActivity = () => {
    const { log } = useActivityLog();

    const logTeamCreate = useCallback(
        async (options: TeamActivityOptions) => {
            return log({
                action: ActivityAction.TEAM_CREATE,
                category: ActivityCategory.TEAM,
                severity: ActivitySeverity.INFO,
                resourceType: "team",
                ...options,
            });
        },
        [log],
    );

    const logTeamUpdate = useCallback(
        async (options: TeamActivityOptions) => {
            return log({
                action: ActivityAction.TEAM_UPDATE,
                category: ActivityCategory.TEAM,
                severity: ActivitySeverity.INFO,
                resourceType: "team",
                ...options,
            });
        },
        [log],
    );

    const logTeamDelete = useCallback(
        async (options: TeamActivityOptions) => {
            return log({
                action: ActivityAction.TEAM_DELETE,
                category: ActivityCategory.TEAM,
                severity: ActivitySeverity.WARNING,
                resourceType: "team",
                ...options,
            });
        },
        [log],
    );

    const logTeamMemberInvite = useCallback(
        async (options: TeamActivityOptions) => {
            return log({
                action: ActivityAction.TEAM_MEMBER_INVITE,
                category: ActivityCategory.TEAM,
                severity: ActivitySeverity.INFO,
                resourceType: "team_member",
                ...options,
            });
        },
        [log],
    );

    const logTeamMemberJoin = useCallback(
        async (options: TeamActivityOptions) => {
            return log({
                action: ActivityAction.TEAM_MEMBER_JOIN,
                category: ActivityCategory.TEAM,
                severity: ActivitySeverity.INFO,
                resourceType: "team_member",
                ...options,
            });
        },
        [log],
    );

    const logTeamMemberLeave = useCallback(
        async (options: TeamActivityOptions) => {
            return log({
                action: ActivityAction.TEAM_MEMBER_LEAVE,
                category: ActivityCategory.TEAM,
                severity: ActivitySeverity.INFO,
                resourceType: "team_member",
                ...options,
            });
        },
        [log],
    );

    const logTeamMemberRemove = useCallback(
        async (options: TeamActivityOptions) => {
            return log({
                action: ActivityAction.TEAM_MEMBER_REMOVE,
                category: ActivityCategory.TEAM,
                severity: ActivitySeverity.WARNING,
                resourceType: "team_member",
                ...options,
            });
        },
        [log],
    );

    const logTeamRoleUpdate = useCallback(
        async (options: TeamActivityOptions) => {
            return log({
                action: ActivityAction.TEAM_ROLE_UPDATE,
                category: ActivityCategory.TEAM,
                severity: ActivitySeverity.INFO,
                resourceType: "team_role",
                ...options,
            });
        },
        [log],
    );

    const logTeamPermissionUpdate = useCallback(
        async (options: TeamActivityOptions) => {
            return log({
                action: ActivityAction.TEAM_PERMISSION_UPDATE,
                category: ActivityCategory.TEAM,
                severity: ActivitySeverity.WARNING,
                resourceType: "team_permission",
                ...options,
            });
        },
        [log],
    );

    return {
        logTeamCreate,
        logTeamUpdate,
        logTeamDelete,
        logTeamMemberInvite,
        logTeamMemberJoin,
        logTeamMemberLeave,
        logTeamMemberRemove,
        logTeamRoleUpdate,
        logTeamPermissionUpdate,
    };
};
