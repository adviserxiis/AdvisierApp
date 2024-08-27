import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Video from 'react-native-video';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Foundation';
import {useSelector} from 'react-redux';
const DeletePost = () => {
  const user = useSelector(state => state.user);
  // const [videos, setVideos] = useState([]);
  const [reels, setReels] = useState([]);

  const deletePost = async postId => {
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/post/deletepost',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adviserid: user.userid,
            postid: postId,
          }),
        },
      );
      const jsonresponse = await response.json();
      console.log('Delete response:', jsonresponse);

      // Optionally update the UI after deleting the post
      setReels(reels.filter(post => post?.id !== postId));
      Alert.alert('Deleted', 'Your post has been deleted.');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete the post. Please try again.');
    }
  };

  const handleDeletePost = postId => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion canceled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deletePost(postId),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const getReels = async () => {
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/post/getpostsofadviser/${user.userid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const jsonresponse = await response.json();
    console.log('Hwos', jsonresponse);
    setReels(jsonresponse || []);

    // const total = jsonresponse.reduce(
    //   (acc, reel) => acc + (reel?.data?.views.length || 0),
    //   0,
    // );
    // setTotalViews(total);
  };
  useEffect(() => {
    getReels();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.postContainer}>
      {/* Video Section */}
      <View style={{flexDirection: 'row'}}>
        <Video
          source={{uri: item.data.post_file}} // Use video URL from API
          style={styles.video}
          controls={false}
          resizeMode="cover"
          muted
          paused
        />

        {/* Caption and Location */}
        <View style={styles.textContainer}>
          <Text style={styles.caption}>{item?.data?.description}</Text>
          <Text style={styles.location}>{item?.data?.location}</Text>
        </View>
      </View>

      {/* Delete Icon */}
      <TouchableOpacity
        style={styles.deleteIconContainer}
        onPress={() => handleDeletePost()}>
        <Icon name="trash" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#17191A',
      }}>
      {/* <View style={{
        paddingHorizontal:16,
        marginTop: 20,
      }}>
        <TouchableOpacity style={styles.postContainer}>
          {/* Video Section 
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Video
              source={postData.video}
              style={styles.video}
              controls={false}
              resizeMode="cover"
              muted
              paused
            />

            {/* Caption and Location 
            <View style={styles.textContainer}>
              <Text style={styles.caption}>{postData.caption}</Text>
              <Text style={styles.location}>{postData.location}</Text>
            </View>
          </View>

          {/* Delete Icon 
          <TouchableOpacity
            style={styles.deleteIconContainer}
            onPress={handleDeletePost}>
            <Icon name="trash" size={18} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View> */}
      <FlatList
        data={reels}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingHorizontal: 16, marginTop: 20}}
      />
    </SafeAreaView>
  );
};

export default DeletePost;

const styles = StyleSheet.create({
  postContainer: {
    // paddingHorizontal: 16,
    // marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    opacity: 0.9,
    borderRadius: 10,
  },
  video: {
    width: 75,
    height: 75,
    // borderRadius: 40,
    backgroundColor: '#000',
  },
  textContainer: {
    maxWidth: 200,
    marginLeft: 10,
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  location: {
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 3,
    fontFamily: 'Poppins-Regular',
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    // padding: 30,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    // borderRadius: 50,
  },
});
