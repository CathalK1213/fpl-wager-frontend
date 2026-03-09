export interface CreateGroupRequest {
  name: string;
}

export interface MemberResponse {
  userId: number;
  username: string;
  joinedAt: string;
}

export interface GroupResponse {
  id: number;
  name: string;
  inviteCode: string;
  adminUsername: string;
  members: MemberResponse[];
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: number;
  username: string;
  fplTeamName: string;
  gameweekPoints: number;
  totalPoints: number;
  overallRank: number;
  position: number;
  fplTeamId: number;
}

export interface LeaderboardResponse {
  groupId: number;
  groupName: string;
  currentGameweek: number;
  standings: LeaderboardEntry[];
}
