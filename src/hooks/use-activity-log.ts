"use client";

import { useTeam } from "@/hooks/use-team";
import { logActivity } from "@/server/actions/activity-log-actions";
import { type ActivityLogOptions } from "@/server/constants/activity-log";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

/**
 * Hook for logging activities in client components
 *
 * @example
 * ```tsx
 * const { log } = useActivityLog();
 *
 * // Log a team action
 * await log({
 *   action: ActivityAction.TEAM_UPDATE,
 *   category: ActivityCategory.TEAM,
 *   details: "Updated team settings",
 * });
 * ```
 */
export const useActivityLog = () => {
    const { data: session } = useSession();
    const { team } = useTeam();

    const log = useCallback(
        async (options: Omit<ActivityLogOptions, "userId" | "teamId">) => {
            try {
                return await logActivity({
                    ...options,
                    userId: session?.user?.id,
                    teamId: team?.id,
                });
            } catch (error) {
                console.error("Failed to log activity:", error);
                return null;
            }
        },
        [session?.user?.id, team?.id],
    );

    return { log };
};
