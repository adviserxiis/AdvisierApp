import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import VideoPlayer from './components/VideoPlayer';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Mixpanel } from 'mixpanel-react-native';
import { useSelector } from 'react-redux';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(
  'f03fcb4e7e5cdc7d32f57611937c5525',
  trackAutomaticEvents,
);
mixpanel.init();
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-1658613370450501/1720983301'; // Replace with actual ad unit ID

const Reel = () => {
  const [list, setList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mute, setMute] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [ad, setAd] = useState(null);
  const flatListRef = useRef(null);
  const BottomTabHeight = useBottomTabBarHeight();
  const screenHeightAdjusted = Dimensions.get('window').height - BottomTabHeight;
  const user = useSelector((state) => state.user);

  const getVideoList = async () => {
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/post/getallpostswithadviserdetails',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const jsonResponse = await response.json();
      setList(jsonResponse);
    } catch (error) {
      console.error('Error fetching video list:', error);
    }
  };

  useEffect(() => {
    getVideoList();
  }, []);

  useEffect(() => {
    const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setAdLoaded(true);
    });

    const unsubscribeFailed = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Ad failed to load:', error);
      setAdLoaded(false);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setAdLoaded(false);
      setAd(null);
    });

    interstitial.load();
    setAd(interstitial);

    return () => {
      unsubscribeLoaded();
      unsubscribeFailed();
      unsubscribeClosed();
    };
  }, [adUnitId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (ad && adLoaded) {
        ad.show(); // Ensure this method exists or replace with correct method
      }
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    return () => {
      clearInterval(timer);
    };
  }, [ad, adLoaded]);

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].isViewable) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getVideoList();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    mixpanel.identify(user.userid);
    mixpanel.getPeople().set({
      $name: user.name,
      $email: user.email,
    });
    mixpanel.track('Active User');
  }, [user]);

  const viewabilityConfig = useMemo(
    () => ({
      viewAreaCoveragePercentThreshold: 50,
      minimumViewTime: 300,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <MemoizedVideoPlayer
        video={item}
        isVisible={currentIndex === index}
        index={index}
        currentIndex={currentIndex}
        mute={mute}
        setMute={setMute}
      />
    ),
    [currentIndex, mute],
  );

  const memoizedList = useMemo(() => list, [list]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        ref={flatListRef}
        data={memoizedList}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        pagingEnabled
        decelerationRate='fast'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const MemoizedVideoPlayer = React.memo(VideoPlayer);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
});

export default React.memo(Reel);
