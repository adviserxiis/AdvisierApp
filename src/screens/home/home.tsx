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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setVisiblePostIndex(viewableItems[0].index); // Set index of visible post
    }
  });
  const [loading, setLoading] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);

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
              : require('../../assets/images/profilei.png')
          }
          resizeMode="contain"
          style={{
            height: 45,
            width: 45,
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

  const handlePost = async () => {
    setLoading(true); // Start loading

    let mediaType = null;
    let mediaUri = null;

    if (selectedImage) {
      mediaType = 'image';
      mediaUri = selectedImage;
    } else if (selectedVideo) {
      mediaType = 'video';
      mediaUri = selectedVideo;
    }

    try {
      if (!selectedImage && !selectedVideo) {
        const response = await fetch(
          'https://adviserxiis-backend-three.vercel.app/post/createtextpost',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              adviserid: user.userid,
              message: postText,
            }),
          },
        );

        const jsonResponse = await response.json();
        console.log('Post Data', jsonResponse);
      } else if (selectedImage && !selectedVideo) {
        const formData = new FormData();
        formData.append('image', {
          uri:
            Platform.OS === 'android'
              ? `file://${selectedImage}`
              : selectedImage,
          name: 'image.jpg',
          type: 'image/jpeg',
        });
        formData.append('adviserid', user.userid);
        if (postText) {
          formData.append('description', postText);
        }

        const response = await fetch(
          'https://adviserxiis-backend-three.vercel.app/post/createimagepost',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          },
        );

        if (!response.ok) {
          const textResponse = await response.text(); // Get the raw HTML/error message
          console.log('Error Response:', textResponse);
          throw new Error('Failed to upload image post.');
        }

        const jsonResponse = await response.json();
        console.log('Post with image', jsonResponse);
      } else if (!selectedImage && selectedVideo) {
        const fileUri = selectedVideo;
        const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);

        const uploadToBunny = async () => {
          const apiKey = 'de112415-60af-446e-b3f795dec87a-222e-4dfb'; // Replace with your Bunny.net API key
          const storageZoneName = 'luink-ai'; // Replace with your storage zone name
          const storageUrl = `https://storage.bunnycdn.com/${storageZoneName}/${fileName}`;
          const accessUrl = `https://myluinkai.b-cdn.net/${fileName}`;

          const response = await fetch(storageUrl, {
            method: 'PUT', // Bunny.net requires PUT for uploads
            headers: {
              AccessKey: apiKey,
              'Content-Type': 'application/octet-stream',
            },
            body: await fetch(fileUri).then(res => res.blob()),
          });

          if (response.ok) {
            const videoURL = accessUrl;
            console.log('Video URL', videoURL);

            const postResponse = await fetch(
              'https://adviserxiis-backend-three.vercel.app/post/createvideopost',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  adviserid: user.userid,
                  videoURL: videoURL,
                  duration: duration,
                  description: postText,
                }),
              },
            );

            const jsonResponse = await postResponse.json();
            console.log('Video post response', jsonResponse);
          } else {
            throw new Error('Failed to upload video to Bunny.net.');
          }
        };

        await uploadToBunny();
      }
      // if (postResponse.ok) {
      //   // Alert.alert('Success', 'Your post has been saved.');
      //   // await new Promise(resolve => setTimeout(resolve, 1000));
      //   // await updateProgress();
      //   // await notifyAllUsers();
      //   // setVideo(null);
      //   // setDescription('');
      //   // setLocation('');
      //   // mixpanel.identify(user.userid); // Identifies the user by unique ID
      //   // mixpanel.getPeople().set({
      //   //   $name: name,
      //   // });
      //   // mixpanel.setLoggingEnabled(true);
      //   // mixpanel.track('Post Creation');
      //   // Alert.alert('Success', 'Post saved successfully!');

      //   // navigation.goBack();
      //   // Optionally, reset the form after saving
      // } else {
      //   throw new Error(
      //     jsonResponse.error || 'Failed to save post. Please try again.',
      //   );
      // }

      await notifyAllUsers();
      setSelectedImage(null); // Clear selected image
      setSelectedVideo(null); // Clear selected video
      setPostText(''); // Clear post text
    } catch (error: any) {
      console.log('Error:', error.message || error);
      Alert.alert(
        'Error',
        'There was an error saving your post. Please try again.',
      );
    } finally {
      setLoading(false); // End loading
    }
  };

  useFocusEffect(
    useCallback(() => {
      const getPost = async () => {
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
          console.error('Error fetching video list:', error);
        }
      };

      getPost();

      return () => {
        // any cleanup can go here
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      {loading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    )}
      <KeyboardAvoidingView
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
            <TextInput
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
            />
            {selectedImage && (
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
            )}
            {selectedVideo && (
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
            )}
            <View style={styles.actionContainer}>
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={openImagePicker}>
                  <Icon name="image-outline" color="white" size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={openVideoPicker}>
                  <Icon name="videocam-outline" color="white" size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Icon name="happy-outline" color="white" size={18} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.postButton} onPress={handlePost}>
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
      </KeyboardAvoidingView>
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <PostItems post={item} isVisible={visiblePostIndex === index} />
        )}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
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
    alignItems: 'center',    // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent background
    zIndex:999,
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
    height: 50,
    width: 50,
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
