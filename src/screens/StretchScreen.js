import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { analyzePose } from '../utils/visionService';

const { width, height } = Dimensions.get('window');

export default function StretchScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [breathingPhase, setBreathingPhase] = useState(true);
  const [breathCountdown, setBreathCountdown] = useState(3);
  const [isInPosition, setIsInPosition] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [feedback, setFeedback] = useState('Position yourself for the stretch');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef(null);
  const analysisInterval = useRef(null);

  // Handle breathing countdown
  useEffect(() => {
    if (breathingPhase && breathCountdown > 0) {
      const timer = setTimeout(() => setBreathCountdown(breathCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (breathingPhase && breathCountdown === 0) {
      setBreathingPhase(false);
    }
  }, [breathingPhase, breathCountdown]);

  useEffect(() => {
    if (isInPosition && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isInPosition && countdown === 0) {
      setExerciseComplete(true);
      stopAnalysis();
    }
  }, [isInPosition, countdown]);

  useEffect(() => {
    if (permission?.granted && !exerciseComplete && !breathingPhase) {
      startAnalysis();
    }
    return () => stopAnalysis();
  }, [permission, exerciseComplete, breathingPhase]);

  const startAnalysis = () => {
    // Analyze every 3 seconds
    analysisInterval.current = setInterval(async () => {
      await captureAndAnalyze();
    }, 3000);
  };

  const stopAnalysis = () => {
    if (analysisInterval.current) {
      clearInterval(analysisInterval.current);
      analysisInterval.current = null;
    }
  };

  const captureAndAnalyze = async () => {
    if (!cameraRef.current || isAnalyzing || exerciseComplete) return;

    try {
      setIsAnalyzing(true);

      // Take a picture
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });

      // Analyze with Gemini
      const result = await analyzePose(photo.base64, 'Neck Stretch');

      setFeedback(result.feedback);

      if (result.isCorrect && !isInPosition) {
        // Just became correct
        setIsInPosition(true);
        setCountdown(5);
      } else if (!result.isCorrect && isInPosition) {
        // Lost correct position
        setIsInPosition(false);
        setCountdown(5);
      }
    } catch (error) {
      console.error('Error analyzing pose:', error);
      setFeedback('Error analyzing pose. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!permission) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera access is required for pose detection</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#666', marginTop: 10 }]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.cameraContainer, { borderColor: breathingPhase ? '#2196F3' : (isInPosition ? '#4CAF50' : '#f44336') }]}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
        />
        <View style={[styles.overlay, { backgroundColor: breathingPhase ? 'rgba(33, 150, 243, 0.4)' : (isInPosition ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)') }]}>
          {breathingPhase ? (
            <>
              <Text style={styles.breathingText}>Take a deep breath...</Text>
              <Text style={styles.breathingEmoji}>🧘</Text>
              <Text style={styles.breathCountdownText}>{breathCountdown}</Text>
              <Text style={styles.breathingSubtext}>Relax and prepare for your stretch</Text>
            </>
          ) : !exerciseComplete ? (
            <>
              <Text style={styles.statusText}>
                {isInPosition ? 'Perfect! Hold this position' : 'Adjust your position'}
              </Text>
              {isInPosition && (
                <Text style={styles.countdownText}>{countdown}</Text>
              )}
              {isAnalyzing && !isInPosition && (
                <ActivityIndicator size="large" color="white" style={styles.loader} />
              )}
            </>
          ) : (
            <Text style={styles.completeText}>Exercise Complete!</Text>
          )}
        </View>
      </View>

      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackLabel}>AI Feedback:</Text>
        <Text style={styles.feedbackText}>{feedback}</Text>
      </View>

      <View style={styles.instructionCard}>
        <Text style={styles.exerciseTitle}>Neck Stretch</Text>
        <Text style={styles.instruction}>1. Sit up straight</Text>
        <Text style={styles.instruction}>2. Slowly tilt your head to the right</Text>
        <Text style={styles.instruction}>3. Hold until the screen turns green</Text>
        <Text style={styles.aiNote}>AI is watching your form every 3 seconds</Text>
      </View>

      {exerciseComplete && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cameraContainer: {
    width: width - 40,
    height: height * 0.5,
    marginHorizontal: 20,
    marginTop: 60,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 5,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    paddingHorizontal: 20,
  },
  countdownText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  completeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  breathingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    paddingHorizontal: 20,
  },
  breathingEmoji: {
    fontSize: 64,
    marginVertical: 20,
  },
  breathCountdownText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  breathingSubtext: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    paddingHorizontal: 30,
  },
  loader: {
    marginTop: 20,
  },
  feedbackCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    padding: 15,
    margin: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
  },
  instructionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 15,
  },
  instruction: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  aiNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  doneButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginHorizontal: 20,
  },
});
