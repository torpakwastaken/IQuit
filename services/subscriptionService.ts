import { Alert } from 'react-native';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
}

export interface PurchaseResult {
  success: boolean;
  error?: string;
  transactionId?: string;
}

export class SubscriptionService {
  private static instance: SubscriptionService;
  
  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  // Available subscription plans
  public getAvailablePlans(): SubscriptionPlan[] {
    return [
      {
        id: 'premium_monthly',
        name: 'Premium Monthly',
        price: '$4.99',
        duration: 'month',
        features: [
          'Unlimited habits',
          'Advanced analytics',
          'Custom reminders',
          'Export data',
          'Priority support'
        ]
      },
      {
        id: 'premium_yearly',
        name: 'Premium Yearly',
        price: '$39.99',
        duration: 'year',
        features: [
          'Unlimited habits',
          'Advanced analytics',
          'Custom reminders',
          'Export data',
          'Priority support',
          'Save 33% vs monthly'
        ]
      }
    ];
  }

  // Initialize RevenueCat (placeholder for now)
  public async initialize(): Promise<void> {
    try {
      // TODO: Initialize RevenueCat SDK
      // This will be implemented when you export the project
      console.log('Subscription service initialized');
    } catch (error) {
      console.error('Failed to initialize subscription service:', error);
    }
  }

  // Check current subscription status
  public async checkSubscriptionStatus(): Promise<boolean> {
    try {
      // TODO: Check with RevenueCat
      // For now, return false (not subscribed)
      return false;
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return false;
    }
  }

  // Purchase a subscription
  public async purchaseSubscription(planId: string): Promise<PurchaseResult> {
    try {
      // TODO: Implement RevenueCat purchase flow
      // For development, show alert that this needs RevenueCat
      Alert.alert(
        'Payment Integration Required',
        'To enable real payments, you need to:\n\n1. Export this project to work locally\n2. Install RevenueCat SDK\n3. Configure your App Store/Play Store products\n\nFor now, this will simulate a successful purchase.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Simulate Purchase', 
            onPress: () => {
              // Simulate successful purchase for development
              return { success: true, transactionId: 'dev_' + Date.now() };
            }
          }
        ]
      );
      
      return { success: false, error: 'Payment integration pending' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Purchase failed' 
      };
    }
  }

  // Restore purchases
  public async restorePurchases(): Promise<boolean> {
    try {
      // TODO: Implement RevenueCat restore
      return false;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return false;
    }
  }

  // Get premium features list
  public getPremiumFeatures(): string[] {
    return [
      'Unlimited habit tracking',
      'Advanced progress analytics',
      'Custom notification schedules',
      'Data export capabilities',
      'Priority customer support',
      'Exclusive motivational content'
    ];
  }
}

export const subscriptionService = SubscriptionService.getInstance();