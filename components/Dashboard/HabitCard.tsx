import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Habit, useHabitStore } from '@/store/habitStore';
import { useTranslation } from '@/utils/i18n';
import { CalendarGrid } from './CalendarGrid';
import { getHabitIcon } from '@/utils/habitIcons';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { language, getCurrentStreak, addCheckIn } = useHabitStore();
  const t = useTranslation(language);
  
  const currentStreak = getCurrentStreak(habit.id);
  const HabitIcon = getHabitIcon(habit.icon);

  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingCheckIn = habit.checkIns.find(c => c.date === today);
    
    if (!existingCheckIn) {
      addCheckIn(habit.id, {
        date: today,
        status: 'success'
      });
    }
  };

  const handleCardPress = () => {
    router.push({
      pathname: '/habit-detail',
      params: { habitId: habit.id }
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const todayCheckIn = habit.checkIns.find(c => c.date === today);
  const isCheckedInToday = todayCheckIn?.status === 'success';

  return (
    <Pressable style={styles.card} onPress={handleCardPress}>
      <View style={styles.header}>
        <View style={styles.habitInfo}>
          <HabitIcon size={24} color="#3b82f6" />
          <Text style={styles.habitName}>{habit.name}</Text>
        </View>
        <View style={styles.streakContainer}>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>{t.dashboard.days}</Text>
        </View>
      </View>

      <CalendarGrid habit={habit} />

      {habit.motivation && (
        <View style={styles.motivationSection}>
          <Text style={styles.motivationText}>&ldquo;{habit.motivation}&rdquo;</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.checkInButton, isCheckedInToday && styles.checkedInButton]} 
        onPress={handleCheckIn}
        disabled={isCheckedInToday}
      >
        <Text style={[styles.checkInText, isCheckedInToday && styles.checkedInText]}>
          {isCheckedInToday ? '✓ Checked In' : t.dashboard.checkIn}
        </Text>
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginLeft: 12,
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
  },
  streakLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  motivationSection: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  motivationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  checkInButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkedInButton: {
    backgroundColor: '#10b981',
  },
  checkInText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  checkedInText: {
    color: '#ffffff',
  },
});