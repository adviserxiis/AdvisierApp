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

const commentsData = [
  {
    id: '1',
    username: 'ayush_r_1979',
    time: '2h',
    comment: '❤️😢',
    profilePic: 'https://example.com/user1.jpg',
  },
  {
    id: '2',
    username: 'haarrii_10',
    time: '18h',
    comment: '❤️❤️ 🙌',
    profilePic: 'https://example.com/user2.jpg',
  },
  {
    id: '3',
    username: 'vk_photography_vijaykamble',
    time: '21h',
    comment: '❤️😍',
    profilePic: 'https://example.com/user3.jpg',
  },
  {
    id: '4',
    username: 'vk_photography_vijaykamble',
    time: '21h',
    comment: '❤️😍',
    profilePic: 'https://example.com/user3.jpg',
  },
  {
    id: '5',
    username: 'vk_photography_vijaykamble',
    time: '21h',
    comment: '❤️😍',
    profilePic: 'https://example.com/user3.jpg',
  },
  {
    id: '6',
    username: 'vk_photography_vijaykamble',
    time: '21h',
    comment: '❤️😍',
    profilePic: 'https://example.com/user3.jpg',
  },
  {
    id: '7',
    username: 'vk_photography_vijaykamble',
    time: '21h',
    comment: '❤️😍',
    profilePic: 'https://example.com/user3.jpg',
  },
  {
    id: '8',
    username: 'vk_photography_vijaykamble',
    time: '21h',
    comment: '❤️😍',
    profilePic: 'https://example.com/user3.jpg',
  },
  {
    id: '9',
    username: 'vk_photography_vijaykamble',
    time: '21h',
    comment: '❤️😍',
    profilePic: 'https://example.com/user3.jpg',
  },
  {
    id: '10',
    username: 'vk_photography_vijaykamble',
    time: '21h',
    comment: '❤️😍',
    profilePic: 'https://example.com/user3.jpg',
  },
  {
    id: '11',
    username: 'vk_photography_vijaykamble',
    time: '21h',
    comment: '❤️😍',
    profilePic: 'https://example.com/user3.jpg',
  },
  {
    id: '12',
    username: 'vk_photography_vijaykamble',
    time: '21h',
    comment: '❤️😍',
    profilePic: 'https://example.com/user3.jpg',
  },
  // More comments...
];

const CommentModal = forwardRef<Ref>((props, ref) => {
  const [comment, setComment] = useState('');
  const {comments = commentsData} = props;
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
              {comments.map(renderComment)}
            </BottomSheetScrollView>
          </View>

          {/* Fixed Input at the Bottom */}
          <View style={[styles.inputContainer, {paddingBottom: bottom}]}>
            <Image
              source={require('../../../assets/images/profiles.png')}
              style={styles.inputProfilePic}
            />
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#999"
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.sendButton}>
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
    padding: 10,
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
    alignItems: 'flex-start',
    marginBottom: 15,
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
    paddingVertical: 10,
    backgroundColor: '#1C1C1C',
    borderTopWidth: 1,
    borderTopColor: '#333',
    // position: 'absolute', // Keep it fixed at the bottom
    // bottom: 0,
    // left: 0,
    // right: 0,
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
