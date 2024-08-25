// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, FlatList, StyleSheet, PermissionsAndroid, Platform, Image, ActivityIndicator } from 'react-native';
// import CameraRoll from '@react-native-community/cameraroll';
// import Video from 'react-native-video';

// // Memoized VideoItem Component
// const VideoItem = React.memo(({ uri }) => {
//   const [isLoaded, setIsLoaded] = useState(false);

//   const handleLoad = () => setIsLoaded(true);

//   return (
//     <View style={styles.videoContainer}>
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
//         resizeMode="cover"
//         controls={false}
//         paused={!isLoaded}
//         onLoad={handleLoad}
//         onError={(error) => console.error('Video loading error:', error)} // Handle video load errors
//       />
//     </View>
//   );
// });

// // Memoized CameraGallery Component
// const CameraGallery = React.memo(() => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);

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
//     setLoading(true);
//     try {
//       const result = await CameraRoll.getPhotos({
//         first: 20, // Number of videos to load
//         assetType: 'Videos', // Specify 'Videos' to fetch videos only
//       });
//       setVideos(result.edges);
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = useCallback(({ item }) => (
//     <VideoItem uri={item.node.image.uri} />
//   ), []);

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
//           numColumns={2}
//           removeClippedSubviews={true} // Improve performance by removing off-screen items
//           initialNumToRender={10} // Number of items to render initially
//           maxToRenderPerBatch={5} 
//           onEndReached={fetchVideos} // Load more videos when reaching the end
//           onEndReachedThreshold={0.5} // Trigger loading more items when half of the content is visible
//         />
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
//     justifyContent: 'flex-start',
//     margin: 3,
//     width: '100%',
//     aspectRatio: 1, // Maintain aspect ratio
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default CameraGallery;
