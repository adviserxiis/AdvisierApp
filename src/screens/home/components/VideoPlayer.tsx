import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';

const VideoPlayer = () => {
  const [paused, setPaused] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  const handleFullScreen = () => {
    if (isFullScreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    setIsFullScreen(!isFullScreen);
  };

  const onBuffer = buffer => {
    console.log('Buffering', buffer);
  };

  const videoError = error => {
    console.log('Video Error', error);
  };

  return (
    <View style={isFullScreen ? styles.fullScreenContainer : styles.container}>
      <StatusBar hidden={isFullScreen} />
      <Video
        source={{uri: 'https://www.w3schools.com/html/mov_bbb.mp4'}}
        ref={videoRef}
        style={isFullScreen ? styles.fullScreenVideo : styles.video}
        controls={false}
        paused={paused}
        resizeMode="contain"
        onBuffer={onBuffer}
        onError={videoError}
        fullscreen={isFullScreen}
      />
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePlayPause}>
          <Icon name={paused ? 'play-arrow' : 'pause'} size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFullScreen}>
          <Icon
            name={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 300,
  },
  fullScreenVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default VideoPlayer;
