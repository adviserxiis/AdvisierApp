import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import {useNavigation, useRoute} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import Ionic from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import storage from '@react-native-firebase/storage';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const AddPost = () => {
  const navigation = useNavigation();
  // const route = useRoute();
  // const { videoUri } = route.params;
  const [isMuted, setIsMuted] = useState(false); // State for mute functionality
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const user = useSelector(state => state.user);
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [location, setLocation] = useState('');
  const [resizeMode, setResizeMode] = useState('cover');
  const [loading, setLoading] = useState(false);
  // console.log(user.userid);
  const handleSelectVideo = () => {
    launchImageLibrary({mediaType: 'video', quality: 1}, response => {
      if (response.didCancel) {
        console.log('User canceled video picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else {
        setVideo(response.assets[0]);
        console.log(response.assets[0]);
      }
    });
  };

  const handleLoad = ({naturalSize}) => {
    const aspectRatio = naturalSize.width / naturalSize.height;
    if (aspectRatio === 16 / 9) {
      Alert.alert(
        'Invalid Video',
        'The video aspect ratio of 16:9 is not supported. Please select a video with a different aspect ratio.',
      );
      setVideo(null); // Clear the video state
    } else {
      setResizeMode(aspectRatio > 1 ? 'contain' : 'cover');
    }
  };

  const handleDeleteVideo = () => {
    setVideo(null);
  };

  // const savePost = async () => {
  //   if (!video) {
  //     Alert.alert('No video selected', 'Please select a video before saving.');
  //     return;
  //   }

  //   const fileUri = video.uri;
  //   console.log("Video URI:", fileUri);
  //   const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
  //   const reference = storage().ref(`/posts/${fileName}`);

  //   try {
  //     // Upload the video to Firebase storage
  //     await reference.putFile(Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri);

  //     // Get the download URL of the uploaded video
  //     const downloadURL = await reference.getDownloadURL();
  //     console.log('Video URL:', downloadURL);
  //     // console.log("Haj",user.userid);
  //     const response = await fetch(
  //       'https://adviserxiis-backend-three.vercel.app/post/createpost',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           adviserid: user.userid,
  //           videoURL: downloadURL,
  //           fileType:'video',
  //           location: location,
  //           description: description,
  //         }),
  //       },
  //     );
  //     const jsonresponse = await response.json();
  //     // console.log(response);
  //     console.log("a",jsonresponse);
  //     if (response.ok) {
  //       Alert.alert('Success', 'Your post has been saved.');
  //       // Optionally, reset the form after saving
  //       setVideo(null);
  //       setDescription('');
  //       setLocation('');
  //     } else {
  //       throw new Error('Failed to save post. Please try again.');
  //     }
  //   } catch (error) {
  //     console.log('Error:', error.message || error);
  //     Alert.alert('Error', 'There was an error saving your post. Please try again.');
  //   }
  // };

  const savePost = async () => {
    if (!video) {
      Alert.alert('No video selected', 'Please select a video before saving.');
      return;
    }

    if (!description) {
      // Check if description is empty or contains only whitespace
      Alert.alert('No caption', 'Please add a caption before saving.');
      return;
    }
    setLoading(true);

    const fileUri = video.uri;
    const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);

    const uploadToBunny = async () => {
      const apiKey = 'de112415-60af-446e-b3f795dec87a-222e-4dfb'; // Replace with your Bunny.net API key
      const storageZoneName = 'luink-ai'; // Replace with your storage zone name
      const storageUrl = `https://storage.bunnycdn.com/${storageZoneName}/${fileName}`;

      const accessUrl = `https://myluinkai.b-cdn.net/${fileName}`;

      try {
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
          // Continue to save the post metadata
          const postResponse = await fetch(
            'https://adviserxiis-backend-three.vercel.app/post/createpost',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                adviserid: user.userid,
                videoURL: videoURL,
                fileType: 'video',
                location: location,
                description: description,
              }),
            },
          );
          const jsonResponse = await postResponse.json();
          console.log('sndns', jsonResponse);
          if (postResponse.ok) {
            // Alert.alert('Success', 'Your post has been saved.');
            Alert.alert('Success', 'Post saved successfully!');
            // navigation.goBack();
            // Optionally, reset the form after saving
            setVideo(null);
            setDescription('');
            setLocation('');
          } else {
            throw new Error(
              jsonResponse.error || 'Failed to save post. Please try again.',
            );
          }
        } else {
          throw new Error('Failed to upload video to Bunny.net.');
        }
      } catch (error) {
        console.log('Error:', error.message || error);
        Alert.alert(
          'Error',
          'There was an error saving your post. Please try again.',
        );
      } finally {
        setLoading(false); // End loading
      }
    };

    uploadToBunny();
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()}>
          <Icon name='close-a' size={14} color='white' />
        </TouchableOpacity> */}
        <Text style={styles.title}>Create Reels</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {!video && (
          <TouchableOpacity
            onPress={handleSelectVideo}
            style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Upload Video</Text>
          </TouchableOpacity>
        )}

        {video && (
          <View style={styles.videoContainer}>
            <TouchableOpacity
              style={styles.videoTouchable}
              onPress={() => setShowControls(prev => !prev)}>
              <Video
                source={{uri: video.uri}}
                style={styles.video}
                controls={false}
                resizeMode={resizeMode}
                paused={isPaused} // Pause the video based on the state
                muted={isMuted}
                repeat={true}
                onLoad={handleLoad}
              />
              
              {showControls && (
                <View style={styles.overlayContainer}>
                  <TouchableOpacity
                    style={styles.muteButton}
                    onPress={() => setIsMuted(prev => !prev)}>
                    <Ionic
                      name={isMuted ? 'volume-mute' : 'volume-high'}
                      size={18}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pauseButton}
                    onPress={() => setIsPaused(prev => !prev)}>
                    <Icon
                      name={isPaused ? 'play' : 'pause'}
                      size={18}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteVideo}>
                <Icon name="trash" size={18} color="white" />
              </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            flexDirection: 'column',
            gap: 20,
          }}>
          <TextInput
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            placeholder="Write Caption..."
            style={{
              height: 100,
              width: '100%',
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
              fontFamily: 'Poppins-Regular',
            }}
          />
          {/* <GooglePlacesAutocomplete
          placeholder='Add Location'
          onPress={(data, details = null) => {
            // 'data' is a Google Places API response
            // 'details' is optional and contains place details if needed
            // setLocation(data.description);
            console.log(data.description);
          }}
          query={{
            key: 'AIzaSyCm-GigzOJbq_swvyVYSPSo9on-h-_pd0o',
            language: 'en',
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInput: styles.autocompleteInput,
            listView: styles.autocompleteListView,
          }}
        /> */}
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Add location"
            style={{
              height: 49,
              width: '100%',
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
              fontFamily: 'Poppins-Regular',
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 5,
            marginTop: 30,
          }}>
          {/* <Pressable style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Save Draft</Text>
          </Pressable> */}
          <Pressable style={styles.saveButton} onPress={savePost}>
            <Text style={styles.saveButtonText}>Done</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
    paddingHorizontal: 16,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  closeButton: {
    padding: 10,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
    borderColor: '#717171',
    borderWidth: 1,
  },
  closeButtonText: {
    color: '#717171',
    fontFamily: 'Poppins-Regular',
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  saveButton: {
    backgroundColor: '#0069B4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  videoTouchable: {
    position: 'relative',
  },
  muteButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 5,
  },
  pauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -10}, {translateY: -10}],
    padding: 5,
  },
  autocompleteContainer: {
    flex: 1,
    width: '100%',
  },
  autocompleteInput: {
    height: 40,
    color: 'black',
    fontFamily: 'Poppins-Medium',
  },
  autocompleteListView: {
    backgroundColor: 'white',
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    marginTop: 3,
  },
  selectButton: {
    backgroundColor: '#0069B4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  selectButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  videoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: 'black',
    height: 350,
    // borderRadius: 50,
  },
});

export default AddPost;
