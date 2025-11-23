import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function HomeScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [interval, setInterval] = useState(30); // minutes

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
      <Text style={styles.title}>OfficeFresh</Text>
      <Text style={styles.subtitle}>Combat office syndrome with guided stretches</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Stretch Reminders</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#2196F3' : '#f4f3f4'}
            onValueChange={toggleReminders}
            value={isEnabled}
          />
        </View>

        <Text style={styles.intervalText}>
          Reminder every {interval} minutes
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Stretch')}
      >
        <Text style={styles.buttonText}>Start Stretch Now</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>1. Enable reminders above</Text>
        <Text style={styles.infoText}>2. Get notified when it's time to stretch</Text>
        <Text style={styles.infoText}>3. Follow the video guide</Text>
        <Text style={styles.infoText}>4. Stay in position until the screen turns green</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 60,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  intervalText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
});
