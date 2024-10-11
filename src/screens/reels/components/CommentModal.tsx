import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {forwardRef, useCallback, useMemo, useState} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

export type Ref = BottomSheetModal;

// const commentsData = [
//   {
//     id: '1',
//     username: 'ayush_r_1979',
//     time: '2h',
//     comment: '❤️😢',
//     profilePic: 'https://lh3.googleusercontent.com/a/AEdFTp4V-B6AHugmI4geeR6vk_XvsugEYDWLiZyGc4fd=s96-c',
//   },
//   {
//     id: '2',
//     username: 'haarrii_10',
//     time: '18h',
//     comment: '❤️❤️ 🙌',
//     profilePic: 'https://example.com/user2.jpg',
//   },
//   {
//     id: '3',
//     username: 'vk_photography_vijaykamble',
//     time: '21h',
//     comment: '❤️😍',
//     profilePic: 'https://example.com/user3.jpg',
//   },
//   {
//     id: '4',
//     username: 'vk_photography_vijaykamble',
//     time: '21h',
//     comment: '❤️😍',
//     profilePic: 'https://example.com/user3.jpg',
//   },
//   {
//     id: '5',
//     username: 'vk_photography_vijaykamble',
//     time: '21h',
//     comment: '❤️😍',
//     profilePic: 'https://example.com/user3.jpg',
//   },
//   {
//     id: '6',
//     username: 'vk_photography_vijaykamble',
//     time: '21h',
//     comment: '❤️😍',
//     profilePic: 'https://example.com/user3.jpg',
//   },
//   {
//     id: '7',
//     username: 'vk_photography_vijaykamble',
//     time: '21h',
//     comment: '❤️😍',
//     profilePic: 'https://example.com/user3.jpg',
//   },
//   {
//     id: '8',
//     username: 'vk_photography_vijaykamble',
//     time: '21h',
//     comment: '❤️😍',
//     profilePic: 'https://example.com/user3.jpg',
//   },
//   {
//     id: '9',
//     username: 'vk_photography_vijaykamble',
//     time: '21h',
//     comment: '❤️😍',
//     profilePic: 'https://example.com/user3.jpg',
//   },
//   {
//     id: '10',
//     username: 'vk_photography_vijaykamble',
//     time: '21h',
//     comment: '❤️😍',
//     profilePic: 'https://example.com/user3.jpg',
//   },
//   {
//     id: '11',
//     username: 'vk_photography_vijaykamble',
//     time: '21h',
//     comment: '❤️😍',
//     profilePic: 'https://example.com/user3.jpg',
//   },
//   {
//     id: '12',
//     username: 'vk_photography_vijaykamble',
//     time: '21h',
//     comment: '❤️😍',
//     profilePic: 'https://example.com/user3.jpg',
//   },
//   // More comments...
// ];

const CommentModal = forwardRef<Ref>((props, ref) => {
  const [commentList, setCommentList] = useState([]); // Store the list of comments
  const [commentText, setCommentText] = useState(''); // Handle comment input
  const snapPoints = useMemo(() => ['100%'], []); // Adjust the height for comments
  const {dismiss} = useBottomSheetModal();
  const {bottom} = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.5}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={dismiss} // Dismiss modal on backdrop press
      />
    ),
    [dismiss],
  );

  const handleComment = () => {
    if (commentText.trim() === '') return; // Don't add empty comments

    const newComment = {
      id: Date.now(), // Generate a unique ID (use better logic if needed)
      username: 'Abhijeet Visheakarme', // Replace with actual user data
      profilePic: 'https://lh3.googleusercontent.com/a/AEdFTp4V-B6AHugmI4geeR6vk_XvsugEYDWLiZyGc4fd=s96-c', // Replace with actual profile pic
      time: '2m ago', // Replace with logic to get actual time
      comment: commentText,
    };

    // Add the new comment to the comment list
    setCommentList(prevComments => [...prevComments, newComment]);
    setCommentText(''); // Clear input after submission
  };

  const renderComment = item => (
    <View style={styles.commentContainer} key={item.id}>
      <Image source={{uri: item.profilePic}} style={styles.profilePic} />
      <View style={styles.commentContent}>
        <Text style={styles.username}>
          {item.username} <Text style={styles.time}>{item.time}</Text>
        </Text>
        <Text style={styles.commentText}>{item.comment}</Text>
      </View>
      <TouchableOpacity>
        <Icon
          name="heart-outline"
          size={20}
          color="#fff"
          style={styles.likeIcon}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
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
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}> */}
          {/* Comment List with BottomSheetScrollView */}
          <View style={styles.contentContainer}>
            <Text style={styles.containerHeadline}>Comments</Text>
            <BottomSheetScrollView
              contentContainerStyle={styles.commentsSection}
              showsVerticalScrollIndicator={false}>
              {commentList.map(renderComment)}
            </BottomSheetScrollView>
          </View>

          {/* Fixed Input at the Bottom */}
          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/images/profiles.png')}
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
            <TouchableOpacity style={styles.sendButton} onPress={handleComment}>
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        {/* </KeyboardAvoidingView> */}
      </BottomSheetModal>
    </>
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
  commentsSection: {
    paddingHorizontal: 15,
    paddingBottom: 60, // Extra padding for the input
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
  commentText: {
    color: '#fff',
    marginTop: 5,
  },
  likeIcon: {
    marginLeft: 10,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    // flex:1,
    paddingVertical: 15,
    backgroundColor: '#17191A',
    borderTopWidth: 1,
    borderTopColor: '#333',
    position: 'absolute', // Keep it fixed at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    zIndex:999
  },
  inputProfilePic: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
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
    marginLeft: 10,
  },
});
