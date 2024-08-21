import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  StatusBar,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Ionic from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
// import {likeVideo} from '../../../api/home';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Share from 'react-native-share';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const VideoPlayer = ({
  video,
  isVisible,
  index,
  currentIndex,
  mute,
  setMute,
}) => {
  const videoSrc = video.data.post_file;
  const [paused, setPaused] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState((video.data.likes || []).length);
  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const user = useSelector(state => state.user);
  const navigation = useNavigation();

  // Handle play/pause based on visibility and scrolling
  useEffect(() => {
    if (isVisible && currentIndex === index) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, [isVisible, currentIndex, index]);

  // Handle orientation changes
  // useEffect(() => {
  //   const handleOrientationChange = orientation => {
  //     if (orientation === 'LANDSCAPE') {
  //       setIsFullScreen(true);
  //     } else if (orientation === 'PORTRAIT') {
  //       setIsFullScreen(false);
  //     }
  //   };

  //   Orientation.addOrientationListener(handleOrientationChange);

  //   return () => {
  //     Orientation.removeOrientationListener(handleOrientationChange);
  //   };
  // }, []);

  useFocusEffect(
    useCallback(() => {
      if (currentIndex === index) {
        setPaused(false);
      } else {
        setPaused(true);
      }

      return () => {
        setPaused(true); // Pause the video when the screen loses focus
      };
    }, [currentIndex, index]),
  );

  const handlePlayPause = useCallback(() => {
    setPaused(prev => !prev);
  }, []);

  // const handleFullScreen = useCallback(() => {
  //   if (isFullScreen) {
  //     Orientation.lockToPortrait();
  //   } else {
  //     Orientation.lockToLandscape();
  //   }
  // }, [isFullScreen]);

  const onBuffer = useCallback(buffer => {
    setBuffering(buffer.isBuffering);
  }, []);

  const videoError = useCallback(error => {
    console.log('Video Error', error);
    setError(error); // Set error state
  }, []);

  const likeHandler = useCallback(async () => {
    if (like) {
      await removeLike(video?.id);
      setLikeCount(prevCount => prevCount - 1);
    } else {
      await AddLiked(video?.id);
      setLikeCount(prevCount => prevCount + 1);
    }
    console.log('Video like toggled:', video?.id);
  }, [like, video?.id]);

  const AddLiked = async videoid => {
    console.log(videoid);
    const response = await fetch(
      'https://adviserxiis-backend-three.vercel.app/post/addlike',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postid: videoid,
          userid: user.userid,
        }),
      },
    );
    const jsonresponse = await response.json();
    console.log('Hiws', jsonresponse);
    setLike(true);
  };

  const removeLike = async videoid => {
    const response = await fetch(
      'https://adviserxiis-backend-three.vercel.app/post/removelike',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postid: videoid,
          userid: user.userid,
        }),
      },
    );
    const jsonresponse = await response.json();
    console.log('Unlike response:', jsonresponse);
    // if (jsonresponse.success) {
    //   setLike(false);
    // }
    setLike(false);
  };

  const shareProfile = async () => {
    const shareOptions = {
      message: `Check out ${video?.adviser?.data?.username} new reels on this amazing Luink.ai!`,
      url: 'https://play.google.com/store/apps/details?id=com.advisiorapp', // Replace with your actual URL
    };

    try {
      const result = await Share.open(shareOptions);
      if (result) {
        console.log('Shared successfully:', result);
      }
    } catch (error) {
      if (error.message) {
        // Alert.alert('Error', error.message);
      } else if (error.dismissedAction) {
        console.log('Share dismissed');
      }
    }
  };

  // Only render the video component if it is visible and there is no error
  const renderVideo = useMemo(() => {
    // if (!isVisible || currentIndex !== index || !videoSrc) return null;

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePlayPause}
          style={styles.touchableArea}>
          <Video
            source={{uri: videoSrc}}
            ref={videoRef}
            style={isFullScreen ? styles.fullScreenVideo : styles.video}
            controls={false}
            paused={paused}
            resizeMode="cover"
            onBuffer={onBuffer}
            onError={videoError}
            fullscreen={isFullScreen}
            minBufferMs={15000}
            maxBufferMs={50000}
            bufferForPlaybackMs={5000}
            bufferForPlaybackAfterRebufferMs={5000}
            muted={mute} // Use the passed mute prop
            repeat={true}
            bitrate={1500000}
            onLoadStart={() => setBuffering(true)}
            onLoad={() => setBuffering(false)}
          />
          {buffering && !error && (
            <ActivityIndicator
              size="large"
              color="#FFFFFF"
              style={styles.loadingIndicator}
            />
          )}
          {!buffering && error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load video</Text>
            </View>
          )}

          {paused && !buffering && !error && (
            <Icon3
              name="controller-play"
              size={50}
              color="white"
              style={styles.centeredIcon}
              onPress={handlePlayPause}
            />
          )}
        </TouchableOpacity>
      </>
    );
  }, [
    isVisible,
    currentIndex,
    index,
    videoSrc,
    paused,
    buffering,
    mute,
    videoError,
    error,
  ]);

  return (
    <View style={isFullScreen ? styles.fullScreenContainer : styles.container}>
      <StatusBar hidden={isFullScreen} />

      {renderVideo}

      {!isFullScreen && !error && (
        <>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image
                source={require('../../../assets/images/Luink.png')}
                resizeMode="contain"
                style={styles.headerImage}
              />
              <Text style={styles.headerText}>
                Luink<Text style={styles.headerTextHighlight}>.ai</Text>
              </Text>
            </View>
            <View style={styles.viewCount}>
              <Feather name="eye" size={18} color="white" />
              <Text style={styles.viewCountText}>
                {video?.adviser?.views?.length || 0}
              </Text>
            </View>
          </View>
          <View style={styles.overlay}>
            <View style={styles.userInfo}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ViewProfile', video?.adviser?.id)
                }>
                <Image
                  source={{uri: `${video?.adviser?.data?.profile_photo}`}}
                  style={styles.profilePic}
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ViewProfile', video?.adviser?.id)
                  }>
                  <Text style={styles.userName}>
                    {video?.adviser?.data?.username}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.description}>
                  {video?.data?.description}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionic
                name={mute ? 'volume-mute' : 'volume-high'}
                size={24}
                color="#FFFFFF"
                style={{
                  marginBottom: 5,
                }}
                onPress={() => setMute(prev => !prev)} // Use the passed setMute function
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                likeHandler();
                // AddLiked(video?.id);
              }}
              style={styles.actionButton}>
              <Icon
                name={like ? 'heart' : 'hearto'}
                size={24}
                color={like ? '#FA4445' : '#FFFFFF'}
              />
              <Text style={styles.actionText}>{likeCount}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.actionButton}>
              <Feather name="message-circle" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>190</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={shareProfile}>
              <Icon3 name="share" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>0</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.actionButton}>
              <Feather name="bookmark" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>743</Text>
            </TouchableOpacity> */}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight - 71,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    position: 'relative',
  },
  fullScreenContainer: {
    flex: 1,
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    top: 0,
    left: 0,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fullScreenVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  touchableArea: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  muteIcon: {
    fontSize: 20,
    color: 'white',
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(52,52,52,0.6)',
    borderRadius: 100,
    padding: 10,
  },
  loadingIndicator: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
  centeredIcon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
  errorContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{translateX: -50}, {translateY: -25}],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerImage: {
    width: 30,
    height: 30,
  },
  headerText: {
    color: '#FFF',
    fontSize: 16,
  },
  headerTextHighlight: {
    color: '#407BFF',
  },
  viewCount: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#3184FE',
    alignItems: 'center',
    gap: 5,
  },
  viewCountText: {
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profilePic: {
    width: 52,
    height: 52,
    borderRadius: 50,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    lineHeight: 21,
  },
  description: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    width: '70%',
    opacity: 0.7,
    lineHeight: 18,
  },
  actions: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    gap: 15,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default React.memo(VideoPlayer);
