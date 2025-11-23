import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [interval, setInterval] = useState(30);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Notification permissions are required for OfficeFresh to work!');
    }
  };

  const toggleReminders = async () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      await scheduleNotification(interval);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const scheduleNotification = async (minutes) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to Stretch!",
        body: "You've been sitting for a while. Let's do some stretches!",
        data: { screen: 'Stretch' },
      },
      trigger: {
        seconds: minutes * 60,
        repeats: true,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi there,</Text>
        <Text style={styles.title}>Ready to Refresh?</Text>
        <Text style={styles.subtitle}>Take care of your body with mindful stretches</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🔔</Text>
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Stretch Reminders</Text>
            <Text style={styles.cardSubtitle}>Every {interval} minutes</Text>
          </View>
          <Switch
            trackColor={{ false: colors.border, true: colors.secondaryLight }}
            thumbColor={isEnabled ? colors.secondary : colors.surface}
            onValueChange={toggleReminders}
            value={isEnabled}
          />
        </View>

        {isEnabled && (
          <View style={styles.activeIndicator}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active - Next reminder in {interval} min</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Stretch')}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Start Stretch Now</Text>
        <Text style={styles.buttonArrow}>→</Text>
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>How it works</Text>

        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Enable reminders</Text>
            <Text style={styles.stepText}>Get gentle nudges to take breaks</Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Follow the guide</Text>
            <Text style={styles.stepText}>AI watches and guides your form</Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Hold the position</Text>
            <Text style={styles.stepText}>Screen turns green when you're doing it right</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'] + 30,
    paddingBottom: spacing.xl,
  },
  greeting: {
    fontSize: typography.fontSizes.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSizes['4xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSizes.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  cardSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  activeText: {
    fontSize: typography.fontSizes.sm,
    color: colors.success,
    fontWeight: typography.fontWeights.medium,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  primaryButtonText: {
    color: colors.textWhite,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    marginRight: spacing.sm,
  },
  buttonArrow: {
    color: colors.textWhite,
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
  },
  infoSection: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  stepText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
