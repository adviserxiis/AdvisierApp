import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  Dimensions,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
// import {clearData} from '../../utils/store';
import {clearUser} from '../../features/user/userSlice';
import Share from 'react-native-share';
import Video from 'react-native-video';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-virtualized-view';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import PostItems from '../../home/components/PostItems';
import ServicesCard from '../../profile/components/ServicesCard';
import CreatroService from '../components/CreatroService';
import SkeletonLoading from '../../profile/components/SkeletonLoading';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-1658613370450501/4940380881';
// const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3940256099942544/9214589741';

const {width} = Dimensions.get('screen');
const reelItemWidth = width / 3; // Subtracting a small value for padding/gaps
const reelItemHeight = reelItemWidth * 1.7;

const ViewProfile = () => {
  const route = useRoute();
  const advsid = route.params;
  console.log('useid', advsid);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigation = useNavigation();
  const [details, setDetails] = useState(null);
  const [reels, setReels] = useState([]);
  const [loading,setLoading] = useState(true);
  const user = useSelector(state => state.user);
  const [isFollowing, setIsFollowing] = useState(false);
  // const [currentPlaying, setCurrentPlaying] = useState(null);
  // const [viewableItems, setViewableItems] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [interests, setInterests] = useState([]);
  const [links, setLinks] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [activeTab, setActiveTab] = useState('reels');
  const [posts, setPosts] = useState([]);
  const [visiblePostIndex, setVisiblePostIndex] = useState(null);
  const viewabilityConfig = {itemVisiblePercentThreshold: 50}; // Configure visibility threshold

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setVisiblePostIndex(viewableItems[0].index); // Set index of visible post
    }
  });

  const [services, setServices] = useState([]);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const dispatch = useDispatch();
  //   const logout = () => {
  //     clearData();
  //     dispatch(clearUser());
  //     navigation.navigate('Login');
  //   };

  const getuser = async () => {
    setLoading(true);
    try {
      const storedProfileData = await AsyncStorage.getItem('user');
      if (storedProfileData) {
        const profileData = JSON.parse(storedProfileData);
        setName(profileData.name || '');
        setTitle(profileData.professional_title || '');
        setDescription(profileData.discription || '');
        setInterests(profileData.interests || []);
        setLinks(profileData.social_links || []);
        setProfileImage(profileData.profile_photo || null);
        setBannerImage(profileData.profile_background || null);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }

    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/creator/getuser/${advsid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const jsonresponse = await response.json();
    console.log('hsjs', jsonresponse);

    setDetails(jsonresponse);
    setIsFollowing(jsonresponse?.followers?.includes(user.userid));
    // setReels(jsonresponse.reels || []);
    // console.log("hah",response);
    // console.log('jsj',user.userid);
    setLoading(false);
  };

  useEffect(() => {
    getuser();
  }, [isFollowing]);

  const shareProfile = async () => {
    const shareOptions = {
      message: `Check out ${details?.username} profile on this amazing Luink.ai!`,
      url: 'https://play.google.com/store/apps/details?id=com.advisiorapp', // Replace with your actual URL
    };

    try {
      const result = await Share.open(shareOptions);
      if (result) {
        console.log('Shared successfully:', result);
      }
    } catch (error: any) {
      if (error.message) {
        // Alert.alert('Error', error.message);
      } else if (error.dismissedAction) {
        console.log('Share dismissed');
      }
    }
  };

  const getReels = async () => {
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/post/getpostsofadviser/${advsid}`,
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

    const total = jsonresponse.reduce(
      (acc, reel) => acc + (reel.data?.views?.length || 0),
      0,
    );
    setTotalViews(total);
  };
  useEffect(() => {
    getReels();
  }, []);

  const followUser = async () => {
    const userObjectString = await AsyncStorage.getItem('user');
    let userObject = null;

    if (userObjectString) {
      userObject = JSON.parse(userObjectString); // Parse the JSON string to an object
      console.log('User', userObject.name);
    }
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/followcreator',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adviserid: advsid,
            followerid: user.userid,
          }),
        },
      );
      const jsonresponse = await response.json();
      console.log('Follow response', jsonresponse);

      if (response.ok) {
        console.log('higg');
        setIsFollowing(true);
        const NotificationResponse = await fetch(
          'https://adviserxiis-backend-three.vercel.app/notification/sendnotification',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              deviceToken: details?.device_token,
              title: 'Following Update',
              body: `${userObject?.name} started following you!!`,
            }),
          },
        );
        const jsonresponse = await NotificationResponse.json();
        console.log('Follow response', jsonresponse);
      } else {
        console.error('Failed to follow:', response.statusText);
      }
    } catch (error) {
      console.error('Error in follow request:', error);
    }
  };

  const unfollowUser = async () => {
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/unfollowcreator',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adviserid: advsid,
            followerid: user.userid,
          }),
        },
      );
      const jsonresponse = await response.json();
      console.log('UnFollow response', jsonresponse);

      if (response.ok) {
        console.log('higga');
        setIsFollowing(false);
      } else {
        console.error('Failed to unfollow:', response.statusText);
      }
    } catch (error) {
      console.error('Error in unfollow request:', error);
    }
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser();
    } else {
      followUser();
    }
  };

  const getServices = async () => {
    try {
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/service/getallservicesofadviser/${advsid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Services', data);

      // Check if data.services exists before setting state
      if (data?.services) {
        setServices(data.services); // Assuming data.services is an array
      } else {
        console.error('No services found in the response');
      }
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error('Failed to fetch services:', error);
    }
  };

  // useEffect(()=>{
  // },[]);

  useFocusEffect(
    useCallback(() => {
      // getPostList();
      getServices();
    }, []),
  );

  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9); // Default aspect ratio

  const handleLoad = data => {
    // Calculate the aspect ratio
    const {width, height} = data.naturalSize;
    setVideoAspectRatio(width / height);
  };

  // Determine the resize mode based on the aspect ratio
  const resizeMode = videoAspectRatio >= 1 ? 'contain' : 'cover';

  const renderReelItem = ({item}) => (
    <TouchableOpacity
      style={styles.reelItem}
      onPress={() =>
        navigation.navigate('multipleReel', {
          video: item,
          creator: details,
          advsid: advsid,
        })
      }>
      <Video
        source={{uri: item.data.post_file}} // Use video source
        style={styles.reelThumbnail}
        controls={false} // Display video controls
        resizeMode={resizeMode}
        muted
        paused={true}
        // onLoad={handleLoad}
      />
      <View style={styles.reelInfo}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
          }}>
          <Icon
            name="heart"
            size={10}
            color="white"
            style={{
              marginTop: -3,
            }}
          />
          <Text style={styles.reelText}>{item?.data?.likes?.length || 0} </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}>
          <Icon
            name="play"
            size={10}
            color="white"
            style={{
              marginTop: -3,
            }}
          />
          <Text style={styles.reelText}>{item?.data?.views?.length || 0} </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // const onViewableItemsChanged = ({ viewableItems }) => {
  //   setViewableItems(viewableItems);
  //   if (viewableItems.length > 0) {
  //     setCurrentPlaying(viewableItems[0].item.id);
  //   }
  // };

  // const viewabilityConfig = {
  //   itemVisiblePercentThreshold: 60,
  // };

  const getPostList = async () => {
    try {
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/post/gethomepostsofadviser/${advsid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const jsonResponse = await response.json();
      console.log('SJisis', jsonResponse);
      setPosts(jsonResponse);
    } catch (error) {
      console.error('Error fetching video list:', error);
    }
  };

  useEffect(() => {
    getPostList();
  }, []);

  const handleLinkPress = url => {
    if (url) {
      // Ensure the URL has the correct scheme
      const validUrl =
        url.startsWith('http://') || url.startsWith('https://')
          ? url
          : `https://${url}`;

      Linking.openURL(validUrl).catch(err => {
        console.error('Failed to open URL:', err);
        Alert.alert('Error', 'Failed to open the link.');
      });
    }
  };

  useEffect(() => {
    const getPostList = async () => {
      try {
        const response = await fetch(
          `https://adviserxiis-backend-three.vercel.app/post/gethomepostsofadviser/${advsid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const jsonResponse = await response.json();
        console.log('SJisis', jsonResponse);
        setPosts(jsonResponse);
      } catch (error) {
        console.error('Error fetching video list:', error);
      }
    };
    getPostList();
  }, []);

  return (
    <>
      {loading ? (
        <SkeletonLoading />
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <StatusBar barStyle="light-content" backgroundColor="#17191A" />
          {/* Header Image */}
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
          <View style={styles.headerContainer}>
            <Image
              source={
                details?.profile_background
                  ? {uri: details.profile_background}
                  : require('../../../assets/images/bane.png')
              }
              style={styles.headerImage}
            />

            {/* <TouchableOpacity onPress={()}>
            <Icon1
              name="share"
              size={24}
              color="white"
              style={styles.shareIcon}
            />
          </TouchableOpacity> */}
            <TouchableOpacity onPress={shareProfile}>
              <Icon1
                name="share"
                size={24}
                color="white"
                style={styles.shareIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Profile Information */}
          <View style={styles.profileContainer}>
            <Image
              source={
                details?.profile_photo
                  ? {uri: details.profile_photo}
                  : require('../../../assets/images/profiles.png')
              }
              style={styles.profileImage}
            />
            <View style={styles.profileDetails}>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>{details?.username}</Text>
                <Text style={styles.profileRole} numberOfLines={2}>
                  {details?.professional_title}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  {
                    backgroundColor: isFollowing ? '#17191A' : '#388DEB',
                    borderColor: isFollowing ? '#388DEB' : 'transparent',
                    borderWidth: isFollowing ? 1 : 0,
                  },
                ]}
                onPress={handleFollowToggle}>
                <Text
                  style={[
                    styles.editProfileText,
                    {
                      color: isFollowing ? '#388DEB' : 'white',
                    },
                  ]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              marginTop: 15,
            }}>
            {details?.professional_title && (
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 19,
                  fontFamily: 'Poppins-Medium',
                  color: 'white',
                }}>
                {details?.professional_title}
              </Text>
            )}
            {details?.professional_bio && (
              <Pressable onPress={toggleDescription}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                    color: '#9C9C9C',
                    lineHeight: 16,
                    marginTop: 4,
                  }}
                  numberOfLines={isExpanded ? 0 : 2}>
                  {details?.professional_bio}
                </Text>
              </Pressable>
            )}

            <View
              style={{
                // marginVertical: 20,
                flexDirection: 'row',
                gap: 10,
              }}>
              {details?.social_links?.instagram && (
                <View
                  style={{
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      handleLinkPress(details?.social_links?.instagram)
                    }>
                    <Image
                      source={require('../../../assets/images/instagram.png')}
                      style={{width: 32, height: 32}}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {details?.social_links?.spotify && (
                <View
                  style={{
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      handleLinkPress(details?.social_links?.spotify)
                    }>
                    <Image
                      source={require('../../../assets/images/spotify.png')}
                      style={{width: 32, height: 32}}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                borderRadius: 15,
                marginTop: 10,
              }}>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#9C9C9C',
                    fontSize: 10,
                    letterSpacing: 1,
                    fontFamily: 'Poppins-Regular',
                    lineHeight: 15,
                  }}>
                  Followers
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#ffffff',
                    fontFamily: 'Poppins-Medium',
                    lineHeight: 21,
                    letterSpacing: 1,
                    marginTop: 2,
                  }}>
                  {details?.followers?.length || 0}
                </Text>
              </View>
              <View
                style={{
                  height: 35,
                  width: 1,
                  backgroundColor: 'gray',
                }}
              />
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#9C9C9C',
                    fontSize: 10,
                    letterSpacing: 1,
                    fontFamily: 'Poppins-Regular',
                    lineHeight: 15,
                  }}>
                  Reels
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'white',
                    lineHeight: 21,
                    fontFamily: 'Poppins-Medium',
                    marginTop: 2,
                    letterSpacing: 1,
                  }}>
                  {reels.length || 0}
                </Text>
              </View>
              <View
                style={{
                  height: 35,
                  width: 1,
                  backgroundColor: 'gray',
                }}
              />
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#9C9C9C',
                    fontSize: 10,
                    letterSpacing: 1,
                    fontFamily: 'Poppins-Regular',
                    lineHeight: 15,
                  }}>
                  Views
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'white',
                    lineHeight: 21,
                    fontFamily: 'Poppins-Medium',
                    marginTop: 2,
                    letterSpacing: 1,
                  }}>
                  {totalViews || 0}
                </Text>
              </View>
            </View>

            {/* <TouchableOpacity onPress={logout}>
            <Text>Logout</Text>
          </TouchableOpacity> */}
          </View>

          <View style={styles.navbar}>
            <TouchableOpacity
              style={[
                styles.navButton,
                activeTab === 'posts' && styles.activeNavButton,
              ]}
              onPress={() => setActiveTab('posts')}>
              <Text
                style={[
                  styles.navText,
                  activeTab === 'posts' && styles.activeNavText,
                ]}>
                POSTS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                activeTab === 'reels' && styles.activeNavButton,
              ]}
              onPress={() => setActiveTab('reels')}>
              <Text
                style={[
                  styles.navText,
                  activeTab === 'reels' && styles.activeNavText,
                ]}>
                REELS
              </Text>
              {/* <Icon name="play" size={24} color={activeTab === 'reels' ? '#407BFF' : '#ccc'} /> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                activeTab === 'services' && styles.activeNavButton,
              ]}
              onPress={() => setActiveTab('services')}>
              <Text
                style={[
                  styles.navText,
                  activeTab === 'services' && styles.activeNavText,
                ]}>
                SERVICES
              </Text>
              {/* <Icon name="play" size={24} color={activeTab === 'reels' ? '#407BFF' : '#ccc'} /> */}
            </TouchableOpacity>
          </View>

          {activeTab === 'reels' ? (
            reels.length === 0 ? (
              <View style={styles.noReelsContainer}>
                <Text style={styles.noReelsText}>No reels uploaded</Text>
              </View>
            ) : (
              <FlatList
                data={reels}
                renderItem={renderReelItem}
                keyExtractor={item => item.id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.reelsList}
                columnWrapperStyle={styles.reelColumnWrapper}
              />
            )
          ) : activeTab === 'posts' ? (
            posts.length === 0 ? (
              <View style={styles.noPostsContainer}>
                <Text style={styles.noPostsText}>No posts available</Text>
              </View>
            ) : (
              <FlatList
                data={posts}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <PostItems
                    post={item}
                    isVisible={visiblePostIndex === index}
                    getpost={getPostList}
                  />
                )}
                keyExtractor={item => item.id}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={viewabilityConfig}
              />
            )
          ) : activeTab === 'services' ? (
            services.length === 0 ? (
              <View style={styles.noReelsContainer}>
                <Text style={styles.noReelsText}>No services available</Text>
              </View>
            ) : (
              <FlatList
                data={services}
                renderItem={({item}) => <CreatroService service={item} />}
                keyExtractor={item => `${item.serviceid}-${item.adviserid}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.servicesList}
              />
            )
          ) : null}

          {/* <View style={styles.reelsSection}>
          {reels.length === 0 ? (
            <View style={styles.noReelsContainer}>
              <Text style={styles.noReelsText}>No reels uploaded</Text>
            </View>
          ) : (
            <FlatList
              data={reels}
              renderItem={renderReelItem}
              keyExtractor={item => item.id}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.reelsList}
              columnWrapperStyle={styles.reelColumnWrapper}
              // onViewableItemsChanged={onViewableItemsChanged}
              // viewabilityConfig={viewabilityConfig}
            />
          )}
        </View> */}
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
  },
  followButton: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
    position: 'absolute',
  },
  shareIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  profileContainer: {
    paddingHorizontal: 20,
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 50,
    borderColor: '#17191A',
    borderWidth: 2,
    backgroundColor: 'white',
  },
  profileDetails: {
    flex: 1,
    marginLeft: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 70,
  },
  profileTextContainer: {
    maxWidth: 130,
  },
  profileName: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    lineHeight: 21,
  },
  noReelsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  noReelsText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  servicesList: {
    // paddingHorizontal:10,
    // paddingVertical:5,
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noPostsText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  profileRole: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.5,
    lineHeight: 14,
    fontFamily: 'Poppins-Regular',
  },
  editProfileText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
  },
  readMoreText: {
    fontSize: 12,
    color: '#0069B4',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  reelsSection: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  reelColumnWrapper: {
    justifyContent: 'flex-start',
    // gap: 2,
    // gap: 1, // Add gap between columns
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    marginBottom: 10,
  },
  reelsList: {
    // paddingVertical: 10,
    // gap: 1,
  },
  reelItem: {
    // marginRight: 10,
    // borderRadius: 10,
    // overflow: 'hidden',
    // width: '33%',
    // position: 'relative',
    // gap: 1,
    margin: 1,
    width: reelItemWidth,
    height: reelItemHeight,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  reelThumbnail: {
    // width: '100%',
    // height: '100%',
    aspectRatio: 9 / 16,
    // flex:1
  },
  reelInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, // Add a semi-transparent background for better visibility
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  reelText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeNavButton: {
    borderBottomColor: '#0069B4',
    borderBottomWidth: 2,
    borderRadius: 2,
  },
  activeNavText: {
    color: '#0069B4', // Text color for active tab
  },
  navText: {
    color: '#fff',
  },
});

export default ViewProfile;
