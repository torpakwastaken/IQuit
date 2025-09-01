import { useHabitStore } from '@/store/habitStore';

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
}

export function usePremiumFeatures() {
  const { isPremium, habits } = useHabitStore();

  const features: PremiumFeature[] = [
    {
      id: 'unlimited_habits',
      name: 'Unlimited Habits',
      description: 'Track as many habits as you want',
      isAvailable: isPremium || habits.length < 2,
    },
    {
      id: 'advanced_analytics',
      name: 'Advanced Analytics',
      description: 'Detailed insights and trends',
      isAvailable: isPremium,
    },
    {
      id: 'custom_reminders',
      name: 'Custom Reminders',
      description: 'Set personalized notification schedules',
      isAvailable: isPremium,
    },
    {
      id: 'data_export',
      name: 'Data Export',
      description: 'Export your progress data',
      isAvailable: isPremium,
    },
    {
      id: 'priority_support',
      name: 'Priority Support',
      description: 'Get help faster with premium support',
      isAvailable: isPremium,
    },
  ];

  const canUseFeature = (featureId: string): boolean => {
    const feature = features.find(f => f.id === featureId);
    return feature?.isAvailable ?? false;
  };

  const getFeatureStatus = (featureId: string): 'available' | 'premium_required' | 'limit_reached' => {
    if (isPremium) return 'available';
    
    const feature = features.find(f => f.id === featureId);
    if (!feature) return 'premium_required';
    
    if (featureId === 'unlimited_habits' && habits.length >= 2) {
      return 'limit_reached';
    }
    
    return feature.isAvailable ? 'available' : 'premium_required';
  };

  return {
    features,
    canUseFeature,
    getFeatureStatus,
    isPremium,
  };
}