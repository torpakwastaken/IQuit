import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, useState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Globe, 
  Palette, 
  Bell, 
  Crown, 
  Info, 
  MessageCircle,
  ChevronRight 
} from 'lucide-react-native';
import { useHabitStore } from '@/store/habitStore';
import { useTranslation, getAvailableLanguages } from '@/utils/i18n';
import { PaywallModal } from '@/components/Premium/PaywallModal';

export default function Settings() {
  const { language, theme, isPremium, setLanguage, setTheme, setPremium } = useHabitStore();
  const t = useTranslation(language);
  const availableLanguages = getAvailableLanguages();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const SettingsItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    color = '#3b82f6' 
  }: any) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.settingsContent}>
          <Text style={styles.settingsTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || <ChevronRight size={20} color="#64748b" />}
    </TouchableOpacity>
  );

  const handleLanguagePress = () => {
    Alert.alert(
      t.settings.language,
      'Select your preferred language',
      availableLanguages.map(lang => ({
        text: `${lang.flag} ${lang.name}`,
        onPress: () => setLanguage(lang.code),
        style: language === lang.code ? 'destructive' : 'default'
      }))
    );
  };

  const handleThemePress = () => {
    Alert.alert(
      t.settings.theme,
      'Choose your theme preference',
      [
        { text: 'Dark', onPress: () => setTheme('dark') },
        { text: 'Light', onPress: () => setTheme('light') },
        { text: 'Auto', onPress: () => setTheme('auto') },
      ]
    );
  };

  const handlePremiumPress = () => {
    if (isPremium) {
      Alert.alert('Premium Active', 'You already have Premium access!');
    } else {
      setPaywallVisible(true);
    }
  };

  const currentLanguage = availableLanguages.find(l => l.code === language);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.settings.title}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <SettingsItem
            icon={Globe}
            title={t.settings.language}
            subtitle={`${currentLanguage?.flag} ${currentLanguage?.name}`}
            onPress={handleLanguagePress}
            color="#10b981"
          />
          
          <SettingsItem
            icon={Palette}
            title={t.settings.theme}
            subtitle={theme.charAt(0).toUpperCase() + theme.slice(1)}
            onPress={handleThemePress}
            color="#8b5cf6"
          />
          
          <SettingsItem
            icon={Bell}
            title={t.settings.notifications}
            subtitle="Daily reminders"
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon!')}
            color="#f59e0b"
          />
        </View>

        <View style={styles.section}>
          <SettingsItem
            icon={Crown}
            title={t.settings.premium}
            subtitle={isPremium ? 'Active' : '$4.99/month'}
            onPress={handlePremiumPress}
            rightElement={
              isPremium ? (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>ACTIVE</Text>
                </View>
              ) : (
                <ChevronRight size={20} color="#64748b" />
              )
            }
            color="#fbbf24"
          />
        </View>

        <View style={styles.section}>
          <SettingsItem
            icon={Info}
            title={t.settings.about}
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About IQuit', 'IQuit helps you break bad habits and build a better life. Made with ❤️')}
            color="#06b6d4"
          />
          
          <SettingsItem
            icon={MessageCircle}
            title={t.settings.support}
            subtitle="Get help and feedback"
            onPress={() => Alert.alert('Support', 'Contact us at support@iquit.app')}
            color="#ec4899"
          />
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>IQuit v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 IQuit. All rights reserved.</Text>
        </View>

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
  section: {
    marginBottom: 24,
  },
  settingsItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
  },
  settingsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  premiumBadge: {
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  premiumText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  appCopyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});