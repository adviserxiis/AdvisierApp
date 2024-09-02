import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Function to format duration in minutes and seconds
const formatDuration = (durationSec) => {
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;
  if (minutes === 0) {
    return `${seconds} Sec`;
  } else {
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds} Mins`;
  }
};

const Card = ({ followers, duration }) => {
  const Follower = 100;
  const initialDuration = 3600; // Total duration in seconds
  const remainingDuration = Math.max(0, initialDuration - duration); // Remaining duration
  const remainingFollowers = Math.max(0, Follower - followers); // Remaining followers

  return (
    <LinearGradient
      colors={['#D4A5FF', '#F9ECA6']} // Match the gradient colors
      start={{ x: 0, y: 0 }} // Gradient start point
      end={{ x: 1, y: 1 }} // Gradient end point
      style={styles.button}
    >
      <Text style={styles.mainText}>
        {remainingFollowers} Followers & {formatDuration(remainingDuration)} Content
      </Text>
      <Text style={styles.subText}>left to start earning</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20, // Rounded corners
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  mainText: {
    fontSize: 16,
    color: '#000000', // Text color
    fontFamily: 'InriaSerif-Bold',
    marginBottom: 5,
    width:'100%',
    textAlign:'center',
  },
  subText: {
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.2,
    opacity:0.5,
    color: '#000000', // Text color
    fontFamily: 'InriaSans-Regular',
    width:'100%',
    textAlign:'center',
  },
});

export default Card;
