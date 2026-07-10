import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../hooks/use-api';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'smart-ai-auth' }
  )
);

export interface JobFilters {
  role: string;
  location: string;
  jobType: string;
  workMode: string;
  skills: string;
  datePosted: string;
  minMatchScore: number;
}

interface FilterState {
  filters: JobFilters;
  setFilter: (key: keyof JobFilters, value: string | number) => void;
  setAllFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: JobFilters = {
  role: '',
  location: '',
  jobType: '',
  workMode: '',
  skills: '',
  datePosted: '',
  minMatchScore: 0,
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,
  setFilter: (key, value) => 
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setAllFilters: (updates) => 
    set((state) => ({ filters: { ...state.filters, ...updates } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  conversationId: string | null;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setConversationId: (id: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [
    {
      id: 'welcome',
      role: 'ai',
      content: "Hi! I'm your Smart AI Assistant. You can ask me to find jobs, update your search filters, or help you navigate the app.",
      timestamp: new Date()
    }
  ],
  conversationId: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: Math.random().toString(36).substring(7), timestamp: new Date() }]
  })),
  setConversationId: (id) => set({ conversationId: id }),
  clearChat: () => set({ messages: [], conversationId: null }),
}));
