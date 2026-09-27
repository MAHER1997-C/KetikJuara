export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export type AvatarId = 'robot' | 'kancil' | 'garuda' | 'cat' | 'astro' | 'dragon';
export type SkinColor = 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
export type AccessoryId = 'none' | 'gamer-headset' | 'crown' | 'vr-goggles' | 'grad-cap' | 'space-helmet' | 'ninja-headband';
export type AuraId = 'none' | 'lightning' | 'sparkle' | 'flame' | 'pixel' | 'cosmic';
export type SoundTheme = 'mechanical' | 'pop' | 'laser' | 'typewriter' | 'retro8bit';
export type TitleId = 'pemula' | 'jari-kilat' | 'ahli-10-jari' | 'duta-ketik' | 'dewa-keyboard';

export interface CharacterCustomization {
  avatar: AvatarId;
  skin: SkinColor;
  accessory: AccessoryId;
  aura: AuraId;
  soundTheme: SoundTheme;
  title: TitleId;
}

export interface Exercise {
  id: string;
  text: string;
  hint: string;
  focusKeys?: string[];
}

export interface DifficultyLevel {
  id: string;
  tier: number;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  iconName: string;
  targetWpm: number;
  minAccuracy: number;
  unlockedByDefault: boolean;
  requiredStars: number;
  exercises: Exercise[];
}

export interface TypingSessionResult {
  id: string;
  timestamp: string;
  levelId: string;
  levelTitle: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  timeSpentSeconds: number;
  mistakesCount: number;
  totalKeystrokes: number;
  maxCombo: number;
  stars: number;
  coinsEarned: number;
  weakKeysDetected: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  schoolClass: string;
  studentNumber?: string;
  avatar: CharacterCustomization;
  coins: number;
  unlockedAccessories: AccessoryId[];
  unlockedAuras: AuraId[];
  unlockedAvatars: AvatarId[];
  unlockedTitles: TitleId[];
  levelProgress: Record<string, { stars: number; highWpm: number; highAccuracy: number; completedTimes: number }>;
  keyStats: Record<string, { totalHits: number; errors: number }>;
  fingerStats: Record<FingerId, { totalHits: number; errors: number }>;
  history: TypingSessionResult[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  schoolClass: string;
  avatar: CharacterCustomization;
  wpm: number;
  accuracy: number;
  stars: number;
  levelTitle: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

export interface RaceParticipant {
  id: string;
  name: string;
  schoolClass?: string;
  avatar: CharacterCustomization;
  progress: number; // 0 to 100
  wpm: number;
  accuracy: number;
  finished: boolean;
  finishTimeSeconds?: number;
  rank?: number;
  isBot?: boolean;
  isCurrentUser?: boolean;
}

export interface MultiplayerRoom {
  roomCode: string;
  roomName: string;
  hostId: string;
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  textPrompt: string;
  participants: RaceParticipant[];
  startedAt?: number;
  countdownSeconds?: number;
}

export interface ClassStudentAnalytics {
  id: string;
  name: string;
  schoolClass: string;
  avatar: CharacterCustomization;
  currentLevel: string;
  stars: number;
  avgWpm: number;
  avgAccuracy: number;
  totalSessions: number;
  lastActive: string;
  problemKeys: string[];
  weakFinger: string;
  status: 'online' | 'typing' | 'idle';
  history: TypingSessionResult[];
}
