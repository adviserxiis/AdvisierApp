import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {useSelector} from 'react-redux';

export type Ref = BottomSheetModal;

const CommentModal = forwardRef<Ref>(({video, creator}, ref) => {
  const [commentList, setCommentList] = useState([]); // Store the list of comments
  const [commentText, setCommentText] = useState(''); // Handle comment input
  const snapPoints = useMemo(() => ['100%'], []);
  const {dismiss} = useBottomSheetModal();
  const {bottom} = useSafeAreaInsets();
  console.log('Creator at comment ', creator?.device_token);
  const navigation = useNavigation();

  const user = useSelector((state: any) => state.user);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.5}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={dismiss}
      />
    ),
    [dismiss],
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      dismiss();
      return true; // Prevents the default back action
    });

    return () => backHandler.remove(); // Cleanup listener on unmount
  }, [dismiss]);

  useEffect(() => {
    if (video && video.comments) {
      setCommentList(video.comments); // Set initial comments
    }
  }, [video]);
  console.log(video?.adviserDetails?.username);

  console.log('device token', video);

  const handleAddComment = async () => {
    const userObjectString = await AsyncStorage.getItem('user');
    let userObject = null;

    if (userObjectString) {
      userObject = JSON.parse(userObjectString);
    } else {
      console.error('No user found in AsyncStorage');
      return;
    }

    try {
      const postid = video?.id; // Assuming videoSrc has an id property
      if (!postid) {
        console.error('Post ID is missing.');
        return;
      }

      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/post/addcomment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adviserid: userObject.userid,
            postid: postid,
            message: commentText, // Using the correct variable
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Error posting comment: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(`Backend error: ${data.error}`);
      } else {
        // Add new comment to the state
        // setCommentList(prev => [...prev, { // Append new comment to the list
        //   id: Date.now().toString(), // Generate a unique ID
        //   username: userObject.name,
        //   time: 'Just now', // You can implement actual time logic if needed
        //   comment: commentText,
        //   profilePic: userObject.profilePic || 'https://example.com/default-profile-pic.jpg', // Default image
        // }]);

        // Clear the input field
        setCommentText('');
        fetchComment();

        // Send notification logic
        const NotificationResponse = await fetch(
          'https://adviserxiis-backend-three.vercel.app/notification/sendnotification',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              deviceToken:
                video?.adviser?.data?.device_token || creator?.device_token,
              title: 'Commented Now',
              body: `${userObject.name} commented on your reel!`,
            }),
          },
        );
        const notificationJsonResponse = await NotificationResponse.json();
        console.log('Notification response:', notificationJsonResponse);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const fetchComment = async () => {
    // const postid = post?.id;
    try {
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/post/fetchcomments/${video?.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // if (!response.ok) {
      //   throw new Error('Error fetching comments');
      // }

      const data = await response.json();

      console.log('Response Data:', data.comments);
      setCommentList(data?.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchComment();
    }, [video?.id]),
  );

  const deleteComment = commentIndex => {
    const postid = video?.id;
    console.log('Post Id', postid);
    console.log('COmment Id', commentIndex);

    Alert.alert(
      'Delete comment',
      'Are you sure you want to delete this comment?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete canceled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              console.log('Deleting reel with ID:', postid);
              const response = await fetch(
                'https://adviserxiis-backend-three.vercel.app/post/deletecomment',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    postid: postid,
                    commentIndex: commentIndex,
                  }),
                },
              );

              // Fetch updated reels list after deletion
              const jsonResponse = await response.json();
              console.log('Comment deleted:', jsonResponse);
              fetchComment();

              // Optional: You can show another alert for success
              // Alert.alert('Success', 'The reel has been deleted.');
            } catch (error) {
              console.error('Error deleting reel:', error);
              Alert.alert(
                'Error',
                'Failed to delete the reel. Please try again.',
              );
            }
          },
          style: 'destructive', // Optional: Makes the delete button red on iOS
        },
      ],
      {cancelable: false},
    );
  };

  const getRelativeTime = dateString => {
    // Parse the date string into a moment object
    const parsedDate = moment(dateString);

    // Get the relative time (e.g., "1 day ago", "2 days ago")
    const relativeTime = parsedDate.fromNow();

    return relativeTime;
  };

  const [profilePhoto, setProfilePhoto] = useState(null);

  const getProfilePhoto = async () => {
    try {
      // Fetch profile photo from AsyncStorage
      const userptp = await AsyncStorage.getItem('user');
      const profileData = JSON.parse(userptp);
      // console.log('async store for photo', profileData?.profile_photo);
      // console.log('async store for name', profileData?.name);
      if (profileData) {
        setProfilePhoto(profileData?.profile_photo); // Update the state with the fetched photo
        // setName(profileData?.name); // Update the state with the fetched name
      }
    } catch (error) {
      console.log('Error retrieving profile photo:', error);
    }
  };

  useEffect(() => {
    getProfilePhoto();
  }, []);

  const renderComment = (item, index) => (
    <View style={styles.commentContainer} key={index}>
      <Pressable
        onPress={() => {
          navigation.navigate('ViewProfile', item?.adviserDetails?.id);
          dismiss(); // Assuming dismiss is a valid function to call
        }}>
        <Image
          source={
            item?.adviserDetails?.profile_photo
              ? {uri: item?.adviserDetails?.profile_photo}
              : require('../../../assets/images/profiles.png')
          }
          style={styles.profilePic}
        />
      </Pressable>
      <View style={styles.commentContent}>
        <Pressable
          onPress={() => {
            navigation.navigate('ViewProfile', item?.adviserDetails?.id);
            dismiss(); // Assuming dismiss is a valid function to call
          }}>
          <Text style={styles.username}>
            {item?.adviserDetails?.username}{' '}
            {/* <Text style={styles.time}>{getRelativeTime(item?.date)}</Text> */}
          </Text>
        </Pressable>
        <Text style={styles.commentText}>{item?.message}</Text>
      </View>
      {/* <TouchableOpacity>
        <Icon
          name="heart-outline"
          size={20}
          color="#fff"
          style={styles.likeIcon}
        />
      </TouchableOpacity> */}
      {item?.adviserDetails?.id === user.userid && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteComment(index)} // Assuming handleRemoveComment exists
        >
          <Icon1 name="delete" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      ref={ref}
      handleIndicatorStyle={{
        backgroundColor: 'gray',
      }}
      handleStyle={{
        backgroundColor: '#17191A',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}
      index={0}>
      {/* <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
      {/* Comment List with BottomSheetScrollView */}
      <View style={styles.contentContainer}>
        <Text style={styles.containerHeadline}>Comments</Text>
        <BottomSheetScrollView
          contentContainerStyle={styles.commentsSection}
          showsVerticalScrollIndicator={false}>
          {commentList.length === 0 ? (
            <Text
              style={{
                fontSize: 16,
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'Poppins-Regular',
                marginTop: 20,
              }}>
              No comments yet
            </Text>
          ) : (
            commentList.map((item, index) => renderComment(item, index))
          )}
        </BottomSheetScrollView>
      </View>

      {/* Fixed Input at the Bottom */}
      <View style={styles.inputContainer}>
        <Image
          source={
            profilePhoto
              ? {uri: profilePhoto}
              : require('../../../assets/images/profiles.png')
          }
          style={styles.inputProfilePic}
        />
        <TextInput
          autoFocus
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#999"
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* </KeyboardAvoidingView> */}
    </BottomSheetModal>
  );
});

export default CommentModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  containerHeadline: {
    fontSize: 16,
    padding: 5,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  deleteButton: {
    // position:'absolute',
    // top:20,
    marginTop: 10,
    // right:0,
  },
  commentsSection: {
    paddingHorizontal: 15,
    paddingBottom: 80, // Adjusted for the input field
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    color: '#fff',
    // fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  time: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  commentText: {
    fontFamily: 'Poppins-Regular',
    color: '#838383',
  },
  likeIcon: {
    marginLeft: 10,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#17191A',
    borderTopWidth: 1,
    borderTopColor: '#333',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  inputProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 5,
    height: 40,
    width: 40,
    padding: 10,
    backgroundColor: '#0069B4',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
