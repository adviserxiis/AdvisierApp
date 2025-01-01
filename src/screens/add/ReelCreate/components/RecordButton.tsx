import React, { useRef, useState } from 'react';
import { Animated, View, Pressable, StyleSheet, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const RecordButton = ({ onStartRecording = () => {}, onStopRecording = () => {}, maxDuration = 10000 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    // Reset progress animation
    progressAnim.setValue(0);

    // Scale down animation
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: maxDuration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        handlePressOut(); // Stop recording when max duration is reached
      }
    });
  };

  const stopAnimation = () => {
    // Scale up animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Stop progress animation
    progressAnim.stopAnimation();
  };

  const handlePressIn = () => {
    setIsRecording(true);
    startAnimation();
    onStartRecording();
  };

  const handlePressOut = () => {
    setIsRecording(false);
    stopAnimation();
    onStopRecording();
  };

  const rotateInterpolation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const [videoUri, setVideoUri] = useState(null);

  const pickVideo = () => {
    launchImageLibrary(
      {
        mediaType: 'video', // Only allow videos
        videoQuality: 'high',
        maxWidth: 1280,
        maxHeight: 720,
        durationLimit: maxDuration / 1000, // Convert max duration to seconds
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          const videoUri = response.assets[0].uri;
          setVideoUri(videoUri); // Store the URI of the selected video
          console.log('Video URI:', videoUri);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={pickVideo}>
        <Text style={styles.pickVideoText}>Pick Video</Text>
      </Pressable>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel="Record button"
        accessibilityHint="Press and hold to record"
        style={styles.pressable}
      >
        {/* Outer rotating progress arc */}
        <Animated.View
          style={[
            styles.progressArc,
            {
              transform: [{ rotate: rotateInterpolation }],
            },
          ]}
        />

        {/* Inner record button */}
        <Animated.View
          style={[
            styles.recordButton,
            {
              backgroundColor: isRecording ? 'red' : 'white',
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
      </Pressable>
      <View>
        <Text>shdh</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection:'row',
    flex:1,
    marginHorizontal:20,
    justifyContent: 'space-between',

  },
  pressable: {
    position: 'relative',
  },
  progressArc: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'transparent',  // Remove the solid red border color
    borderTopColor: 'red',      // Make the top border red
    borderRightColor: 'transparent', // Transparent on the sides
    borderBottomColor: 'transparent', 
    borderLeftColor: 'transparent',
    zIndex: 1, // Make sure the progress arc is behind the button
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    margin: 4,
    zIndex: 2, // Ensure the button is on top of the arc
  },
});

export default RecordButton;
