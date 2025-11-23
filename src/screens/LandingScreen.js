import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Section with Logo/Icon */}
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/mascott.png')}
          style={styles.mascot}
          resizeMode="contain"
        />
        <Text style={styles.appName}>OfficeFresh</Text>
        <Text style={styles.tagline}>Combat office syndrome with guided stretches</Text>
      </View>

      {/* Middle Section with Benefits */}
      <View style={styles.benefitsSection}>
        <View style={styles.benefitItem}>
          <View style={styles.benefitIconCircle}>
            <MaterialCommunityIcons name="brain" size={32} color="#2196F3" />
          </View>
          <Text style={styles.benefitText}>AI-Powered Form Detection</Text>
        </View>

        <View style={styles.benefitItem}>
          <View style={styles.benefitIconCircle}>
            <Ionicons name="notifications" size={32} color="#2196F3" />
          </View>
          <Text style={styles.benefitText}>Smart Stretch Reminders</Text>
        </View>

        <View style={styles.benefitItem}>
          <View style={styles.benefitIconCircle}>
            <MaterialCommunityIcons name="arm-flex" size={32} color="#2196F3" />
          </View>
          <Text style={styles.benefitText}>Guided Exercise Sessions</Text>
        </View>
      </View>

      {/* Bottom Section with CTA */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.replace('MainApp')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>
          Join thousands taking care of their health
        </Text>
      </View>

      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    position: 'relative',
    overflow: 'hidden',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  mascot: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  benefitsSection: {
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitIcon: {
    fontSize: 28,
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 22,
  },
  bottomSection: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: '100%',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonArrow: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    bottom: 100,
    left: -40,
  },
});
