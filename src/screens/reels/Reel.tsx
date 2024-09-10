import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  Dimensions,
  FlatListProps,
} from 'react-native';
import VideoPlayer from './components/VideoPlayer';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {Mixpanel} from 'mixpanel-react-native';
import { useSelector } from 'react-redux';

const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(
  'f03fcb4e7e5cdc7d32f57611937c5525',
  trackAutomaticEvents,
);
mixpanel.init();
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
// const bottomNavHeight = 65;

const Reel = () => {
  const [list, setList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mute, setMute] = useState(false);
  const flatListRef = useRef(null);
  const BottomTabHeight = useBottomTabBarHeight();
  const screenHeight = Dimensions.get('window').height - BottomTabHeight;
  const user = useSelector((state)=>state.user)
  useEffect(() => {
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
    getVideoList();
  }, []);

  const handleViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0 && viewableItems[0].isViewable) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  useEffect(() => {
    mixpanel.identify(user.userid); // Identifies the user by unique ID
    mixpanel.getPeople().set({
      $name: user.name,
      $email: user.email,
    });
    // mixpanel.setLoggingEnabled(true);
    mixpanel.track('Active User');
  }, []);

  const viewabilityConfig = useMemo(
    () => ({
      viewAreaCoveragePercentThreshold: 50,
      minimumViewTime: 300, // Adds a slight delay to avoid fast scrolls causing rapid changes
    }),
    [],
  );

  const renderItem = useCallback(
    ({item, index}) => (
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
    <View style={[styles.container]}>
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
        // onScroll={e => {
        //   const index = Math.round(
        //     e.nativeEvent.contentOffset.y / (screenHeight),
        //   );
        //   setCurrentIndex(index);
        // }}
      />
    </View>
  );
};

const MemoizedVideoPlayer = React.memo(VideoPlayer);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'black',
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
});

export default React.memo(Reel);
