import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Crown } from 'lucide-react-native';
import { useHabitStore } from '@/store/habitStore';
import { useTranslation } from '@/utils/i18n';
import { HabitCard } from '@/components/Dashboard/HabitCard';

export default function Dashboard() {
  const { habits, language, isPremium } = useHabitStore();
  const t = useTranslation(language);

  const canAddHabit = isPremium || habits.length < 2;

  const handleAddHabit = () => {
    if (canAddHabit) {
      router.push('/add-habit');
    } else {
      // Show premium upgrade modal
      alert(t.dashboard.upgradeForMore);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>{t.app.name}</Text>
          <Text style={styles.tagline}>{t.app.tagline}</Text>
        </View>
        {!isPremium && (
          <TouchableOpacity style={styles.premiumButton}>
            <Crown size={20} color="#fbbf24" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.motivationalQuote}>
        <Text style={styles.quoteText}>&ldquo;{t.dashboard.motivationalQuote}&rdquo;</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.dashboard.title}</Text>
          {!isPremium && (
            <Text style={styles.limitText}>{t.dashboard.habitsLimit}</Text>
          )}
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Start your journey</Text>
            <Text style={styles.emptyDescription}>
              Add your first habit to begin tracking your progress
            </Text>
          </View>
        ) : (
          habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <TouchableOpacity 
        style={[styles.fab, !canAddHabit && styles.fabDisabled]} 
        onPress={handleAddHabit}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>
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
  appName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#f1f5f9',
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginTop: 2,
  },
  premiumButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  motivationalQuote: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  quoteText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#e2e8f0',
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  limitText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
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
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#3b82f6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabDisabled: {
    backgroundColor: '#64748b',
    opacity: 0.5,
  },
  bottomSpacer: {
    height: 100,
  },
});