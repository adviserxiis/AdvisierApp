import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Video from 'react-native-video';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Ionic from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';
// import { Ionicons, FontAwesome } from '@expo/vector-icons'; // Use react-native-vector-icons if not using Expo

const SingleReel = () => {
  const route = useRoute();
  const {video, creator} = route.params;
  console.log('sjd', video);
  const user=useSelector(state=>state.user);
  console.log('jshb', creator);
  const [likeCount, setLikeCount] = useState((video.data.likes || []).length);
  const [like, setLike] = useState(video?.data?.likes?.includes(user.userid));
  const [paused, setPaused] = useState(false);
  const [mute,setMute]=useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError]= useState('');
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
    }, [])
  );

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

  const removeLike = async (videoid) => {
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
    console.log("share post id ",jsonresponse)

    const shareOptions = {
      message: `Check out ${creator?.username}new reels on this amazing Luink.ai!`,
      url: 'https://play.google.com/store/apps/details?id=com.advisiorapp', // Replace with your actual URL
    };

    try {
      const result = await Share.open(shareOptions);

      if (result) {
        console.log('Shared successfully:', result);
      }
    } catch (error:any) {
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


  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePlayPause}>
        <Video
          source={{ uri: video?.data?.post_file }}
          style={styles.video}
          resizeMode="cover"
          controls={false}
          muted={mute}
          repeat={true}
          paused={paused} // Pauses the video when required
          onBuffer={onBuffer} // Handle buffering
          onError={videoError}
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
          <Text style={styles.viewCountText}>
            {video?.data?.views?.length || 0}
          </Text>
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
                creator?.profile_photo
                  ? {uri: creator?.profile_photo}
                  : require('../../../assets/images/bane.png')
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
              <Text style={styles.userName}>
                {creator?.username}
              </Text>
            </TouchableOpacity>
            <Text style={styles.description}>{video?.data?.description}</Text>
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
    </View>
  );
};

export default SingleReel;

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
    right:10,
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
    backgroundColor:'white'
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
    top: '50%',
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
