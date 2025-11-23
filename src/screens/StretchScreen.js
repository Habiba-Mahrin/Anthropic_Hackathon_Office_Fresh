import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function StretchScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isInPosition, setIsInPosition] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (isInPosition && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isInPosition && countdown === 0) {
      setExerciseComplete(true);
    }
  }, [isInPosition, countdown]);

  const simulatePositionDetection = () => {
    // This is a placeholder - in production, this would use pose detection
    setIsInPosition(!isInPosition);
    if (!isInPosition) {
      setCountdown(5);
      setExerciseComplete(false);
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
      <View style={[styles.cameraContainer, { borderColor: isInPosition ? '#4CAF50' : '#f44336' }]}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
        />
        <View style={[styles.overlay, { backgroundColor: isInPosition ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)' }]}>
          {!exerciseComplete ? (
            <>
              <Text style={styles.statusText}>
                {isInPosition ? 'Great! Hold this position' : 'Adjust your position'}
              </Text>
              {isInPosition && (
                <Text style={styles.countdownText}>{countdown}</Text>
              )}
            </>
          ) : (
            <Text style={styles.completeText}>Exercise Complete!</Text>
          )}
        </View>
      </View>

      <View style={styles.instructionCard}>
        <Text style={styles.exerciseTitle}>Neck Stretch</Text>
        <Text style={styles.instruction}>1. Sit up straight</Text>
        <Text style={styles.instruction}>2. Slowly tilt your head to the right</Text>
        <Text style={styles.instruction}>3. Hold until the screen turns green</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: isInPosition ? '#f44336' : '#4CAF50' }]}
          onPress={simulatePositionDetection}
        >
          <Text style={styles.buttonText}>
            {isInPosition ? 'Break Position' : 'Get in Position'}
          </Text>
        </TouchableOpacity>

        {exerciseComplete && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
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
  instructionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    marginTop: 30,
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
  buttonContainer: {
    padding: 20,
  },
  testButton: {
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  doneButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
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
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginHorizontal: 20,
  },
});
