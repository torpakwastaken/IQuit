import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useHabitStore } from '@/store/habitStore';
import { useTranslation } from '@/utils/i18n';
import { habitCategories, getHabitIcon } from '@/utils/habitIcons';
import { PaywallModal } from '@/components/Premium/PaywallModal';

export default function AddHabit() {
  const { addHabit, language, habits, isPremium } = useHabitStore();
  const t = useTranslation(language);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [habitName, setHabitName] = useState<string>('');
  const [motivation, setMotivation] = useState<string>('');
  const [goalDays, setGoalDays] = useState<string>('30');
  const [paywallVisible, setPaywallVisible] = useState(false);

  const canAddHabit = isPremium || habits.length < 2;

  const handleCreateHabit = () => {
    if (!canAddHabit) {
      setPaywallVisible(true);
      return;
    }

    if (!selectedCategory || !habitName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const selectedHabitCategory = habitCategories.find(c => c.id === selectedCategory);
    
    addHabit({
      name: habitName.trim(),
      icon: selectedHabitCategory?.icon || 'plus',
      category: selectedCategory,
      startDate: new Date().toISOString().split('T')[0],
      checkIns: [],
      motivation: motivation.trim(),
      goalDays: parseInt(goalDays) || 30,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={styles.title}>{t.addHabit.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.addHabit.selectCategory}</Text>
          <View style={styles.categoryGrid}>
            {habitCategories.map((category) => {
              const HabitIcon = getHabitIcon(category.icon);
              const isSelected = selectedCategory === category.id;
              
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, isSelected && styles.selectedCategory]}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setHabitName(t.habits[category.name as keyof typeof t.habits] || category.name);
                  }}
                >
                  <HabitIcon 
                    size={32} 
                    color={isSelected ? '#3b82f6' : '#64748b'} 
                  />
                  <Text style={[styles.categoryName, isSelected && styles.selectedCategoryText]}>
                    {t.habits[category.name as keyof typeof t.habits]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.addHabit.habitName}</Text>
          <TextInput
            style={styles.input}
            value={habitName}
            onChangeText={setHabitName}
            placeholder="Enter habit name..."
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.addHabit.motivation}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={motivation}
            onChangeText={setMotivation}
            placeholder={t.addHabit.motivationPlaceholder}
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.addHabit.goalDays}</Text>
          <View style={styles.goalContainer}>
            {['7', '30', '90', '365'].map((days) => (
              <TouchableOpacity
                key={days}
                style={[styles.goalButton, goalDays === days && styles.selectedGoal]}
                onPress={() => setGoalDays(days)}
              >
                <Text style={[styles.goalText, goalDays === days && styles.selectedGoalText]}>
                  {days} {t.dashboard.days}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {!canAddHabit && (
          <View style={styles.limitNotice}>
            <Text style={styles.limitText}>{t.dashboard.habitsLimit}</Text>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => setPaywallVisible(true)}
            >
              <Text style={styles.upgradeText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.createButton, !canAddHabit && styles.disabledButton]} 
          onPress={handleCreateHabit}
          disabled={!canAddHabit}
        >
          <Text style={styles.createButtonText}>{t.addHabit.createHabit}</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        onPurchaseSuccess={() => {
          // Handle successful purchase
          console.log('Premium purchase successful');
        }}
      />
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
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#334155',
  },
  selectedCategory: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e40af20',
  },
  categoryName: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#3b82f6',
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedGoal: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  goalText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  selectedGoalText: {
    color: '#ffffff',
  },
  limitNotice: {
    backgroundColor: '#7c2d1220',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dc262640',
  },
  limitText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#fca5a5',
    textAlign: 'center',
    marginBottom: 8,
  },
  upgradeButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  upgradeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#64748b',
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  bottomSpacer: {
    height: 40,
  },
});