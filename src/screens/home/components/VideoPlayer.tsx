import React, {useState, useRef} from 'react';
import {
  View,
  StatusBar,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  Pressable,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {likeVideo} from '../../../api/home';
const {width: screenWidth} = Dimensions.get('window');
const aspectRatio = 9 / 16;

const VideoPlayer = ({video}: String) => {
  // console.log('===', videoSrc);
  console.log('--', video.postId);
  const videoSrc = video.post.post_file;
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

  const likeHandler = (id: any) => {
    likeVideo(id);
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

          bottom: 30,
          left: 20,
        }}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1598601065215-751bf8798a2c?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8fDB8fHww',
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
        <Text
          style={{
            color: '#FFF',
            marginVertical: 10,
          }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          right: 0,
          justifyContent: 'space-between',
          height: 200,
          alignItems: 'center',
        }}>
        <Pressable onPress={() => likeHandler(video.postId)}>
          <Icon name="like2" size={30} color="#FFFFFF" />
        </Pressable>
        <Icon1 name="share" size={30} color="#FFFFFF" />
        <Icon2 name="reviews" size={30} color="#FFFFFF" />
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
