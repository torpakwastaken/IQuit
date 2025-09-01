import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CheckIn {
  date: string; // YYYY-MM-DD format
  status: 'success' | 'failed';
  note?: string;
}

export interface DayNote {
  date: string; // YYYY-MM-DD format
  note: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  startDate: string;
  checkIns: CheckIn[];
  dayNotes: DayNote[];
  motivation: string;
  goalDays: number;
  reminderTime?: string;
  createdAt: string;
}

interface HabitStore {
  habits: Habit[];
  language: string;
  theme: 'dark' | 'light' | 'auto';
  isPremium: boolean;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  addCheckIn: (habitId: string, checkIn: CheckIn) => void;
  updateCheckIn: (habitId: string, date: string, status: 'success' | 'failed', note?: string) => void;
  addDayNote: (habitId: string, date: string, note: string) => void;
  updateDayNote: (habitId: string, date: string, note: string) => void;
  deleteDayNote: (habitId: string, date: string) => void;
  getDayNote: (habitId: string, date: string) => string | undefined;
  setLanguage: (language: string) => void;
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  setPremium: (isPremium: boolean) => void;
  getCurrentStreak: (habitId: string) => number;
  getLongestStreak: (habitId: string) => number;
  getSuccessRate: (habitId: string) => number;
  getDaysSinceStart: (habitId: string) => number;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      language: 'en',
      theme: 'dark',
      isPremium: false,

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          checkIns: [],
          dayNotes: [],
        };
        
        set((state) => ({ 
          habits: [...state.habits, newHabit] 
        }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map(habit => 
            habit.id === id ? { ...habit, ...updates } : habit
          )
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter(habit => habit.id !== id)
        }));
      },

      addCheckIn: (habitId, checkIn) => {
        set((state) => ({
          habits: state.habits.map(habit => 
            habit.id === habitId 
              ? { ...habit, checkIns: [...habit.checkIns, checkIn] }
              : habit
          )
        }));
      },

      updateCheckIn: (habitId, date, status, note) => {
        set((state) => ({
          habits: state.habits.map(habit => {
            if (habit.id === habitId) {
              const existingIndex = habit.checkIns.findIndex(c => c.date === date);
              const newCheckIns = [...habit.checkIns];
              
              if (existingIndex >= 0) {
                newCheckIns[existingIndex] = { date, status, note };
              } else {
                newCheckIns.push({ date, status, note });
              }
              
              return { ...habit, checkIns: newCheckIns };
            }
            return habit;
          })
        }));
      },

      addDayNote: (habitId, date, note) => {
        set((state) => ({
          habits: state.habits.map(habit => {
            if (habit.id === habitId) {
              const dayNotes = habit.dayNotes || [];
              const existingNoteIndex = dayNotes.findIndex(n => n.date === date);
              const newDayNotes = [...dayNotes];
              
              if (existingNoteIndex >= 0) {
                newDayNotes[existingNoteIndex] = {
                  date,
                  note,
                  createdAt: new Date().toISOString()
                };
              } else {
                newDayNotes.push({
                  date,
                  note,
                  createdAt: new Date().toISOString()
                });
              }
              
              return { ...habit, dayNotes: newDayNotes };
            }
            return habit;
          })
        }));
      },

      updateDayNote: (habitId, date, note) => {
        set((state) => ({
          habits: state.habits.map(habit => {
            if (habit.id === habitId) {
              const dayNotes = habit.dayNotes || [];
              const noteIndex = dayNotes.findIndex(n => n.date === date);
              if (noteIndex >= 0) {
                const newDayNotes = [...dayNotes];
                newDayNotes[noteIndex] = { ...newDayNotes[noteIndex], note };
                return { ...habit, dayNotes: newDayNotes };
              }
            }
            return habit;
          })
        }));
      },

      deleteDayNote: (habitId, date) => {
        set((state) => ({
          habits: state.habits.map(habit => {
            if (habit.id === habitId) {
              const dayNotes = habit.dayNotes || [];
              return {
                ...habit,
                dayNotes: dayNotes.filter(n => n.date !== date)
              };
            }
            return habit;
          })
        }));
      },

      getDayNote: (habitId, date) => {
        const habit = get().habits.find(h => h.id === habitId);
        if (!habit || !habit.dayNotes) return undefined;
        const dayNote = habit.dayNotes.find(n => n.date === date);
        return dayNote?.note;
      },

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setPremium: (isPremium) => set({ isPremium }),

      getCurrentStreak: (habitId) => {
        const habit = get().habits.find(h => h.id === habitId);
        if (!habit) return 0;

        const sortedCheckIns = habit.checkIns
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < sortedCheckIns.length; i++) {
          const checkInDate = new Date(sortedCheckIns[i].date);
          const dayDiff = Math.floor((today.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === i && sortedCheckIns[i].status === 'success') {
            streak++;
          } else {
            break;
          }
        }
        
        return streak;
      },

      getLongestStreak: (habitId) => {
        const habit = get().habits.find(h => h.id === habitId);
        if (!habit) return 0;

        const sortedCheckIns = habit.checkIns
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let maxStreak = 0;
        let currentStreak = 0;

        for (const checkIn of sortedCheckIns) {
          if (checkIn.status === 'success') {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        }

        return maxStreak;
      },

      getSuccessRate: (habitId) => {
        const habit = get().habits.find(h => h.id === habitId);
        if (!habit || habit.checkIns.length === 0) return 0;

        const successfulDays = habit.checkIns.filter(c => c.status === 'success').length;
        return Math.round((successfulDays / habit.checkIns.length) * 100);
      },

      getDaysSinceStart: (habitId) => {
        const habit = get().habits.find(h => h.id === habitId);
        if (!habit) return 0;

        const startDate = new Date(habit.startDate);
        const today = new Date();
        return Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      },
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);