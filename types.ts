export enum Grade {
  FRESHMAN = '大一 (种子轮)',
  SOPHOMORE = '大二 (天使轮)',
  JUNIOR = '大三 (A轮)',
  SENIOR = '大四 (IPO冲刺)',
}

export interface PoolState {
  growth: number; // Percentage 0-100 or Amount
  defense: number;
  opportunity: number;
}

export interface Wallet {
  total: number;
  growth: number;
  defense: number;
  opportunity: number;
}

export interface UserProfile {
  name: string;
  grade: Grade;
  monthlyBudget: number;
  setupComplete: boolean;
  level: string; // e.g., "实习生 CEO"
  xp: number;
  maxXp: number;
}

export type MessageType = 'text' | 'image';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  type: MessageType;
  content: string; 
  caption?: string; 
  timestamp: Date;
}

export interface CFOStatus {
  mood: 'happy' | 'anxious' | 'neutral' | 'skeptical';
  text: string;
}

export interface CFOAnalysis {
  advice: string;
  mood: 'happy' | 'anxious' | 'neutral' | 'skeptical';
  moodText: string;
}

export interface ROIAnalysis {
  score: 'S' | 'A' | 'B' | 'C' | 'D';
  commentary: string;
  impact: string; // e.g., "成长池潜能 +15%"
}

export interface Task {
  id: string;
  title: string;
  reward: string; // e.g. "成长池 +20"
  completed: boolean;
  type: 'daily' | 'weekly' | 'milestone';
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: 'growth' | 'defense' | 'opportunity';
  date: Date;
  aiReason?: string;
}

// Navigation Tabs
export type TabView = 'dashboard' | 'pools' | 'roi' | 'tasks' | 'profile';
