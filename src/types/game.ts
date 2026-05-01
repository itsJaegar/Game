export interface Applicant {
  id: string;
  name: string;
  country: string;
  purpose: string;
  hasCriminalRecord: boolean;
  valueScore: number; // 0-100
  documentExpiry: string;
  photo: string;
}

export interface Rule {
  id: string;
  description: string;
  check: (applicant: Applicant) => boolean;
}

export type GameStage = 'BOOT' | 'EMAIL' | 'LOGIN' | 'TERMINAL' | 'SUMMARY' | 'SHOP' | 'CONFIG' | 'DATABASE';

export interface GameSettings {
  color: string;
  font: string;
}

export interface Pet {
  id: string;
  type: 'dog' | 'cat' | 'panda' | 'bird' | 'robot';
  name: string;
}

export interface ApprovedApplicant extends Applicant {
  status: 'ALIVE' | 'DECEASED';
  deathDay?: number;
}

export interface GameState {
  day: number;
  stage: GameStage;
  score: number;
  totalPoints: number;
  applicantsProcessed: number;
  currentApplicantIndex: number;
  applicants: Applicant[];
  approvedHistory: ApprovedApplicant[];
  ownedPets: Pet[];
  settings: GameSettings;
}
