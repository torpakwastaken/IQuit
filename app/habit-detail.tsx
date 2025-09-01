import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Trophy, Target, Trash2 } from 'lucide-react-native';
import { useHabitStore } from '@/store/habitStore';
import { useTranslation } from '@/utils/i18n';
import { CalendarView } from '@/components/Dashboard/CalendarView';
import { getHabitIcon } from '@/utils/habitIcons';

export default function HabitDetail() {
  const { habitId } = useLocalSearchParams<{ habitId: string }>();
  const { 
    habits, 
    language, 
    getCurrentStreak, 
    getLongestStreak, 
    getDaysSinceStart,
    deleteHabit 
  } = useHabitStore();
  const t = useTranslation(language);

  const habit = habits.find(h => h.id === habitId);

  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Habit not found</Text>
      </SafeAreaView>
    );
  }

  const HabitIcon = getHabitIcon(habit.icon);
  const currentStreak = getCurrentStreak(habit.id);
  const longestStreak = getLongestStreak(habit.id);
  const daysSinceStart = getDaysSinceStart(habit.id);

  const handleDeleteHabit = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone and will remove all your progress.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            router.back();
          },
        },
      ]
    );
  };

  const milestones = [
    { days: 1, title: t.milestones.day1, achieved: daysSinceStart >= 1 },
    { days: 3, title: t.milestones.day3, achieved: daysSinceStart >= 3 },
    { days: 7, title: t.milestones.week1, achieved: daysSinceStart >= 7 },
    { days: 14, title: t.milestones.week2, achieved: daysSinceStart >= 14 },
    { days: 30, title: t.milestones.month1, achieved: daysSinceStart >= 30 },
    { days: 90, title: t.milestones.month3, achieved: daysSinceStart >= 90 },
    { days: 180, title: t.milestones.month6, achieved: daysSinceStart >= 180 },
    { days: 365, title: t.milestones.year1, achieved: daysSinceStart >= 365 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <View style={styles.habitInfo}>
          <HabitIcon size={32} color="#3b82f6" />
          <Text style={styles.habitName}>{habit.name}</Text>
        </View>
        <TouchableOpacity onPress={handleDeleteHabit} style={styles.deleteButton}>
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Calendar size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{daysSinceStart}</Text>
            <Text style={styles.statLabel}>Days Since Start</Text>
          </View>
          
          <View style={styles.statCard}>
            <Target size={24} color="#10b981" />
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Trophy size={24} color="#f59e0b" />
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Calendar</Text>
          <CalendarView habit={habit} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          <View style={styles.milestones}>
            {milestones.map((milestone, index) => (
              <View 
                key={index} 
                style={[styles.milestone, milestone.achieved && styles.achievedMilestone]}
              >
                <View style={[styles.milestoneIcon, milestone.achieved && styles.achievedIcon]}>
                  <Trophy 
                    size={16} 
                    color={milestone.achieved ? '#fbbf24' : '#64748b'} 
                  />
                </View>
                <View style={styles.milestoneContent}>
                  <Text style={[styles.milestoneTitle, milestone.achieved && styles.achievedTitle]}>
                    {milestone.title}
                  </Text>
                  <Text style={styles.milestoneDays}>{milestone.days} {t.dashboard.days}</Text>
                </View>
                {milestone.achieved && (
                  <View style={styles.achievedBadge}>
                    <Text style={styles.achievedText}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {habit.motivation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Motivation</Text>
            <View style={styles.motivationCard}>
              <Text style={styles.motivationText}>&ldquo;{habit.motivation}&rdquo;</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginLeft: 12,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#7f1d1d20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef444440',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#f1f5f9',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  milestones: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  milestoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#37415120',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievedIcon: {
    backgroundColor: '#fbbf2420',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  achievedTitle: {
    color: '#f1f5f9',
  },
  milestoneDays: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  achievedBadge: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievedText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  motivationCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    borderWidth: 1,
    borderColor: '#334155',
  },
  motivationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#e2e8f0',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 50,
  },
  bottomSpacer: {
    height: 40,
  },
});