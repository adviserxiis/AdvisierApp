import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Foundation';
import {BlurView} from '@react-native-community/blur';
import {useFocusEffect} from '@react-navigation/native';
import Share from 'react-native-share';
import Icon1 from 'react-native-vector-icons/MaterialIcons';

const PostItem = ({post, isVisible, getPostlist}) => {
  const user = useSelector(state => state.user);

  const [like, setLike] = useState(post?.data?.likes?.includes(user.userid));
  const [likeCount, setLikeCount] = useState((post.data.likes || []).length);
  const [paused, setPaused] = useState(!isVisible);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState({
    currentTime: 0,
    seekableDuration: 0,
  });
  const videoRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openCommentsModal = () => {
    setModalVisible(true); // Open modal on comment icon press
  };

  const closeCommentsModal = () => {
    setModalVisible(false); // Close modal
  };

  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  useFocusEffect(
    useCallback(() => {
      // Update the comment count when the screen is focused
      const updatedCommentCount = (post.data.comments || []).length || 0;
      setCommentCount(updatedCommentCount);
    }, [post]),
  );

  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const likeHandler = useCallback(async () => {
    if (like) {
      await removeLike(post?.id);
      setLikeCount(prevCount => prevCount - 1);
    } else {
      setLikeCount(prevCount => prevCount + 1);
      await AddLiked(post?.id);
    }
  }, [like, post?.id]);

  const postid = post?.id;
  const AddLiked = async postid => {
    console.log(postid);
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
            postid: postid,
            userid: user.userid, // Access userid from userObject
          }),
        },
      );

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
              deviceToken: post?.adviser?.data?.device_token,
              title: 'Post Liked Update',
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
          postid: postid,
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

  function timeAgo(dop) {
    // console.log(dop);
    const postDate = new Date(dop);
    const now = new Date();
    const secondsAgo = Math.floor((now - postDate) / 1000);

    const intervals = [
      {label: 'year', seconds: 31536000}, // 60 * 60 * 24 * 365
      {label: 'month', seconds: 2592000}, // 60 * 60 * 24 * 30
      {label: 'week', seconds: 604800}, // 60 * 60 * 24 * 7
      {label: 'day', seconds: 86400}, // 60 * 60 * 24
      {label: 'hour', seconds: 3600}, // 60 * 60
      {label: 'minute', seconds: 60},
      {label: 'second', seconds: 1},
    ];

    for (const interval of intervals) {
      const count = Math.floor(secondsAgo / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }

  const handleVideoProgress = progress => {
    setProgress(progress);
  };

  const handleSeek = value => {
    videoRef.current.seek(value);
  };
  // if(post?.data?.file_type === 'image'){

  //   console.log('Post Data',post?.data?.post_file);
  // }
  const handleVideoEnd = () => {
    setPaused(true);
    videoRef.current.seek(0); // Seek back to the start of the video
  };

  const togglePlayPause = () => {
    setPaused(!paused);
    setShowControls(true); // Show the play/pause icon
    // Hide the controls after 2 seconds if playing
    if (!paused) {
      setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  const fetchComment = async () => {
    // const postid = post?.id;
    try {
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/post/fetchcomments/${post?.id}`,
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
      setComments(data?.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const deleteComment = commentIndex => {
    const postid = post?.id;
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

  useFocusEffect(
    useCallback(() => {
      fetchComment();
    }, [post?.id]),
  );
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
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
      const postid = post?.id;
      console.log('Post ID:', postid);
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
            adviserid: user.userid,
            postid: postid,
            message: newComment,
          }),
        },
      );

      if (!response.ok) {
        console.error('Error posting comment:', response.statusText);
        return;
      }

      const data = await response.json();
      // console.log('Response Data:', data);

      if (data.error) {
        console.error('Backend error:', data.error);
      } else {
        // setComments([...comments, data]); // Uncomment if comments updating works fine.
        // setNewComment('');
        fetchComment();
        const NotificationResponse = await fetch(
          'https://adviserxiis-backend-three.vercel.app/notification/sendnotification',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              deviceToken: post?.adviser?.data?.device_token,
              title: 'Commented Now',
              body: `${userObject.name} has comment on your post!`,
            }),
          },
        );

        setNewComment('');
        const notificationJsonResponse = await NotificationResponse.json();
        console.log('Notification response:', notificationJsonResponse);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const deletePost = postid => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this Post?',
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
                'https://adviserxiis-backend-three.vercel.app/post/deletepost',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    adviserid: user.userid,
                    postid: postid,
                  }),
                },
              );

              getPostlist();
              // Fetch updated reels list after deletion
              const jsonResponse = await response.json();
              console.log('Post deleted:', jsonResponse);

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

  const shareProfile = async () => {
    const shareOptions = {
      message: `Check out ${post?.adviser?.data?.username} profile on this amazing Luink.ai!`,
      url: 'https://play.google.com/store/apps/details?id=com.advisiorapp', // Replace with your actual URL
    };

    try {
      const result = await Share.open(shareOptions);
      if (result) {
        console.log('Shared successfully:', result);
      }
    } catch (error) {
      if (error.message) {
        // Alert.alert('Error', error.message);
      } else if (error.dismissedAction) {
        console.log('Share dismissed');
      }
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;


  return (
    <View>
      <View style={styles.postContainer}>
        <View style={styles.header}>
          <Image
            source={
              post?.adviser?.data?.profile_photo
                ? {uri: post?.adviser?.data?.profile_photo}
                : require('../../../assets/images/bane.png')
            }
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#ccc',
              marginRight: 10,
            }}
          />
          <View style={styles.headerText}>
            <Text style={styles.name}>{post?.adviser?.data?.username}</Text>
            <Text style={styles.role}>
              • {post?.adviser?.data?.professional_title} •{' '}
              {timeAgo(post?.data?.dop)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => deletePost(post?.id)}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
            }}>
            <Icon2 name="trash" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>{post?.data?.description}</Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: '#388DEB',
            textDecorationLine:'underline'
          }}>
          {post?.data?.luitags}
        </Text>
        {post?.data?.file_type === 'image' &&
        Array.isArray(post?.data?.post_file) ? (
          // Handle array of images
          <>
          <FlatList
            data={post?.data?.post_file}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled
            renderItem={({item}) => (
              <Image
                source={
                  item
                    ? {uri: item}
                    : require('../../../assets/images/bane.png')
                }
                style={styles.profilePic}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
          <View style={styles.indicatorContainer}>
              {Array.isArray(post?.data?.post_file) && (
                <View style={styles.indicatorWrapper}>
                  {post?.data?.post_file.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        {
                          backgroundColor:
                            index === currentIndex ? '#388DEB' : '#333', // Change color based on current page
                        },
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        ) : (
          post?.data?.file_type === 'image' && (
            // Handle single image
            // <Image
            // source={{uri: post?.data?.post_file}}
            // style={styles.postMediaImage} // Style for the image
            // resizeMode="cover"
            // />
            <Image
              source={
                post?.data?.post_file
                  ? {uri: post?.data?.post_file}
                  : require('../../../assets/images/bane.png')
              }
              style={styles.profilePic}
            />
          )
        )}

        {post?.data?.file_type === 'long_video' &&
        Array.isArray(post?.data?.post_file) ? (
          <>
          <FlatList
            data={post?.data?.post_file}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            renderItem={({item}) => (
              <View>
                <TouchableOpacity
                  onPress={togglePlayPause}
                  style={{
                    width: Dimensions.get('window').width - 30,
                    height: 260,
                  }}>
                  <Video
                    source={{uri: item.video_url}}
                    style={styles.postMediaVideo} // Style for the video
                    resizeMode="contain"
                    controls={false}
                    paused={paused}
                    onProgress={handleVideoProgress}
                    ref={videoRef}
                    onEnd={handleVideoEnd}
                  />
                  {showControls && (
                    <View style={styles.overlayControls}>
                      <Icon
                        name={paused ? 'play' : 'pause'}
                        size={40}
                        color="white"
                      />
                    </View>
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bottom: 10,
                    paddingHorizontal: 15,
                    marginTop: 20,
                  }}>
                  <Text style={{color: 'white'}}>
                    {format(progress.currentTime)}
                  </Text>
                  <Slider
                    style={{width: '75%', height: 40}}
                    minimumValue={0}
                    maximumValue={progress.seekableDuration}
                    value={progress.currentTime}
                    onSlidingComplete={handleSeek}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#FFFFFF"
                  />
                  <Text style={{color: 'white'}}>
                    {format(progress.seekableDuration)}
                  </Text>
                </View>
              </View>
            )}
            onViewableItemsChanged={onViewableItemsChanged} // Track visible items
            viewabilityConfig={viewabilityConfig}
          />
          <View style={styles.indicatorContainer}>
              {Array.isArray(post?.data?.post_file) && (
                <View style={styles.indicatorWrapper}>
                  {post?.data?.post_file.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        {
                          backgroundColor:
                            index === currentIndex ? '#388DEB' : '#333', // Change color based on current page
                        },
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        ) : (
          post?.data?.file_type === 'long_video' && (
            // Handle single video
            <View>
              <TouchableOpacity
                onPress={togglePlayPause}
                style={{width: '100%', height: 200}}>
                <Video
                  source={{uri: post?.data?.post_file}}
                  style={styles.postMediaVideo}
                  controls={false}
                  paused={paused}
                  onProgress={handleVideoProgress}
                  ref={videoRef}
                  onEnd={handleVideoEnd}
                  resizeMode="contain"
                />
                {showControls && (
                  <View style={styles.overlayControls}>
                    <Icon
                      name={paused ? 'play' : 'pause'}
                      size={40}
                      color="white"
                    />
                  </View>
                )}
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 15,
                  marginTop: 20,
                }}>
                <Text style={{color: 'white'}}>
                  {format(progress.currentTime)}
                </Text>
                <Slider
                  style={{width: '70%', height: 40}}
                  minimumValue={0}
                  maximumValue={progress.seekableDuration}
                  value={progress.currentTime}
                  onSlidingComplete={handleSeek}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#FFFFFF"
                />
                <Text style={{color: 'white'}}>
                  {format(progress.seekableDuration)}
                </Text>
              </View>
            </View>
          )
        )}
        <View style={styles.interaction}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
            }}>
            <TouchableOpacity onPress={likeHandler} style={styles.iconWithText}>
              <Icon3
                name={like ? 'heart' : 'heart-outline'}
                size={20}
                color={like ? '#FA4445' : 'white'}
              />
              <Text style={styles.iconText}>{likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconWithText}
              onPress={openCommentsModal}>
              <Icon3 name="chatbubble-outline" size={20} color="white" />
              <Text style={styles.iconText}>{commentCount}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={shareProfile}>
            <Icon1 name="share" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true} // Make modal background transparent for blur effect
        visible={modalVisible}
        onRequestClose={closeCommentsModal}>
        {/* Blur Background */}
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor="dark"
        />

        {/* Modal Content */}
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            {/* Close Button */}

            <TouchableOpacity
              onPress={closeCommentsModal}
              style={styles.closeButton}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeader}>Comments</Text>

            {/* Comments List */}
            <FlatList
              data={comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View style={styles.commentContainer}>
                  <Image
                    source={
                      item?.adviserDetails?.profile_photo
                        ? {uri: item?.adviserDetails?.profile_photo}
                        : require('../../../assets/images/bane.png')
                    }
                    style={styles.commentProfilePic}
                  />
                  <View style={styles.commentTextContainer}>
                    <Text style={styles.commentUsername}>
                      {item?.adviserDetails?.username}
                    </Text>
                    <Text style={styles.commentText}>{item?.message}</Text>
                  </View>
                  {item?.adviserDetails?.id === user.userid && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteComment(index)} // Assuming handleRemoveComment exists
                    >
                      <Icon1 name="delete" size={20} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                placeholderTextColor="#888"
                value={newComment}
                onChangeText={setNewComment}
                onSubmitEditing={handleAddComment} // Add comment on 'enter'
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={styles.sendButton}>
                <Icon name="send" size={20} color="#407BFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default PostItem;

const styles = StyleSheet.create({
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
    width: Dimensions.get('window').width - 30, // Full width of the container
    height: 250, // Adjust height as needed
    borderRadius: 15, // Rounded corners for a modern look
    marginTop: 10,
    backgroundColor: 'black',
    resizeMode: 'contain',
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
    top: '46%',
    left: '44%',
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
    marginTop: 10,
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
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 25,
    zIndex: 1000,
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
  closeModalText: {
    color: 'white',
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
  indicatorContainer: {
    alignItems: 'center',
    marginTop: 10, // Space between the images and the indicator
  },
  indicatorWrapper: {
    flexDirection: 'row',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
