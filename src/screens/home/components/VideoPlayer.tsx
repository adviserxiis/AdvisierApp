import React, {useState, useRef} from 'react';
import {View, StatusBar, Dimensions, StyleSheet} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
const {width: screenWidth} = Dimensions.get('window');
const aspectRatio = 9 / 16;

const actions = [
  {
    text: 'Accessibility',
    icon: '',
    name: 'bt_accessibility',
    position: 2,
  },
  {
    text: 'Language',
    icon: '',
    name: 'bt_language',
    position: 1,
  },
  {
    text: 'Location',
    icon: '',
    name: 'bt_room',
    position: 3,
  },
  {
    text: 'Video',
    icon: '',
    name: 'bt_videocam',
    position: 4,
  },
];
const VideoPlayer = ({videoSrc}: String) => {
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
        source={{
          uri: videoSrc,
        }}
        ref={videoRef}
        style={isFullScreen ? styles.fullScreenVideo : styles.video}
        controls={false}
        paused={true}
        resizeMode="cover"
        onBuffer={onBuffer}
        onError={videoError}
        fullscreen={isFullScreen}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          justifyContent: 'space-between',
          height: 100,
        }}>
        <Icon name="like2" size={30} color="#FFFFFF" />

        <Icon1 name="share" size={30} color="#FFFFFF" />
      </View>

      {/* <FloatingAction
        actions={actions}
        onPressItem={name => {
          console.log(`selected button: ${name}`);
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    marginVertical: 10,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: screenWidth,
    // height: Dimensions.get('window').height * aspectRatio,
    height: Dimensions.get('window').height,
  },
  fullScreenVideo: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default VideoPlayer;
