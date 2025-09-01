import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { X, Crown, Check, Star } from 'lucide-react-native';
import { subscriptionService, SubscriptionPlan } from '@/services/subscriptionService';
import { useHabitStore } from '@/store/habitStore';
import { useTranslation } from '@/utils/i18n';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess?: () => void;
}

export function PaywallModal({ visible, onClose, onPurchaseSuccess }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium_monthly');
  const [isLoading, setIsLoading] = useState(false);
  const { setPremium, language } = useHabitStore();
  const t = useTranslation(language);

  const plans = subscriptionService.getAvailablePlans();
  const features = subscriptionService.getPremiumFeatures();

  const handlePurchase = async () => {
    setIsLoading(true);
    
    try {
      const result = await subscriptionService.purchaseSubscription(selectedPlan);
      
      if (result.success) {
        setPremium(true);
        onPurchaseSuccess?.();
        onClose();
        Alert.alert('Success!', 'Welcome to IQuit Premium! 🎉');
      } else {
        Alert.alert('Purchase Failed', result.error || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process purchase');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    
    try {
      const restored = await subscriptionService.restorePurchases();
      if (restored) {
        setPremium(true);
        onClose();
        Alert.alert('Restored!', 'Your premium subscription has been restored');
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases found to restore');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.crownContainer}>
                <Crown size={48} color="#fbbf24" />
              </View>
              <Text style={styles.title}>Upgrade to Premium</Text>
              <Text style={styles.subtitle}>
                Unlock unlimited habits and advanced features
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>Premium Features</Text>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Check size={20} color="#10b981" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Plans */}
            <View style={styles.plansSection}>
              <Text style={styles.plansTitle}>Choose Your Plan</Text>
              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.selectedPlan
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  <View style={styles.planHeader}>
                    <View style={styles.planInfo}>
                      <Text style={[
                        styles.planName,
                        selectedPlan === plan.id && styles.selectedPlanText
                      ]}>
                        {plan.name}
                      </Text>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                    </View>
                    {plan.id === 'premium_yearly' && (
                      <View style={styles.popularBadge}>
                        <Star size={12} color="#fbbf24" />
                        <Text style={styles.popularText}>POPULAR</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.planDuration}>per {plan.duration}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Purchase Button */}
            <TouchableOpacity
              style={[styles.purchaseButton, isLoading && styles.disabledButton]}
              onPress={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.purchaseButtonText}>
                  Start Premium - {plans.find(p => p.id === selectedPlan)?.price}
                </Text>
              )}
            </TouchableOpacity>

            {/* Restore Button */}
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={isLoading}
            >
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>
              Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  crownContainer: {
    backgroundColor: '#fbbf2420',
    borderRadius: 32,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    marginLeft: 12,
    flex: 1,
  },
  plansSection: {
    marginBottom: 24,
  },
  plansTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#334155',
  },
  selectedPlan: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e40af10',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
  },
  selectedPlanText: {
    color: '#3b82f6',
  },
  planPrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
    marginTop: 4,
  },
  planDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  popularBadge: {
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginLeft: 4,
  },
  purchaseButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  restoreButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  termsText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
});