# IQuit - Habit Tracker App

A React Native Expo app for tracking and breaking bad habits with premium subscription features.

## Features

### Free Tier
- Track up to 2 habits
- Basic progress tracking
- Daily check-ins
- Simple statistics

### Premium Features
- Unlimited habit tracking
- Advanced analytics and insights
- Custom notification schedules
- Data export capabilities
- Priority customer support
- Exclusive motivational content

## Payment Integration

This app is designed to work with RevenueCat for subscription management. To enable real payments:

1. **Export the project** to work locally (Cursor, VS Code, etc.)
2. **Install RevenueCat SDK**: Follow the [official Expo guide](https://www.revenuecat.com/docs/getting-started/installation/expo)
3. **Configure products** in App Store Connect and Google Play Console
4. **Set up RevenueCat** with your app store credentials
5. **Update the subscription service** to use real RevenueCat methods

### Current Implementation

The app currently includes:
- Complete paywall UI with subscription plans
- Premium feature gating system
- Subscription service architecture (ready for RevenueCat integration)
- Mock purchase flow for development testing

### Next Steps for Production

1. Replace mock methods in `services/subscriptionService.ts` with RevenueCat SDK calls
2. Configure your subscription products in RevenueCat dashboard
3. Test the purchase flow on physical devices
4. Submit to app stores with in-app purchase capabilities

## Development

```bash
npm run dev
```

## Tech Stack

- React Native with Expo
- Expo Router for navigation
- Zustand for state management
- AsyncStorage for persistence
- Lucide React Native for icons
- RevenueCat (for production payments)
