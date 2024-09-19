import {
  Alert,
  Animated,
  FlatList,
  Image,
  Platform,
  ProgressBarAndroid,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';

const PostScreen = () => {
  const [selectedPod, setSelectedPod] = useState('Images');
  const [selectedPod2, setSelectedPod2] = useState('');
  const [postText, setPostText] = useState('');
  const [imageList, setImageList] = useState([]); // Separate list for images
  const [videoList, setVideoList] = useState([]);
  const user = useSelector(state => state.user);
  const abortControllerRef = useRef(null);
  // const handleInsertLink = () => {
  //   const link = 'https://';
  //   setPostText(postText + `${link}`); // Append link to post text
  // };

  // const hasLink = (text) => {
  //   return text.includes('https://');
  // };
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [name, setName] = useState(null);
  const [hashtags, setHashTags] = useState('');

  const getProfilePhoto = async () => {
    try {
      // Fetch profile photo from AsyncStorage
      const userptp = await AsyncStorage.getItem('user');
      const profileData = JSON.parse(userptp);
      // console.log('async store for photo', profileData?.profile_photo);
      // console.log('async store for name', profileData?.name);
      if (profileData) {
        setProfilePhoto(profileData?.profile_photo); // Update the state with the fetched photo
        setName(profileData?.name); // Update the state with the fetched name
      }
    } catch (error) {
      console.log('Error retrieving profile photo:', error);
    }
  };

  useEffect(() => {
    getProfilePhoto();
  }, []);

  const handleSelectMedia = () => {
    // Set the mediaType based on the selectedPod
    const mediaType =
      selectedPod === 'Images'
        ? 'photo'
        : selectedPod === 'Videos'
        ? 'video'
        : 'mixed';

    const options = {
      mediaType: mediaType, // Allow either images or videos based on the selection
      selectionLimit: 0, // Set to 0 for multiple selections
    };

    launchImageLibrary(options, response => {
      if (response.assets) {
        const selectedImages = [];
        const selectedVideos = [];
        response.assets.forEach(asset => {
          if (asset.type.startsWith('image')) {
            selectedImages.push({
              uri: asset.uri,
              type: asset.type,
            });
          } else if (asset.type.startsWith('video')) {
            selectedVideos.push({
              uri: asset.uri,
              type: asset.type,
            });
          }
        });
        // Update the image or video list based on the selected media type
        if (selectedPod === 'Images') {
          setImageList([...imageList, ...selectedImages]);
        } else if (selectedPod === 'Videos') {
          setVideoList([...videoList, ...selectedVideos]);
        }
      }
    });
  };

  // const handleRemoveMedia = uri => {
  //   const updatedMediaList = mediaList.filter(item => item.uri !== uri);
  //   setMediaList(updatedMediaList);
  // };

  const [progress, setProgress] = useState(0);
  const [isPosting, setIsPosting] = useState(false);

  const getVideoDuration = async uri => {
    // Implement logic to get video duration here
    // This is just a placeholder
    return new Promise(resolve => {
      setTimeout(() => resolve(120), 1000); // Replace with actual duration fetching logic
    });
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
            title: 'New Post',
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

  const SubmitPost = async () => {
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController(); // Initialize AbortController
    }

    if(!hashtags){
      Alert.alert('Error','Hashtags are mandatory');
      return;
    }

    setIsPosting(true); // Start loading
    setProgress(0);

    // Function to update progress
    const updateProgress = () => {
      return new Promise(resolve => {
        let currentProgress = 0;

        const interval = setInterval(() => {
          currentProgress += 0.2; // Increase progress (adjust speed as needed)
          setProgress(prevProgress => Math.min(prevProgress + 0.2, 1)); // Ensure progress does not exceed 100%

          if (currentProgress >= 1) {
            clearInterval(interval);
            resolve(); // Resolve promise when progress reaches 100%
          }
        }, 500); // Adjust the speed of progress
      });
    };

    if (!postText && imageList.length === 0 && videoList.length === 0) {
      Alert.alert('Error', 'Please enter a post text or select media.');
      setIsPosting(false);
      return;
    }

    try {
      await updateProgress();
      let response;

      if (imageList.length > 0) {
        // Prepare FormData for images
        const formData = new FormData();
        imageList.forEach((image, index) => {
          formData.append('images', {
            uri: Platform.OS === 'android' ? `file://${image.uri}` : image.uri,
            name: `image${index}.jpg`,
            type: 'image/jpeg',
          });
        });
        formData.append('adviserid', user.userid);
        formData.append('luitags',hashtags);
        if (postText) formData.append('description', postText);

        response = await fetch(
          'https://adviserxiis-backend-three.vercel.app/post/createimagepost',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
            signal: abortControllerRef.current?.signal,
          },
        );
      } else if (videoList.length > 0) {
        const uploadVideoToBunny = async video => {
          const fileUri = video.uri;
          const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
          const apiKey = 'de112415-60af-446e-b3f795dec87a-222e-4dfb'; // Replace with your Bunny.net API key
          const storageZoneName = 'luink-ai'; // Replace with your storage zone name
          const storageUrl = `https://storage.bunnycdn.com/${storageZoneName}/${fileName}`;
          const accessUrl = `https://myluinkai.b-cdn.net/${fileName}`;

          const response = await fetch(storageUrl, {
            method: 'PUT',
            headers: {
              AccessKey: apiKey,
              'Content-Type': 'application/octet-stream',
            },
            body: await fetch(fileUri).then(res => res.blob()),
            signal: abortControllerRef.current?.signal,
          });

          if (!response.ok) {
            throw new Error('Failed to upload video to Bunny.net.');
          }

          return accessUrl;
        };

        // Handle multiple video uploads
        const videoURLs = [];
        const durations = []; // Assuming you have a way to get video durations

        for (let video of videoList) {
          const videoURL = await uploadVideoToBunny(video);
          videoURLs.push(videoURL);

          // Get video duration if applicable
          const duration = await getVideoDuration(video.uri);
          durations.push(duration);
        }

        // Send video data to the backend
        response = await fetch(
          'https://adviserxiis-backend-three.vercel.app/post/createvideopost',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              adviserid: user.userid,
              videoURLs: videoURLs,
              durations: durations,
              description: postText,
              luitags: hashtags,
            }),
            signal: abortControllerRef.current?.signal,
          },
        );
      } else {
        response = await fetch(
          'https://adviserxiis-backend-three.vercel.app/post/createtextpost',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              adviserid: user.userid,
              message: postText,
              luitags: hashtags,
            }),
            signal: abortControllerRef.current?.signal,
          },
        );
      }

      if (!response.ok) {
        const textResponse = await response.text(); // Get the raw HTML/error message
        console.log('Error Response:', textResponse);
        throw new Error('Failed to save post. Please try again.');
      }

      const jsonResponse = await response.json();
      console.log('Post response:', jsonResponse);

      if (response.ok) {
        // Clear selected images, videos, and text
        console.log('His');
        await notifyAllUsers();
        setImageList([]);
        setVideoList([]);
        setPostText('');
        setHashTags('');

        // Notify users (if necessary)
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Upload cancelled');
      } else {
        console.log('Error:', error.message || error);
        Alert.alert(
          'Error',
          'There was an error saving your post. Please try again.',
        );
      }
    } finally {
      setIsPosting(false); // End loading
    }
  };

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const openPicker = () => {
    setShow(!show);
  };
  const openPicker1 = () => {
    setShow1(!show1);
  };

  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const caretRotation = useRef(new Animated.Value(0)).current;
  const caretRotation1 = useRef(new Animated.Value(0)).current;

  const togglePicker = () => {
    setShow(!show);
    Animated.timing(dropdownHeight, {
      toValue: show ? 0 : 150, // Adjust the value based on your layout
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(caretRotation, {
      toValue: show ? 0 : 180, // Rotate between 0 and 180 degrees
      duration: 300,
      useNativeDriver: true, // Enable native driver for smoother animations
    }).start();
  };
  const togglePicker1 = () => {
    setShow1(!show1);
    Animated.timing(dropdownHeight, {
      toValue: show1 ? 0 : 150, // Adjust the value based on your layout
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(caretRotation1, {
      toValue: show1 ? 0 : 180, // Rotate between 0 and 180 degrees
      duration: 300,
      useNativeDriver: true, // Enable native driver for smoother animations
    }).start();
  };

  const caretRotationStyle = {
    transform: [
      {
        rotate: caretRotation.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'], // Interpolates rotation between 0 and 180 degrees
        }),
      },
    ],
  };
  const caretRotationStyle1 = {
    transform: [
      {
        rotate: caretRotation1.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'], // Interpolates rotation between 0 and 180 degrees
        }),
      },
    ],
  };

  const hidePicker = item => {
    setSelectedPod(item);
    setShow(false);
    Animated.timing(dropdownHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(caretRotation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const hidePicker1 = item => {
    setSelectedPod2(item);
    setShow1(false);
    Animated.timing(dropdownHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(caretRotation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const [options] = useState(['Images', 'Videos']);
  const [categories] = useState([
    'New',
    'Central Pod',
    'AI Takeover',
    'Dev',
    'Idea Validation',
    'Rant',
    'Cofounder Search',
    'Finance',
  ]);

  const handleRemoveMedia = (uri, mediaType) => {
    if (mediaType === 'image') {
      const updatedImageList = imageList.filter(item => item.uri !== uri);
      setImageList(updatedImageList);
    } else if (mediaType === 'video') {
      const updatedVideoList = videoList.filter(item => item.uri !== uri);
      setVideoList(updatedVideoList);
    }
  };

  const renderVideoItem = ({item}) => (
    <View style={styles.videoContainer}>
      <Video
        source={{uri: item.uri}}
        style={styles.videoPreview}
        controls={false}
        repeat
        muted
        resizeMode="contain"
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => handleRemoveMedia(item.uri, 'video')}>
        <Icon name="delete" color="white" size={18} />
      </TouchableOpacity>
    </View>
  );

  const renderImageItem = ({item}) => (
    <View style={styles.mediaContainer}>
      <Image
        source={{uri: item.uri}}
        style={styles.mediaPreview}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => handleRemoveMedia(item.uri, 'image')}>
        <Icon name="delete" color="white" size={18} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isPosting && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
          <View
            style={{
              padding: 15,
              backgroundColor: '#17191A',
              borderRadius: 10,
              flexDirection: 'colunm',
              alignItems: 'flex-start',
              width: '90%',
              gap: 10,
            }}>
            {/* <Video
              source={{uri: video.uri}} // Use your video URI here
              paused={true}
              muted
              resizeMode="cover"
              style={{
                height: 40,
                width: 40,
              }}
            /> */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: 'white',
              }}>
              Uploading your post
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
              }}>
              {/* <Image
                source={{uri: }}
                resizeMode="cover"
                style={{
                  width: 40,
                  height: 40,
                }}
              /> */}
              <Text
                style={{
                  color: 'white',
                }}>
                {postText}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, {width: `${progress * 100}%`}]}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                {`${(progress * 100).toFixed(0)}%`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort(); // Cancel the upload
                    setIsPosting(false); // End loading state
                  }
                }}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <View style={styles.contentContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={styles.profileContainer}>
            {/* <Image
            source={require('../../../assets/images/profilei.png')}
            resizeMode="contain"
            style={styles.profileImage}
          /> */}
            <Image
              source={
                profilePhoto
                  ? {uri: profilePhoto}
                  : require('../../../assets/images/profilei.png')
              }
              resizeMode="contain"
              style={styles.profileImage}
            />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>{name}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={togglePicker}
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderColor: '#333',
              borderWidth: 2,
              width: '40%',
              height: 30,
              padding: 4,
              justifyContent: 'space-between',
              borderRadius: 10,
              alignContent: 'center',
            }}>
            {/* <Icon3 name="grid-outline" size={18} color="purple" /> */}
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                color: 'white',
                paddingLeft: 10,
              }}>
              {selectedPod ? selectedPod : 'Images'}
            </Text>
            <TouchableOpacity
              onPress={openPicker}
              style={{
                marginTop: 3,
                marginRight: 5,
              }}>
              <Animated.View style={caretRotationStyle}>
                <Icon name="caretdown" size={10} color="white" />
              </Animated.View>
            </TouchableOpacity>
          </TouchableOpacity>
          {/* </View> */}
        </View>
        {show && (
          <Animated.View
            style={{
              height: 100,
              overflow: 'hidden',
              position: 'absolute', // Make the dropdown float
              top: 65, // Adjust this to place the dropdown correctly
              right: 16, // Match with your layout, adjust if necessary
              width: '40%', // Ensure dropdown has the correct width
              backgroundColor: '#333', // Add a background color if necessary
              zIndex: 100, // Ensures it's on top of other elements
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#333',
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => hidePicker(option)}>
                  <Text
                    style={{
                      fontSize: 14,
                      padding: 5,
                      marginVertical: 5,
                      fontFamily: 'Poppins-Regular',
                      color: 'white',
                    }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
        {/* Profile Section */}
        {/* <View
          style={{
            flexDirection: 'row',
            gap: 10,
          }}>
          <TouchableOpacity
            onPress={togglePicker1}
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderColor: '#333',
              borderWidth: 2,
              width: '50%',
              padding: 10,
              justifyContent: 'space-between',
              borderRadius: 10,
              alignContent: 'center',
            }}>
            <Icon3 name="grid-outline" size={18} color="purple" />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                color:'white'
              }}>
              {selectedPod2 ? selectedPod2 : 'Images'}
            </Text>
            <TouchableOpacity
              onPress={openPicker1}
              style={{
                marginTop: 5,
                marginRight: 5,
              }}>
              <Animated.View style={caretRotationStyle1}>
                <Icon name="caretdown" size={10} color="white" />
              </Animated.View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        {show && (
          <Animated.View
            style={{
              height: dropdownHeight,
              overflow: 'hidden',
              position: 'absolute', // Make the dropdown float
              top: 145, // Adjust this to place the dropdown correctly
              left: 16, // Match with your layout, adjust if necessary
              width: '50%', // Ensure dropdown has the correct width
              backgroundColor: '#333', // Add a background color if necessary
              zIndex: 100, // Ensures it's on top of other elements
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#333',
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {categories.map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => hidePicker(option)}>
                  <Text
                    style={{
                      fontSize: 14,
                      padding: 5,
                      marginVertical: 5,
                      fontFamily: 'Poppins-Regular',
                      color: 'white',
                    }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
        {show1 && (
          <Animated.View
            style={{
              height: dropdownHeight,
              overflow: 'hidden',
              position: 'absolute', 
              right:6,
              top: 145, // Adjust this to place the dropdown correctly
              width: '50%', // Ensure dropdown has the correct width
              backgroundColor: '#333', // Add a background color if necessary
              zIndex: 100, // Ensures it's on top of other elements
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#333',
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => hidePicker1(option)}>
                  <Text
                    style={{
                      fontSize: 14,
                      padding: 5,
                      marginVertical: 5,
                      fontFamily: 'Poppins-Regular',
                      color: 'white',
                    }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )} */}

        {/* Post Text Input */}
        <TextInput
          style={[
            styles.textInput,
            // hasLink(postText) ? { color: 'blue' } : { color: 'black' },
          ]}
          placeholder="Enter your post here"
          placeholderTextColor="#888"
          multiline
          maxLength={1000}
          value={postText}
          onChangeText={setPostText}
        />

        {imageList.length > 0 && (
          <FlatList
          data={imageList}
          keyExtractor={item => item.uri}
          renderItem={renderImageItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaList}
          />
        )}

        {videoList.length > 0 && (
          <FlatList
          data={videoList}
          keyExtractor={item => item.uri}
          renderItem={renderVideoItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaList}
          />
        )}
        <Text style={styles.charCount}>{postText.length}/1000</Text>
      </View>
        <TextInput
          value={hashtags}
          onChangeText={setHashTags}
          placeholder="Add #luitags (#hashtags)"
          placeholderTextColor="#838383"
          style={{
            height: 49,
            paddingHorizontal:16,
            width: '100%',
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
            color: 'white',
            fontFamily: 'Poppins-Regular',
          }}
        />

      {/* Footer Icons and Post Button */}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          {/* <TouchableOpacity
          // onPress={handleInsertLink}
          >
            <Icon5
              name="link-box-variant-outline"
              size={24}
              color="#388DEB"
              style={styles.icon}
            />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={handleSelectMedia}>
            <Icon3
              name="image-outline"
              color="#388DEB"
              size={24}
              style={styles.icon}
            />
          </TouchableOpacity>
          {/* <Icon4 name="analytics" size={24} color="#353638" style={styles.icon} /> */}
        </View>

        {/* Post Button */}
        <TouchableOpacity style={styles.postButton} onPress={SubmitPost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  profileTextContainer: {
    marginLeft: 10,
    maxWidth: 120,
  },
  profileName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'white',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  cancelButton: {},
  cancelButtonText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  textInput: {
    borderRadius: 10,
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  charCount: {
    color: '#888',
    textAlign: 'right',
    marginVertical: 5,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  mediaList: {
    marginTop: 10,
  },
  mediaContainer: {
    marginRight: 10,
    position: 'relative',
  },
  mediaPreview: {
    width: 300,
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'black',
  },
  videoContainer: {
    position: 'relative',
    marginRight: 10,
  },
  videoPreview: {
    width: 300,
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    backgroundColor: '#17191A',
    opacity: 0.5,
    padding: 10,
    borderRadius: 30,
    bottom: 10,
    right: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#17191A',
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 15,
  },
  postButton: {
    backgroundColor: '#388DEB',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
});
