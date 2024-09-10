import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = () => {
  console.log("Started Loading"); // Logging statement outside JSX

  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    bottom: 70, // Adjust this value based on the height of your bottom tab bar
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
