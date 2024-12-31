import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
  ViewToken,
} from 'react-native';
import VideoPlayer from './components/VideoPlayer';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Mixpanel } from 'mixpanel-react-native';
import { useSelector } from 'react-redux';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { debounce } from 'lodash';
import { useFocusEffect } from '@react-navigation/native';

const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(
  'f03fcb4e7e5cdc7d32f57611937c5525',
  trackAutomaticEvents,
);

mixpanel.init();

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-1658613370450501/1720983301'; // Replace with actual ad unit ID

interface Video {
  _id?: string;
  [key: string]: any;
}

const Reel: React.FC = () => {
  const [list, setList] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mute, setMute] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);
  const [ad, setAd] = useState<InterstitialAd | null>(null);

  const flatListRef = useRef<FlatList<Video>>(null);
  const BottomTabHeight = useBottomTabBarHeight();
  const user = useSelector((state: any) => state.user);

  const screenHeightAdjusted = Dimensions.get('window').height - BottomTabHeight;

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
      const jsonResponse: Video[] = await response.json();
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

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setAdLoaded(true);
      },
    );

    const unsubscribeFailed = interstitial.addAdEventListener(
      AdEventType.ERROR,
      error => {
        console.error('Ad failed to load:', error);
        setAdLoaded(false);
        interstitial.load();
      },
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setAdLoaded(false);
        setAd(null);
      },
    );

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
        ad.show();
      } else {
        console.log('No ad to show, showing fallback content instead.');
      }
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    return () => {
      clearInterval(timer);
    };
  }, [ad, adLoaded]);

  const onViewableItemsChanged = useRef(
    debounce(({viewableItems}: {viewableItems: Array<ViewToken>}) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }, 200),
  ).current;

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

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50, // When at least 50% of the item is visible
  }).current;

  const renderItem = useCallback(
    ({ item, index }: { item: Video; index: number }) => (
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

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
    }),
    [],
  );

  const memoizedList = useMemo(() => list, [list]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={memoizedList}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews
        pagingEnabled
        getItemLayout={getItemLayout}
        decelerationRate="fast"
        snapToInterval={screenHeight}
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
