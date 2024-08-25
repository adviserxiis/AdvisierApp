import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, StatusBar, StyleSheet, FlatList, Dimensions } from 'react-native';
import VideoPlayer from './components/VideoPlayer';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const bottomNavHeight = 64; 

const Home = () => {
  const [list, setList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mute, setMute] = useState(false);
  const flatListRef = useRef(null);

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
          }
        );
        const jsonResponse = await response.json();
        setList(jsonResponse);
      } catch (error) {
        console.error('Error fetching video list:', error);
      }
    };
    getVideoList();
  }, []);

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useMemo(
    () => ({
      viewAreaCoveragePercentThreshold: 50,
      minimumViewTime: 300, // Adds a slight delay to avoid fast scrolls causing rapid changes
    }),
    []
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
    [currentIndex, mute]
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
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews
        pagingEnabled
      />
    </View>
  );
};

const MemoizedVideoPlayer = React.memo(VideoPlayer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: screenWidth,
    height: screenHeight - bottomNavHeight,
    position:'absolute',
    top:0,
    bottom:0,
    left:0,
    right:0,
  },
});

export default React.memo(Home);
