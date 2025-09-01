import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Target, Calendar, Award, Trophy } from 'lucide-react-native';
import { useHabitStore } from '@/store/habitStore';
import { useTranslation } from '@/utils/i18n';

export default function Statistics() {
  const { habits, language, getCurrentStreak, getSuccessRate, getDaysSinceStart } = useHabitStore();
  const t = useTranslation(language);

  const totalHabits = habits.length;
  const averageStreak = habits.length > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + getCurrentStreak(habit.id), 0) / habits.length)
    : 0;
  const totalCleanDays = habits.reduce((sum, habit) => sum + getDaysSinceStart(habit.id), 0);
  const overallSuccessRate = habits.length > 0
    ? Math.round(habits.reduce((sum, habit) => sum + getSuccessRate(habit.id), 0) / habits.length)
    : 0;

  const StatCard = ({ icon: Icon, title, value, subtitle, color = '#3b82f6' }: any) => (
    <View style={styles.statCard}>
      <Icon size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.statistics.title}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatCard
            icon={Target}
            title={t.statistics.totalHabits}
            value={totalHabits}
            color="#3b82f6"
          />
          <StatCard
            icon={TrendingUp}
            title={t.statistics.averageStreak}
            value={averageStreak}
            subtitle={t.dashboard.days}
            color="#10b981"
          />
          <StatCard
            icon={Calendar}
            title={t.statistics.totalDays}
            value={totalCleanDays}
            subtitle={t.dashboard.days}
            color="#f59e0b"
          />
          <StatCard
            icon={Award}
            title={t.statistics.successRate}
            value={`${overallSuccessRate}%`}
            color="#8b5cf6"
          />
        </View>

        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyDescription}>
              Add your first habit to see detailed statistics
            </Text>
          </View>
        )}

        {habits.map((habit) => {
          const daysSinceStart = getDaysSinceStart(habit.id);
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
            <View key={habit.id} style={styles.habitStats}>
              <View style={styles.habitHeader}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitCategory}>{t.habits[habit.category as keyof typeof t.habits]}</Text>
              </View>
              <View style={styles.habitMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{getCurrentStreak(habit.id)}</Text>
                  <Text style={styles.metricLabel}>Current Streak</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{daysSinceStart}</Text>
                  <Text style={styles.metricLabel}>Days Since Start</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{getSuccessRate(habit.id)}%</Text>
                  <Text style={styles.metricLabel}>Success Rate</Text>
                </View>
              </View>
              
              <View style={styles.milestonesSection}>
                <Text style={styles.milestonesTitle}>Milestones</Text>
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
            </View>
          );
        })}

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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#f1f5f9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#f1f5f9',
    marginVertical: 8,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  habitStats: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  habitHeader: {
    marginBottom: 16,
  },
  habitName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
  },
  habitCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  habitMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  milestonesSection: {
    marginTop: 16,
  },
  milestonesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  milestones: {
    backgroundColor: '#0f172a',
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
  bottomSpacer: {
    height: 40,
  },
});