import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WellnessInfoScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Why Wellness Matters</Text>
        <Text style={styles.subtitle}>Understanding Office Syndrome</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is Office Syndrome?</Text>
        <Text style={styles.text}>
          Office syndrome refers to a group of symptoms caused by prolonged sitting and poor posture
          while working at a desk. It affects millions of office workers worldwide and can lead to
          chronic pain and reduced quality of life.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Symptoms</Text>
        <View style={styles.symptomCard}>
          <Text style={styles.symptomEmoji}>🔴</Text>
          <View style={styles.symptomText}>
            <Text style={styles.symptomTitle}>Neck Pain</Text>
            <Text style={styles.text}>
              From looking down at screens and poor neck posture
            </Text>
          </View>
        </View>

        <View style={styles.symptomCard}>
          <Text style={styles.symptomEmoji}>🔴</Text>
          <View style={styles.symptomText}>
            <Text style={styles.symptomTitle}>Back Pain</Text>
            <Text style={styles.text}>
              From slouching and lack of lumbar support
            </Text>
          </View>
        </View>

        <View style={styles.symptomCard}>
          <Text style={styles.symptomEmoji}>🔴</Text>
          <View style={styles.symptomText}>
            <Text style={styles.symptomTitle}>Shoulder Tension</Text>
            <Text style={styles.text}>
              From hunched shoulders and mouse usage
            </Text>
          </View>
        </View>

        <View style={styles.symptomCard}>
          <Text style={styles.symptomEmoji}>🔴</Text>
          <View style={styles.symptomText}>
            <Text style={styles.symptomTitle}>Eye Strain</Text>
            <Text style={styles.text}>
              From prolonged screen time without breaks
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Science Behind Stretching</Text>
        <Text style={styles.text}>
          Regular stretching breaks can significantly reduce the risk of developing office syndrome:
        </Text>

        <View style={styles.benefitCard}>
          <Text style={styles.benefitNumber}>30%</Text>
          <Text style={styles.benefitText}>
            Reduction in neck and shoulder pain with regular stretching
          </Text>
        </View>

        <View style={styles.benefitCard}>
          <Text style={styles.benefitNumber}>25%</Text>
          <Text style={styles.benefitText}>
            Increase in productivity when taking regular breaks
          </Text>
        </View>

        <View style={styles.benefitCard}>
          <Text style={styles.benefitNumber}>40%</Text>
          <Text style={styles.benefitText}>
            Improvement in posture awareness after 4 weeks
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best Practices</Text>
        <View style={styles.practiceItem}>
          <Text style={styles.practiceNumber}>1</Text>
          <Text style={styles.practiceText}>
            Take a 5-minute stretch break every 30-60 minutes
          </Text>
        </View>

        <View style={styles.practiceItem}>
          <Text style={styles.practiceNumber}>2</Text>
          <Text style={styles.practiceText}>
            Maintain proper posture: feet flat, back supported, screen at eye level
          </Text>
        </View>

        <View style={styles.practiceItem}>
          <Text style={styles.practiceNumber}>3</Text>
          <Text style={styles.practiceText}>
            Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds
          </Text>
        </View>

        <View style={styles.practiceItem}>
          <Text style={styles.practiceNumber}>4</Text>
          <Text style={styles.practiceText}>
            Stay hydrated and maintain good nutrition throughout the day
          </Text>
        </View>

        <View style={styles.practiceItem}>
          <Text style={styles.practiceNumber}>5</Text>
          <Text style={styles.practiceText}>
            Consider a standing desk or walking meetings when possible
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Remember: Small, consistent actions lead to big improvements in your health and wellbeing.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  symptomCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff3f3',
    borderRadius: 10,
  },
  symptomEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  symptomText: {
    flex: 1,
  },
  symptomTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  benefitCard: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  benefitNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  practiceNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    backgroundColor: '#e3f2fd',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    textAlign: 'center',
    lineHeight: 35,
    marginRight: 15,
  },
  practiceText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    paddingTop: 5,
  },
  footer: {
    backgroundColor: '#e8f5e9',
    margin: 15,
    padding: 25,
    borderRadius: 15,
    marginBottom: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});
