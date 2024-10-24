import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';

const Card2 = () => {
    return (
        <LinearGradient
          colors={['#D4A5FF', '#F9ECA6']} // Match the gradient colors
          start={{ x: 0, y: 0 }} // Gradient start point
          end={{ x: 1, y: 1 }} // Gradient end point
          style={styles.button}
        >
          {/* <Text style={styles.mainText}>
            {remainingFollowers} Followers & {formatDuration(remainingDuration)} Content
          </Text>
          <Text style={styles.subText}>left to start earning</Text> */}
        </LinearGradient>
      );
}

export default Card2

const styles = StyleSheet.create({
    button: {
        borderRadius: 20, // Rounded corners
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
      },
})