import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

const { width } = Dimensions.get('window');

type NetworkBannerProps = {
  onBannerVisible?: (visible: boolean) => void; // Callback to notify banner visibility
};

const NetworkBanner: React.FC<NetworkBannerProps> = ({ onBannerVisible }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);
  const slideAnim = new Animated.Value(-50); // Initial position off-screen

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected ?? true;
      setIsConnected(connected);
      handleBanner(connected);
    });

    return () => unsubscribe();
  }, []);

  const handleBanner = (connected: boolean) => {
    if (onBannerVisible) {
      onBannerVisible(!connected); // Notify parent component about visibility
    }

    if (!connected) {
      setIsBannerVisible(true); // Ensure height is added only when visible
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -50, // Slide out
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsBannerVisible(false)); // Hide after animation completes
    }
  };

  return (
    <Animated.View
      style={[
        styles.banner,
        { transform: [{ translateY: slideAnim }], height: isBannerVisible ? 50 : 0 },
      ]}>
      {!isConnected && <Text style={styles.bannerText}>No Internet Connection</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    width: width,
    backgroundColor: '#FF4C4C',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
    paddingHorizontal:10,
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NetworkBanner;
