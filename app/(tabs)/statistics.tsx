import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react-native';
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

        {habits.map((habit) => (
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
                <Text style={styles.metricValue}>{getDaysSinceStart(habit.id)}</Text>
                <Text style={styles.metricLabel}>Days Since Start</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{getSuccessRate(habit.id)}%</Text>
                <Text style={styles.metricLabel}>Success Rate</Text>
              </View>
            </View>
          </View>
        ))}

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
  bottomSpacer: {
    height: 40,
  },
});