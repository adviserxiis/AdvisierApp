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
  AppState,
  Animated,
  GestureResponderEvent,
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
import {SafeAreaView} from 'react-native-safe-area-context';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import CommentModal from './CommentModal';
import LinearGradient from 'react-native-linear-gradient';
import {TapGestureHandler} from 'react-native-gesture-handler';
import convertToProxyURL from 'react-native-video-cache';

const {width: screenWidth, height:screenHeight} = Dimensions.get('window');

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
  const [likeCount, setLikeCount] = useState((video.data.likes || []).length);
  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [videoQuality, setVideoQuality] = useState('high');
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [videoDuration, setVideoDuration] = useState(0);
  // const videoPlayerRef = useRef(null);
  const [progressBarWidth, setProgressBarWidth] = useState(screenWidth);
  const user = useSelector(state => state.user);
  const [like, setLike] = useState(video?.data?.likes?.includes(user.userid));
  const navigation = useNavigation();
  const BottomTabHeight = useBottomTabBarHeight();
  const screenHeight = Dimensions.get('window').height - BottomTabHeight;
  const screenwidth = Dimensions.get('window').width;
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isFollowing, setIsFollowing] = useState(video?.adviser?.data?.followers?.includes(user.userid));

  const commentModalRef = useRef(null); // No TypeScript type annotation in JS

  const handlePresentCommentModal = () => {
    commentModalRef.current?.present(); // Present the modal
  };
  const getResizeMode = () => (aspectRatio > 1 ? 'contain' : 'cover');

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'background') { 
        setVideoQuality('low'); // Reduce quality
      } else {
        setVideoQuality('high'); // Restore quality
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription?.remove(); // Clean up the subscription
    };
  }, []);

  // Handle play/pause based on visibility and scrolling
  useEffect(() => {
    if (isVisible && currentIndex === index) {
      setPaused(false);
      ViewsCount();
    } else {
      setPaused(true);
    }
  }, [isVisible, currentIndex, index]);

  

  // console.log(video?.adviser?.data);

  const followUser = async () => {
    const userObjectString = await AsyncStorage.getItem('user');
    let userObject = null;
    console.log('Adviser ID:', video?.data?.adviserid);
    console.log('Adviser ID:', video?.adviser?.data);

    if (userObjectString) {
      userObject = JSON.parse(userObjectString); // Parse the JSON string to an object
      console.log('User', userObject.name);
    }
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/followcreator',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adviserid: video?.data?.adviserid,
            followerid: user.userid,
          }),
        },
      );
      const jsonresponse = await response.json();
      console.log('Follow response', jsonresponse);

      if (response.ok) {
        console.log('higg');
        setIsFollowing(true);
        const NotificationResponse = await fetch(
          'https://adviserxiis-backend-three.vercel.app/notification/sendnotification',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              deviceToken: video?.adviser?.data?.device_token,
              title: 'Following Update',
              body: `${userObject?.name} started following you!!`,
            }),
          },
        );
        const jsonresponse = await NotificationResponse.json();
        console.log('Follow response', jsonresponse);
      } else {
        console.error('Failed to follow:', response.statusText);
      }
    } catch (error) {
      console.error('Error in follow request:', error);
    }
  };

  const unfollowUser = async () => {
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/unfollowcreator',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adviserid: video?.data?.adviserid,
            followerid: user.userid,
          }),
        },
      );
      const jsonresponse = await response.json();
      console.log('UnFollow response', jsonresponse);

      if (response.ok) {
        console.log('higga');
        setIsFollowing(false);
      } else {
        console.error('Failed to unfollow:', response.statusText);
      }
    } catch (error) {
      console.error('Error in unfollow request:', error);
    }
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser();
    } else {
      followUser();
    }
  };

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

  const [commentCount, setCommentCount] = useState(0);
  useFocusEffect(
    useCallback(() => {
      // Update the comment count when the screen is focused
      const updatedCommentCount = (video.data.comments || 0 || []).length || 0;
      setCommentCount(updatedCommentCount);
    }, [video]),
  );

  const handleProgress = useCallback(
    data => {
      if (data.currentTime && data.seekableDuration) {
        const progressValue = data.currentTime / data.seekableDuration;

        Animated.timing(progress, {
          toValue: progressValue,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }
    },
    [progress],
  );

  const handleTouch = (event: GestureResponderEvent) => {
    if (!videoRef.current || progressBarWidth === 0 || videoDuration === 0) {
      return; // Prevent errors if values aren't ready
    }
  
    const touchX = event.nativeEvent.locationX; // Position of the tap
    const newPosition = (touchX / progressBarWidth) * videoDuration; // Calculate time
  
    videoRef.current.seek(newPosition); // Seek video to the new position
  };

  const onLayout = useCallback(event => {
    const {width} = event.nativeEvent.layout;
    setProgressBarWidth(width);
  }, []);

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
    }
    console.log('Video like toggled:', video?.id);
  }, [like, video?.id]);

  const AddLiked = async videoid => {
    console.log(videoid);
    const userObjectString = await AsyncStorage.getItem('user');
    let userObject = null;

    if (userObjectString) {
      userObject = JSON.parse(userObjectString); // Parse the JSON string to an object
      console.log('User', userObject.name);
    } else {
      console.error('No user found in AsyncStorage');
      return;
    }

    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/post/addlike',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postid: videoid,
            userid: user.userid, // Access userid from userObject
          }),
        },
      );
      console.log('device token', video);
      const jsonResponse = await response.json();
      console.log('Add like response:', jsonResponse);

      if (response.status === 200) {
        setLike(true);
        setLikeCount(prevCount => prevCount + 1);
        // onDoubleTap();
        console.log('Hiesdddhdjasdjabjcjd');

        const NotificationResponse = await fetch(
          'https://adviserxiis-backend-three.vercel.app/notification/sendnotification',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              deviceToken: video?.adviser?.data?.device_token,
              title: 'Reel Like Update',
              body: `${userObject.name} liked Your Reel`,
            }),
          },
        );

        const notificationJsonResponse = await NotificationResponse.json();
        console.log('Notification response:', notificationJsonResponse);
      } else {
        console.error('Failed to add like:', response.statusText);
      }
    } catch (error) {
      console.error('Error in AddLiked request:', error);
    }
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

  const sharePost = async () => {
    const response = await fetch(
      'https://adviserxiis-backend-three.vercel.app/post/sharepost',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postid: video?.id,
        }),
      },
    );
    const jsonresponse = await response.json();
    console.log('share post id ', jsonresponse);

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

  const ViewsCount = useCallback(async () => {
    const response = await fetch(
      'https://adviserxiis-backend-three.vercel.app/post/addviews',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postid: video?.id,
          userid: user.userid,
        }),
      },
    );
    const jsonresponse = await response.json();
    // console.log('View Update Response', jsonresponse);
  }, [video?.id, user.userid]);

  const onLoad = data => {
    const ratio = data.naturalSize.width / data.naturalSize.height;
    setAspectRatio(ratio); // Set the aspect ratio state
    setBuffering(false);
    setVideoDuration(data.duration);
    // Calculate aspect ratio: width / height
  };

  const [doubleTap, setDoubleTap] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const onDoubleTap = async videoid => {
    console.log('Bodo');
    console.log(videoid);
    // setLike(true);
    setDoubleTap(true);
    await AddLiked(videoid);
    // setLikeCount(prevCount => prevCount + 1);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => setDoubleTap(false));

    // setTimeout(() => {
    //   setDoubleTap(false);
    // }, 10000);
  };

  // Only render the video component if it is visible and there is no error
  const renderVideo = useMemo(() => {
    if (!isVisible || currentIndex !== index) return null;

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePlayPause}
          style={styles.touchableArea}>
          <Video
            source={{uri: videoSrc}}
            
            ref={videoRef}
            style={[styles.video, {height: screenHeight}]}
            controls={false}
            paused={paused}
            resizeMode={getResizeMode()}
            onBuffer={onBuffer}
            onError={videoError}
            fullscreen={isFullScreen}
            minBufferMs={15000}
            maxBufferMs={50000}
            bufferForPlaybackMs={5000}
            bufferForPlaybackAfterRebufferMs={5000}
            muted={mute} // Use the passed mute prop
            repeat={true}
            autoplay
            preload="auto"
            playInBackground={false}  // Ensure the video doesn't play in the background
            playWhenInactive={false} 
            bitrate={videoQuality === 'high' ? 1500000 : 500000}
            onLoadStart={() => setBuffering(true)}
            onLoad={onLoad}
            onProgress={handleProgress}
          />

          <TapGestureHandler
            onActivated={() => onDoubleTap(video?.id)}
            numberOfTaps={2}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: BottomTabHeight,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {doubleTap && (
                <Animated.View
                  style={[
                    styles.likeAnimation,
                    {transform: [{scale: scaleAnim}]},
                  ]}>
                  <Icon name="heart" size={120} color="white" />
                </Animated.View>
              )}
            </View>
          </TapGestureHandler>
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
          <TouchableOpacity
            style={styles.progressBarContainer}
            onLayout={onLayout}
            onTouchEnd={handleTouch}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </TouchableOpacity>
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
    progress,
    handleTouch,
  ]);

  const [isExpanded, setIsExpanded] = useState(false);
 
  return (
    <SafeAreaView
      style={isFullScreen ? styles.fullScreenContainer : styles.container}>
      <StatusBar hidden={isFullScreen} />
      <CommentModal ref={commentModalRef} video={video}  />
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
                {video?.data?.views?.length || 0}
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
                  // source={{uri: `${video?.adviser?.data?.profile_photo}`}}
                  source={
                    video?.adviser?.data?.profile_photo
                      ? {uri: video?.adviser?.data?.profile_photo}
                      : require('../../../assets/images/profiles.png')
                  }
                  style={styles.profilePic}
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column', width: '73%'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ViewProfile', video?.adviser?.id)
                    }>
                    <Text style={styles.userName}>
                      {video?.adviser?.data?.username}
                    </Text>
                    {/* <Text>
                    {video?.data?.file_type === 'contest_video' ? (
                      <TouchableOpacity
                        style={{
                          overflow: 'hidden',
                          borderRadius: 20,
                        }}>
                        <LinearGradient
                          colors={['#AC2BFF', '#6532FFFF']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1}}
                          style={{
                            paddingVertical: 3,
                            paddingHorizontal: 10,
                            borderRadius: 20, // Smooth corners
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{
                            color: 'white',
                            fontSize: 10,
                            fontFamily: 'Poppins-Medium', 
                          }}>In Challenge</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      ''
                    )}
                  </Text> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      {
                        backgroundColor: isFollowing
                          ? 'transparent'
                          : '#388DEB',
                        borderColor: isFollowing ? '' : 'transparent',
                        borderWidth: isFollowing ? 0 : 0,
                      },
                    ]}
                    onPress={handleFollowToggle}>
                    <Text
                      style={[
                        styles.editProfileText,
                        {
                          color: isFollowing ? '' : 'white',
                        },
                      ]}>
                      {isFollowing ? '' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setIsExpanded(!isExpanded)}
              style={{
                marginTop: 10,
              }}>
              <Text
                style={styles.description}
                numberOfLines={isExpanded ? undefined : 1}>
                {video?.data?.description}
              </Text>
            </TouchableOpacity>
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
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handlePresentCommentModal}>
                <Ionic name="chatbubble-outline" size={24} color="white" />
                <Text style={styles.actionText}>{commentCount} </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={sharePost}>
                <Icon3 name="share" size={24} color="#FFFFFF" />
                {/* <Text style={styles.actionText}>0</Text> */}
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.actionButton}>
                <Feather name="bookmark" size={24} color="#FFFFFF" />
                <Text style={styles.actionText}>743</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    position: 'relative',
    flex: 1,
    // backgroundColor: 'black',
  },
  fullScreenContainer: {
    flex: 1,
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  video: {
    width: screenWidth,
    height: screenHeight,
    // position: 'absolute',
    // aspectRatio:9/16,
    // top:0,
    // left:0,
    // right:0,
    alignSelf: 'center',
  },
  fullScreenVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  touchableArea: {
    width: screenWidth,
    height: screenHeight,
    flex: 1,
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
  likeAnimation: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    left: '51%',
    top: '46%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
  centeredIcon: {
    position: 'absolute',
    left: '51%',
    top: '46%',
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
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followButton: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 75,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1000,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
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
    bottom: 105,
    left: 16,
    right: 10,
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
    backgroundColor: 'white',
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
    width: '90%',
    opacity: 0.7,
    lineHeight: 18,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
