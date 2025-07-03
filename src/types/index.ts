export interface ActivityEntry {
  id: string;
  date: string;
  description: string;
  timeSpent: number; // in minutes
  feeling: string; // Nuevo campo: ¿Cómo te sientes?
}

export interface Goal {
    id:string;
    text: string;
    area: 'personal' | 'profesional' | 'salud' | 'social';
    deadline: string;
    isCompleted: boolean;
}

export interface Routine {
    id: string;
    text: string;
    time: string;
    isCompleted: boolean;
}

export interface TriggerEntry {
    id: string;
    date: string;
    situation: string;
    thought: string;
    feeling: string;
    action: string;
}

export interface CbtEntry {
    id: string;
    date: string;
    situation: string;
    automaticThought: string;
    evidenceFor: string;
    evidenceAgainst: string;
    alternativeThought: string;
    outcome: string;
}

export interface DefeatEntry {
  id: string;
  date: string;
  gameMode: 'ARAM' | 'TFT' | 'Ranked' | 'Normales';
  timeLost: number; // in minutes
  feeling: string; // Nuevo campo: ¿Cómo te sientes?
}

export interface UserData {
  onboardingComplete: boolean;
  userName: string;
  dayZero: string | null;
  commitment: string;
  assessmentScore: number;
  horasRecuperadas: number; // in minutes
  horasPorRecuperar: number; // in minutes
  killStreak: number;
  activities: ActivityEntry[];
  goals: Goal[];
  routines: Routine[];
  triggers: TriggerEntry[];
  cbtEntries: CbtEntry[];
  defeats: DefeatEntry[];
}