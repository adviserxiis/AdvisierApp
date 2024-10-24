import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Function to format duration in minutes and seconds
const formatDuration = durationSec => {
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;
  if (minutes === 0) {
    return `${seconds} Sec`;
  } else {
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds} Mins`;
  }
};

const Card = ({followers, duration, service, earnings}) => {
  const Follower = 100;
  const initialDuration = 3600; // Total duration in seconds
  const remainingDuration = Math.max(0, initialDuration - duration); // Remaining duration
  const remainingFollowers = Math.max(0, Follower - followers); // Remaining followers

  return (
    <LinearGradient
      colors={['#D4A5FF', '#F9ECA6']} // Match the gradient colors
      start={{x: 0, y: 0}} // Gradient start point
      end={{x: 1, y: 1}} // Gradient end point
      style={styles.button}>
      {service ? (
        <>
          {/* Earnings Section */}
          <View style={styles.earningsContainer}>
            {/* Rupee Symbol */}
            <Text style={styles.rupeeSymbol}>₹</Text>

            {/* Earnings Text */}
            <View style={styles.earningsTextContainer}>
              <Text style={styles.earningsTitle}>Your Earnings</Text>
              <View style={styles.earningsRow}>
                <Text style={styles.earningsValue}>₹{earnings}</Text>
                <TouchableOpacity style={{
                  borderWidth:1,
                  borderColor: '#000',
                  alignItems:'center',
                  paddingHorizontal:16,
                  paddingVertical:4,
                  borderRadius:25,
                }}>
                  <Text style={styles.withdrawButton}>Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Remaining Followers and Content Section */}
          <View style={styles.contentContainer}>
            <Text style={styles.mainText}>
              {remainingFollowers} Followers &{' '}
              {formatDuration(remainingDuration)} Content
            </Text>
            <Text style={styles.subText}>left to start earning</Text>
          </View>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20, // Rounded corners
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginTop: 20,
    position: 'relative',
  },
  earningsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // Ensure it takes the full width
  },
  rupeeSymbol: {
    fontSize: 140,
    position: 'absolute',
    transform: [
      {translateX: 105}, // Move horizontally
      {translateY: 0}, // Move vertically
      {rotate: '-15deg'}, // Rotate by 15 degrees
      {scale: 1}, // Scale the text size
    ],
    fontFamily: 'InriaSerif-Bold',
    zIndex: 999,
    color: 'black',
    opacity: 0.1,
  },
  earningsTextContainer: {
    flex: 1, // Flex to take available space
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  earningsTitle: {
    fontSize: 14,
    fontFamily: 'InriaSerif-Regular',
    color: '#000',
    marginBottom: 7,
    letterSpacing: 0.2,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This should now work
    alignItems: 'center',
    width: '100%',
  },
  earningsValue: {
    fontSize: 25,
    fontFamily: 'InriaSerif-Bold',
    color: '#000',
    letterSpacing: 0.2,
  },
  withdrawButton: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'InriaSans-Regular',
    // marginLeft: 10,
  },
  contentContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  mainText: {
    fontSize: 17,
    color: '#000000',
    fontFamily: 'InriaSerif-Bold',
    marginBottom: 5,
    width: '100%',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.2,
    opacity: 0.5,
    color: '#000000',
    fontFamily: 'InriaSans-Regular',
    width: '100%',
    textAlign: 'center',
  },
});

export default Card;
