import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import Video from 'react-native-video';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Ionic from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons, FontAwesome } from '@expo/vector-icons'; // Use react-native-vector-icons if not using Expo

const ContestReelView = () => {
  const route = useRoute();
  const {video} = route.params;
  //   console.log('sjd', video);
  const user = useSelector(state => state.user);
  //   console.log('jshb', creator);
  const [likeCount, setLikeCount] = useState((video?.likes || []).length);
  const [like, setLike] = useState(video?.likes?.includes(user.userid));
  const [paused, setPaused] = useState(false);
  const [mute, setMute] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  // const tapRef = useRef(null);
  const progressBarWidth = useRef(new Animated.Value(0)).current;
  const videoPlayerRef = useRef(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const BottomTabHeight = useBottomTabBarHeight();
  const screenHeight = Dimensions.get('window').height - BottomTabHeight;

  const getResizeMode = () => (aspectRatio > 1 ? 'contain' : 'cover');

  const onLoad = data => {
    // Calculate aspect ratio: width / height
    const ratio = data.naturalSize.width / data.naturalSize.height;
    setAspectRatio(ratio); // Set the aspect ratio state
    setBuffering(false);
  };

  const onBuffer = useCallback(buffer => {
    setBuffering(buffer.isBuffering);
  }, []);

  const videoError = useCallback(error => {
    console.log('Video Error', error);
    setError(error); // Set error state
  }, []);

  useFocusEffect(
    useCallback(() => {
      // When the screen is focused, ensure the video plays and is unmuted
      setPaused(false);
      setMute(false);

      // When the screen loses focus, pause the video
      return () => {
        setPaused(true);
      };
    }, []),
  );

  const likeHandler = useCallback(async () => {
    if (like) {
      await removeLike(video?.postid);
      setLikeCount(prevCount => prevCount - 1);
    } else {
      await AddLiked(video?.postid);
      setLikeCount(prevCount => prevCount + 1);
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
            userid: user.userid,
          }),
        },
      );

      console.log('device token', video);
      const jsonResponse = await response.json();
      console.log('Add like response:', jsonResponse);

      if (response.status === 200) {
        setLike(true);
        console.log('Hiesdddhdjasdjabjcjd');

        const NotificationResponse = await fetch(
          'https://adviserxiis-backend-three.vercel.app/notification/sendnotification',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              deviceToken: video?.device_token,
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
          postid: video?.postid,
        }),
      },
    );
    const jsonresponse = await response.json();
    console.log('share post id ', jsonresponse);

    const shareOptions = {
      message: `Check out ${video?.name}new reels on this amazing Luink.ai!`,
      url: 'https://play.google.com/store/apps/details?id=com.advisiorapp', // Replace with your actual URL
    };

    try {
      const result = await Share.open(shareOptions);

      if (result) {
        console.log('Shared successfully:', result);
      }
    } catch (error: any) {
      if (error.message) {
        // Alert.alert('Error', error.message);
      } else if (error.dismissedAction) {
        console.log('Share dismissed');
      }
    }
  };

  // const ViewsCount = useCallback(async () => {
  //   const response = await fetch(
  //     'https://adviserxiis-backend-three.vercel.app/post/addviews',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         postid: video?.id,
  //         userid: user.userid,
  //       }),
  //     }
  //   );
  //   const jsonresponse = await response.json();
  //   // console.log('View Update Response', jsonresponse);
  // }, [video?.id, user.userid]);

  const handlePlayPause = useCallback(() => {
    setPaused(prev => !prev);
  }, []);

  const onProgress = useCallback(data => {
    if (data.currentTime) {
      setVideoCurrentTime(data.currentTime);
      setVideoDuration(data.seekableDuration);

      Animated.timing(progressBarWidth, {
        toValue:
          (data.currentTime / data.seekableDuration) *
          Dimensions.get('window').width,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, []);

  const handleTouch = event => {
    const touchX = event.nativeEvent.locationX;
    const progressBarWidthValue = Dimensions.get('window').width;
    const newPosition = (touchX / progressBarWidthValue) * videoDuration;

    // Seek to the new position
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seek(newPosition);
      setPaused(false);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const renderItem = () => {
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePlayPause}>
        <Video
          ref={videoPlayerRef}
          source={{uri: video?.data?.post_file}}
          style={[styles.video, {height: screenHeight}]}
          resizeMode={getResizeMode()}
          controls={false}
          muted={mute}
          repeat={true}
          paused={paused} // Pauses the video when required
          onBuffer={onBuffer} // Handle buffering
          onError={videoError}
          onProgress={onProgress}
          onLoad={onLoad}
        />
      </TouchableWithoutFeedback>
      {buffering && ( // Display loading indicator while buffering
        <ActivityIndicator
          style={styles.centeredIcon}
          size="large"
          color="#ffffff"
        />
      )}

      {paused && !buffering && (
        <Icon3
          name="controller-play"
          size={50}
          color="white"
          style={styles.centeredIcon}
          onPress={handlePlayPause}
        />
      )}

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
          <Text style={styles.viewCountText}>{video?.views?.length || 0}</Text>
        </View>
      </View>
      <View style={styles.overlay}>
        <View style={styles.userInfo}>
          <TouchableOpacity
          // onPress={() =>
          //   navigation.navigate('ViewProfile', video?.adviser?.id)
          // }
          >
            <Image
              // source={{uri: `${video?.adviser?.data?.profile_photo}`}}
              source={
                video?.profile_photo
                  ? {uri: video?.profile_photo}
                  : require('../../../assets/images/profiles.png')
              }
              style={styles.profilePic}
            />
          </TouchableOpacity>
          <View style={{flexDirection: 'column', width: '73%'}}>
            <TouchableOpacity
            // onPress={() =>
            //   navigation.navigate('ViewProfile', video?.adviser?.id)
            // }
            >
              <Text style={styles.userName}>{video?.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text
                style={styles.description}
                numberOfLines={isExpanded ? undefined : 1}>
                {video?.description}
              </Text>
            </TouchableOpacity>
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
      <TouchableOpacity
        style={styles.progressBarContainer}
        onPress={handleTouch}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressBarWidth,
            },
          ]}
        />
      </TouchableOpacity>
    </View>;
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePlayPause}>
        <Video
          ref={videoPlayerRef}
          source={{uri: video?.post_file}}
          style={[styles.video, {height: screenHeight}]}
          resizeMode={getResizeMode()}
          controls={false}
          muted={mute}
          repeat={true}
          paused={paused} // Pauses the video when required
          onBuffer={onBuffer} // Handle buffering
          onError={videoError}
          onProgress={onProgress}
          onLoad={onLoad}
        />
      </TouchableWithoutFeedback>
      {buffering && ( // Display loading indicator while buffering
        <ActivityIndicator
          style={styles.centeredIcon}
          size="large"
          color="#ffffff"
        />
      )}

      {paused && !buffering && (
        <Icon3
          name="controller-play"
          size={50}
          color="white"
          style={styles.centeredIcon}
          onPress={handlePlayPause}
        />
      )}

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
          <Text style={styles.viewCountText}>{video?.views?.length || 0}</Text>
        </View>
      </View>
      <View style={styles.overlay}>
        <View style={styles.userInfo}>
          <TouchableOpacity
          // onPress={() =>
          //   navigation.navigate('ViewProfile', video?.adviser?.id)
          // }
          >
            <Image
              // source={{uri: `${video?.adviser?.data?.profile_photo}`}}
              source={
                video?.profile_photo
                  ? {uri: video?.profile_photo}
                  : require('../../../assets/images/profiles.png')
              }
              style={styles.profilePic}
            />
          </TouchableOpacity>
          <View style={{flexDirection: 'column', width: '73%'}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
              // onPress={() =>
              //   navigation.navigate('ViewProfile', video?.adviser?.id)
              // }
            >
              <Text style={styles.userName}>{video?.name}</Text>
              <Text>
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
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 10,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      In Challenge
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text
                style={styles.description}
                numberOfLines={isExpanded ? undefined : 1}>
                {video?.description}
              </Text>
            </TouchableOpacity>
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
      <TouchableOpacity
        style={styles.progressBarContainer}
        onPress={handleTouch}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressBarWidth,
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ContestReelView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
  },
  progressBar: {
    height: 3,
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
  headerTextHighlight: {
    color: '#407BFF',
  },
  headerText: {
    color: '#FFF',
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
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
    width: '100%',
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
  centeredIcon: {
    position: 'absolute',
    left: '50%',
    top: '52%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
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
});
