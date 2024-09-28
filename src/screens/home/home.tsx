import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Feather';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-virtualized-view';
import Icon3 from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import {BlurView} from '@react-native-community/blur';
import PostItems from './components/PostItems';
import EventCard from './components/EventCard';

const Home = () => {
  const navigation = useNavigation();
  const [inputHeight, setInputHeight] = useState(40);
  const [selectedImage, setSelectedImage] = useState(null); // To store selected image
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [duration, setDuration] = useState(0);
  const [posts, setPosts] = useState([]); // Store posts, including images or videos
  const [postText, setPostText] = useState('');
  const user = useSelector(state => state.user);
  const [visiblePostIndex, setVisiblePostIndex] = useState(null);
  const viewabilityConfig = {itemVisiblePercentThreshold: 50}; // Configure visibility threshold
  const [refreshing, setRefreshing] = useState(false);
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setVisiblePostIndex(viewableItems[0].index); // Set index of visible post
    }
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  const toggleFAB = () => {
    if (isExpanded) {
      // Collapse animation
      Animated.parallel([
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsExpanded(false);
      });
    } else {
      // Expand animation
      setIsExpanded(true);
      Animated.parallel([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const slidePostOption = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0], // Moves vertically (slide in/out)
  });

  const slideReelsOption = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // Moves vertically (slide in/out)
  });

  const rotateIcon = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'], // Rotate the plus icon into an X
  });

  useEffect(() => {
    const getProfilePhoto = async () => {
      try {
        // Fetch profile photo from AsyncStorage
        const userptp = await AsyncStorage.getItem('user');
        const profileData = JSON.parse(userptp);
        // console.log("async store for photo", profileData?.profile_photo);
        if (profileData) {
          setProfilePhoto(profileData?.profile_photo); // Update the state with the fetched photo
        }
      } catch (error) {
        console.log('Error retrieving profile photo:', error);
      }
    };

    getProfilePhoto();

    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.headerLeftContainer}>
          <Image
            source={require('../../assets/images/Luink.png')}
            resizeMode="contain"
            style={styles.logoImage}
          />
          <Text style={styles.headerText}>
            Luink<Text style={styles.headerTextHighlight}>.ai</Text>
          </Text>
        </View>
      ),
      headerRight: () => (
        <Image
          source={
            profilePhoto
              ? {uri: profilePhoto}
              : require('../../assets/images/profiles.png')
          }
          resizeMode="contain"
          style={{
            height: 40,
            width: 40,
            marginRight: 16,
            borderRadius: 30,
          }}
        />
      ),
    });
  }, [navigation, profilePhoto]);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri); // Store image URI
        console.log(response.assets[0].uri);
      }
    });
  };

  const openVideoPicker = () => {
    const options = {
      mediaType: 'video',
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        setSelectedVideo(response.assets[0].uri);
        setDuration(response.assets[0].duration);
        console.log('Duration', response.assets[0].duration);
        // Store video URI
      }
    });
  };

  const handleRemoveImage = () => {
    setSelectedImage(null); // Clear selected image
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null); // Clear selected video
  };

  const [Aloading,setALoading] = useState(true);

  const notifyAllUsers = async () => {
    const storedProfileData = await AsyncStorage.getItem('user');
    const profileData = JSON.parse(storedProfileData);
    console.log('Profile Data', profileData.name);
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/notification/sendnotificationtoall', // Replace with your backend endpoint
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Check new post',
            body: `${profileData.name} Uploaded a new post!`,
          }),
        },
      );

      const jsonresponse = await response.json();
      console.log('Notificed', jsonresponse);

      if (!response.ok) {
        throw new Error('Failed to notify users.');
      }
    } catch (error: any) {
      console.log('Notification Error:', error.message || error);
      Alert.alert('Notification Error', 'Failed to notify users.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#white" />;
  }

  const getPost = async () => {
    console.log('Hi');
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/post/getallposts',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const jsonResponse = await response.json();
      // console.log('Post Details', jsonResponse.length);
      setPosts(jsonResponse);
    } catch (error) {
      console.log('Hie');
      console.error('Error fetching video list:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getPost();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getPost();
    setRefreshing(false);
  };

  const [contestdetail, setContestDetail] = useState(null);

  useEffect(() => {
    contestdetial();
  }, []);

  const contestdetial = async () => {
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/contest/getongoingcontest',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const jsonresponse = await response.json();
      const contestid = jsonresponse?.contestId;

      if (contestid) {
        await AsyncStorage.setItem('Contest_detail', contestid); // Awaiting the setItem call
        console.log('Contest ID set in AsyncStorage:', contestid);
      }

      setContestDetail(jsonresponse);
      console.log('Event Contest:', jsonresponse);
    } catch (error) {
      console.error('Error fetching or setting contest details:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#17191A" />
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      {/* {loading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    )} */}
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <Image
            source={
              profilePhoto
                ? {uri: profilePhoto}
                : require('../../assets/images/profilei.png')
            }
            resizeMode="contain"
            style={styles.profileImage}
          />
          <View style={styles.textInputContainer}>
            {/* <TextInput
              placeholder="Type Something? "
              placeholderTextColor="#838383"
              multiline={true}
              value={postText}
              onChangeText={setPostText}
              style={[
                styles.textInput,
                {height: inputHeight}, // Ensure minimum height
              ]}
              onContentSizeChange={
                event => setInputHeight(event.nativeEvent.contentSize.height) // Update the height based on content
              }
            /> */}
      {/* {selectedImage && (
              <View style={styles.mediaContainer}>
                <Image
                  source={{uri: selectedImage}}
                  style={styles.mediaPreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleRemoveImage}>
                  <Icon name="close-circle-outline" color="#333333" size={24} />
                </TouchableOpacity>
              </View>
            )} */}
      {/* {selectedVideo && (
              <View style={styles.videoContainer}>
                <Video
                  source={{uri: selectedVideo}}
                  style={styles.videoPreview}
                  controls={false}
                  repeat
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleRemoveVideo}>
                  <Icon name="close-circle-outline" color="white" size={24} />
                </TouchableOpacity>
              </View>
            )} *
            <View style={styles.actionContainer}>
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.iconButton}
                  // onPress={openImagePicker}
                  >
                  <Icon name="image-outline" color="white" size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  // onPress={openVideoPicker}
                  >
                  <Icon name="videocam-outline" color="white" size={18} />
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.iconButton}>
                  <Icon name="happy-outline" color="white" size={18} />
                </TouchableOpacity> *
              </View>

              <TouchableOpacity style={styles.postButton} onPress={()=>navigation.navigate('PostScreen')}>
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: '#333333',
          }}
        />
      </KeyboardAvoidingView> */}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 10,
          zIndex: 999,
          justifyContent: 'flex-end',
          alignContent: 'flex-end',
        }}>
        {isExpanded && (
          <Animated.View
            style={{
              transform: [{translateY: slidePostOption}],
              opacity: animationValue,
              marginBottom: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsExpanded(false);
                navigation.navigate('PostScreen');
              }}
              style={{
                padding: 10,
                backgroundColor: '#388DEB',
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}>
              <Icon1 name="image" size={20} color="white" />
              <Text style={{color: 'white', marginLeft: 10}}>Post</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        {isExpanded && (
          <Animated.View
            style={{
              transform: [{translateY: slideReelsOption}],
              opacity: animationValue,
              marginBottom: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsExpanded(false);
                navigation.navigate('CreatePost');
              }}
              style={{
                padding: 10,
                backgroundColor: '#388DEB',
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}>
              <Icon1 name="video" size={20} color="white" />
              <Text style={{color: 'white', marginLeft: 10}}>Reels</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <TouchableOpacity
          onPress={toggleFAB}
          style={{
            backgroundColor: '#388DEB',
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            height: 60,
            width: 60,
            marginLeft: 34,
          }}>
          <Animated.View style={{transform: [{rotate: rotateIcon}]}}>
            <Icon1 name="plus" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* <EventCard/> */}

      {/* Reels Option */}
      <FlatList
        data={posts}
        // ListHeaderComponent={contestdetail ? <EventCard /> : null}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <PostItems
            post={item}
            isVisible={visiblePostIndex === index}
            getpost={getPost}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
        refreshing={refreshing} // Add refreshing prop
        onRefresh={onRefresh}
        // ListFooterComponent={refreshing ? <ActivityIndicator size="small" color="#0000ff" /> : null}
      />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject, // Make the loading container fill the screen
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent background
    zIndex: 999,
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  logoImage: {
    width: 30,
    height: 30,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 4,
  },
  headerTextHighlight: {
    color: '#407BFF', // You can change this to any color you prefer
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Ensures the image stays at the top
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 30,
  },
  textInputContainer: {
    flex: 1, // Allows the TextInput to grow without affecting the image
    marginLeft: 10,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  closeModalText: {
    color: 'white',
  },
  textInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'white',
    width: Dimensions.get('window').width - 90,
    // borderBottomColor:'#333333',
    // borderBottomWidth: 1,
    paddingLeft: 15,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 10,
  },
  iconRow: {
    flexDirection: 'row',
  },
  iconButton: {
    marginRight: 15,
  },
  postButton: {
    backgroundColor: '#388DEB',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  postButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  mediaContainer: {
    position: 'relative',
    marginTop: 5,
  },
  mediaPreview: {
    width: '90%',
    height: 200,
    borderRadius: 20,
    marginLeft: 10,
    marginTop: 10,
  },
  videoContainer: {
    position: 'relative',
    marginTop: 5,
  },
  videoPreview: {
    width: '90%',
    height: 200,
    borderRadius: 20,
    marginTop: 5,
    marginLeft: 10,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 25,
    zIndex: 1000,
  },
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  postMediaImage: {
    width: '100%', // Full width of the container
    height: 250, // Adjust height as needed
    borderRadius: 15, // Rounded corners for a modern look
    marginTop: 10, // Space between the image and the text/content
  },
  postMediaVideo: {
    width: '100%', // Full width for the video
    height: 250, // Adjust the height depending on the media type
    borderRadius: 15, // Same styling as the image
    backgroundColor: '#000', // Background color for the video element
    marginTop: 10, // Space between video and text/content
  },
  overlayControls: {
    position: 'absolute',
    top: '60%',
    left: '45%',
    zIndex: 10,
  },
  name: {
    color: '#fff',
    lineHeight: 20,
    fontFamily: 'Poppins-Medium',
  },
  role: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  message: {
    color: '#fff',
    marginVertical: 10,
    fontFamily: 'Poppins-Regular',
  },
  interaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    marginLeft: 5,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalContent: {
    height: 400,
    backgroundColor: '#17191A', // Semi-transparent background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: 'auto', // Align at the bottom like Instagram
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
    height: 40,
    color: 'white',
  },
  sendButton: {
    marginLeft: 15,
  },
  modalHeader: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 15,
    color: 'white',
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  commentProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontFamily: 'Poppins-Medium',
    color: 'white',
  },
  commentText: {
    fontFamily: 'Poppins-Regular',
    color: '#838383',
  },
});
