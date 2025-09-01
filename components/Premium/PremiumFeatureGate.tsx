import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Crown, Lock } from 'lucide-react-native';
import { useHabitStore } from '@/store/habitStore';

interface PremiumFeatureGateProps {
  children: React.ReactNode;
  feature: string;
  onUpgradePress: () => void;
  showUpgradeButton?: boolean;
}

export function PremiumFeatureGate({ 
  children, 
  feature, 
  onUpgradePress, 
  showUpgradeButton = true 
}: PremiumFeatureGateProps) {
  const { isPremium } = useHabitStore();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.lockContainer}>
          <Lock size={32} color="#64748b" />
        </View>
        <Text style={styles.featureText}>{feature}</Text>
        <Text style={styles.premiumText}>Premium Feature</Text>
        
        {showUpgradeButton && (
          <TouchableOpacity style={styles.upgradeButton} onPress={onUpgradePress}>
            <Crown size={16} color="#000000" />
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.blurredContent}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 12,
    padding: 20,
  },
  lockContainer: {
    backgroundColor: '#374151',
    borderRadius: 24,
    padding: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 4,
  },
  premiumText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginLeft: 6,
  },
  blurredContent: {
    opacity: 0.3,
  },
});