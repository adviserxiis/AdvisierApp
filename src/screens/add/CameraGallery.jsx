// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, FlatList, StyleSheet, PermissionsAndroid, Platform, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/AntDesign'; 
// import CameraRoll from '@react-native-community/cameraroll';
// import Video from 'react-native-video';
// import { useNavigation } from '@react-navigation/native';

// // Memoized VideoItem Component
// const VideoItem = React.memo(({ uri,isSelected , onSelect }) => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [resizeMode, setResizeMode] = useState('cover');
//   const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
//   const handleLoad = (data) => {
//     setIsLoaded(true);
//     const { width, height } = data.naturalSize;

//     // Set the video dimensions
//     setVideoDimensions({ width, height });

//     // Determine the aspect ratio
//     const aspectRatio = width / height;

//     // If the video is closer to 16:9, use 'contain'; if closer to 9:16, use 'cover'
//     if (Math.abs(aspectRatio - 16 / 9) < 0.1) {
//       setResizeMode('contain');
//     } else {
//       setResizeMode('cover');
//     }
//   };

//   return (
//     <TouchableOpacity onPress={onSelect} activeOpacity={0.5} style={[styles.videoContainer, isSelected && styles.selectedVideoContainer]}>
//       {!isLoaded && (
//         <Image
//           source={{ uri }}
//           style={styles.video}
//           resizeMode="cover"
//         />
//       )}
//       <Video
//         source={{ uri }}
//         style={styles.video}
//         resizeMode={resizeMode}
//         controls={false}
//         paused={true}
//         onLoad={handleLoad}
//         onError={(error) => console.error('Video loading error:', error)} // Handle video load errors
//       />
//       {isSelected && (
//         <View style={styles.tickMarkContainer}>
//           <Icon name="checkcircle" size={16} color="white" />
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// });

// // Memoized CameraGallery Component
// const CameraGallery = React.memo(() => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedVideoUri, setSelectedVideoUri] = useState(null);
//   const navigation = useNavigation(); 

//   useEffect(() => {
//     requestPermission();
//   }, []);

//   const requestPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         {
//           title: 'Camera Roll Permission',
//           message: 'We need access to your camera roll to display your videos.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         fetchVideos();
//       } else {
//         console.log('Camera roll permission denied');
//       }
//     } else {
//       fetchVideos();
//     }
//   };

//   const fetchVideos = async () => {
//     // setLoading(true);
//     try {
//       const result = await CameraRoll.getPhotos({
//         first: 20, // Number of videos to load
//         assetType: 'Videos', // Specify 'Videos' to fetch videos only
//       });
//       setVideos(result.edges);
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//     } finally {
//     //   setLoading(false);
//     }
//   };

//   const renderItem = useCallback(({ item }) => (
//     <VideoItem
//       uri={item.node.image.uri}
//       isSelected={selectedVideoUri === item.node.image.uri}
//       onSelect={() => handleSelectVideo(item.node.image.uri)}
//     />
//   ), [selectedVideoUri]);

//   const handleSelectVideo = (uri) => {
//     setSelectedVideoUri((prevUri) => (prevUri === uri ? null : uri)); // Toggle selection
//   };

//   const handleContinue = () => {
//     console.log('shjs',selectedVideoUri);
//     if (selectedVideoUri) {
//       navigation.navigate('CreatePost', { videoUri: selectedVideoUri });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Create Reel</Text>
//       </View>
//       {loading ? (
//         <ActivityIndicator size="large" color="#fff" style={styles.loader} />
//       ) : (
//         <FlatList
//           showsVerticalScrollIndicator={false}
//           data={videos}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.node.image.uri}
//           numColumns={3}
//           removeClippedSubviews={true} // Improve performance by removing off-screen items
//           initialNumToRender={10} // Number of items to render initially
//           maxToRenderPerBatch={5} 
//           onEndReached={fetchVideos} // Load more videos when reaching the end
//           onEndReachedThreshold={0.5} // Trigger loading more items when half of the content is visible
//         />
//       )}

//     {selectedVideoUri && (
//         <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
//           <Text style={styles.continueButtonText}>Continue</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#17191A',
//   },
//   header: {
//     marginTop: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginBottom:10,
//     paddingHorizontal: 16,
//   },
//   title: {
//     fontSize: 20,
//     color: 'white',
//     fontFamily: 'Poppins-Medium',
//     marginTop: 3,
//   },
//   videoContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems:'center',
//     margin: 2,
//     width: '100%',
//      // Maintain aspect ratio
//   },
//   selectedVideoContainer: {
//     borderColor: 'white',
//     borderWidth: 0.5,
//   },
//   tickMarkContainer: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     borderRadius: 12,
//     padding: 3,
//   },
//   tickIcon: {
//     color: '#000',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//     flex:1,
//     backgroundColor:'black',
//     aspectRatio: 9/16,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// //   wideVideo: {
// //     aspectRatio: 16 / 9, // Adjust aspect ratio for wide (landscape) videos
// //     justifyContent: 'center', // Center the video
// //     alignItems: 'center',
// //   },

// continueButton: {
//     position: 'absolute',
//     bottom: 20,
//     left: 16,
//     right: 16,
//     backgroundColor: '#388DEB',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   continueButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontFamily: 'Poppins-Medium',
//   },
// });

// export default CameraGallery;
