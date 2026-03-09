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
