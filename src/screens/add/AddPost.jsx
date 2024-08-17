import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import storage from '@react-native-firebase/storage';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const AddPost = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.user);
  const [description,setDescription]=useState('');
  const [video, setVideo] = useState(null);
  const[location,setLocation]=useState('');
  const [resizeMode, setResizeMode] = useState('cover');
  // console.log(user.userid);
  const handleSelectVideo = () => {
    launchImageLibrary({ mediaType: 'video', quality: 1 }, response => {
      if (response.didCancel) {
        console.log('User canceled video picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else {
        setVideo(response.assets[0]);
        console.log(response.assets[0])
      }
    });
  };

  const handleLoad = ({ naturalSize }) => {
    const aspectRatio = naturalSize.width / naturalSize.height;
    setResizeMode(aspectRatio > 1 ? 'contain' : 'cover');
  };

  const handleDeleteVideo = () => {
    setVideo(null);
  };

  const savePost = async () => {
    if (!video) {
      Alert.alert('No video selected', 'Please select a video before saving.');
      return;
    }
  
    const fileUri = video.uri;
    console.log("Video URI:", fileUri);
    const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
    const reference = storage().ref(`/posts/${fileName}`);
  
    try {
      // Upload the video to Firebase storage
      await reference.putFile(Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri);
  
      // Get the download URL of the uploaded video
      const downloadURL = await reference.getDownloadURL();
      console.log('Video URL:', downloadURL);
      // console.log("Haj",user.userid);
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/post/createpost',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adviserid: user.userid,
            videoURL: downloadURL,
            fileType:'video',
            location: location,
            description: description,
          }),
        },
      );
      const jsonresponse = await response.json();
      // console.log(response);
      console.log("a",jsonresponse);
      if (response.ok) {
        Alert.alert('Success', 'Your post has been saved.');
        // Optionally, reset the form after saving
        setVideo(null);
        setDescription('');
        setLocation('');
      } else {
        throw new Error('Failed to save post. Please try again.');
      }  
    } catch (error) {
      console.log('Error:', error.message || error);
      Alert.alert('Error', 'There was an error saving your post. Please try again.');
    }
  };
  
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()}>
          <Icon name='close-a' size={14} color='white' />
        </TouchableOpacity> */}
        <Text style={styles.title}>Create Reels</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
      {!video && (
        <TouchableOpacity onPress={handleSelectVideo} style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Upload Video</Text>
        </TouchableOpacity>
      )}

      {video && (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: video.uri }}
            style={styles.video}
            controls={true}
            resizeMode={resizeMode}
            paused={false}
            repeat={true}
            onLoad={handleLoad}
          />
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteVideo}>
              <Icon name='trash' size={20} color='white' />
            </TouchableOpacity>
        </View>
      )}
      <View style={{
        flexDirection:'column',
        gap:20,
      }}>
        <TextInput numberOfLines={4} value={description} onChangeText={setDescription} multiline={true} placeholder='Write Caption...' style={{
          height: 150,
          width:'100%',
          borderBottomColor:'gray',
          borderBottomWidth:1,
          fontFamily:'Poppins-Regular' 

        }}/>
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
        <TextInput  value={location} onChangeText={setLocation}  placeholder='Add location' style={{
          height: 49,
          width:'100%',
          borderBottomColor:'gray',
          borderBottomWidth:1,
          fontFamily:'Poppins-Regular'
        }}/>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal:5,
          marginTop:30
        }}>
        <Pressable
          style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Save Draft</Text>
        </Pressable>
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
    paddingHorizontal:16,
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
    alignItems: 'center',
    width: '50%',
    borderRadius: 10,
  },
  header: {
    marginTop:20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    marginTop:10
  },
  selectButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  videoContainer: {
    
    justifyContent: 'flex-start',
    marginTop:10,
    alignItems: 'center',
  },
  video: {
    width: '80%',
    height: 350,
    borderRadius: 50,
  },
});

export default AddPost;
