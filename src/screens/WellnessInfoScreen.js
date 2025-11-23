import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { askWellnessQuestion } from '../utils/chatService';

export default function WellnessInfoScreen() {
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi! I'm your wellness assistant. Ask me anything about office syndrome, posture, stretching, or workplace health!",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const response = await askWellnessQuestion(userMessage.text);

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      text: response.message,
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.aiText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
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

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setChatVisible(true)}
      >
        <Text style={styles.chatButtonText}>💬 Ask AI</Text>
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={chatVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChatVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatHeaderTitle}>Wellness Assistant</Text>
              <TouchableOpacity onPress={() => setChatVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
            />

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#2196F3" />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask about wellness..."
                multiline
                maxLength={200}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
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
  // Chat styles
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    backgroundColor: 'white',
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2196F3',
  },
  chatHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2196F3',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#333',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
