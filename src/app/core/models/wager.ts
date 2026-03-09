export type WagerStatus = 'PROPOSED' | 'COUNTER_OFFERED' | 'ACCEPTED' | 'ACTIVE' | 'LOCKED' | 'PENDING_CONFIRM' | 'COMPLETED' | 'SETTLED' | 'DECLINED';
export type WagerType = 'ONCE_OFF' | 'RECURRING';
export type StakeType = 'PINT' | 'COFFEE' | 'MEAL' | 'MONEY' | 'OTHER';

export interface ProposeWagerRequest {
  opponentId: number;
  groupId: number;
  description: string;
  stakeType: StakeType;
  wagerType: WagerType;
  stakeAmount?: number;
  stakeDescription?: string;
  gameweek?: number;
}

export interface WagerResponse {
  id: number;
  proposerUsername: string;
  opponentUsername: string;
  groupName: string;
  status: WagerStatus;
  wagerType: WagerType;
  stakeType: StakeType;
  stakeAmount?: number;
  stakeDescription?: string;
  description: string;
  gameweek?: number;
  winnerUsername?: string;
  counterOfferCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DebtEntry {
  counterpartyUsername: string;
  stakeType: StakeType;
  stakeAmount?: number;
  stakeDescription?: string;
  wagerId: number;
}

export interface DebtSummary {
  username: string;
  owes: DebtEntry[];
  owedBy: DebtEntry[];
  totalWagersWon: number;
  totalWagersLost: number;
}
