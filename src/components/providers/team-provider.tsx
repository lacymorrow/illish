"use client";

import * as React from "react";
import { createContext, useContext, useState } from "react";

export interface TeamData {
	id: string;
	name: string;
	slug: string;
}

interface TeamContextValue {
	teams: TeamData[];
	selectedTeamId: string | null;
	selectedTeam: TeamData | null;
	setSelectedTeamId: (teamId: string | null) => void;
}

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

interface TeamProviderProps {
	children: React.ReactNode;
	initialTeams: TeamData[];
}

export const TeamProvider = ({ children, initialTeams }: TeamProviderProps) => {
	const [teams] = useState<TeamData[]>(initialTeams || []);
	const [selectedTeamId, setSelectedTeamId] = useState<string | null>(() => {
		return initialTeams?.[0]?.id ?? null;
	});

	const selectedTeam = React.useMemo(() => {
		return teams?.find((team) => team.id === selectedTeamId) ?? null;
	}, [teams, selectedTeamId]);

	const value = React.useMemo(
		() => ({
			teams,
			selectedTeamId,
			selectedTeam,
			setSelectedTeamId,
		}),
		[teams, selectedTeamId, selectedTeam]
	);

	return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export const useTeam = () => {
	const context = useContext(TeamContext);
	if (context === undefined) {
		throw new Error("useTeam must be used within a TeamProvider");
	}
	return context;
};
