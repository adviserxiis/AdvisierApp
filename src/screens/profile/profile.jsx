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
  Modal,
  Animated,
  Easing,
  Dimensions,
  TouchableWithoutFeedback,
  Linking,
  RefreshControl,
  Button,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Foundation';
import {useDispatch, useSelector} from 'react-redux';
import {clearData} from '../../utils/store';
import {clearUser} from '../../features/user/userSlice';
import Share from 'react-native-share';
import Video from 'react-native-video';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-virtualized-view';
const {width} = Dimensions.get('window');
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Card from './components/Card';
import {BlurView} from '@react-native-community/blur';
import PostItem from './components/Postitem';
import ServicesCard from './components/ServicesCard';
import BookingCard from './components/BookingCard';
import DateTimePicker from '@react-native-community/datetimepicker';
import SetAvailablity from './components/SetAvailablity';
import Card2 from './components/Card2';
import {RFValue} from 'react-native-responsive-fontsize';
import SkeletonLoading from './components/SkeletonLoading';
// import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

// const adUnitId = __DEV__
//   ? TestIds.BANNER
//   : 'ca-app-pub-1658613370450501/9624456266';

const reelItemWidth = width / 3; // Subtracting a small value for padding/gaps
const reelItemHeight = reelItemWidth * 1.7;

const Profile = ({route}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigation = useNavigation();
  const [details, setDetails] = useState(null);
  const [reels, setReels] = useState([]);
  const user = useSelector(state => state.user);
  const [posts, setPosts] = useState([]);
  const [services, setServices] = useState([]);
  // const [currentPlaying, setCurrentPlaying] = useState(null);
  // const [viewableItems, setViewableItems] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    description: '',
    interests: [],
    links: [],
    profileImage: null,
    bannerImage: null,
  });
  // console.log(user?.userid);
  // const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalYPosition] = useState(new Animated.Value(-200)); // Initial position off-screen
  const [modalOpacity] = useState(new Animated.Value(0));
  const [selectedMonth, setSelectedMonth] = useState('Jan Views');
  const [views, setViews] = useState('1K');
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const {initialTab} = route.params || {};
  const [activeTab, setActiveTab] = useState(initialTab || 'posts');
  const [visiblePostIndex, setVisiblePostIndex] = useState(null);
  const viewabilityConfig = {itemVisiblePercentThreshold: 50}; // Configure visibility threshold
  const [modalPopUp, setModalPopUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTab) {
      console.log('sbjdhjdbhh', initialTab);
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setVisiblePostIndex(viewableItems[0].index); // Set index of visible post
    }
  });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '553796556466-btiglu1cssg04entlq545n5bknsuqdef.apps.googleusercontent.com',
    });
  }, []);

  const showModal = () => {
    setModalVisible(true);
    Animated.timing(modalYPosition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(modalYPosition, {
      toValue: -200,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => setModalVisible(false));
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const dispatch = useDispatch();
  const logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('Logout canceled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // Ensure Google Sign-In is properly configured

              await GoogleSignin.hasPlayServices(); // Check if Google Play services are available
              const currentUser = auth().currentUser;
              if (currentUser) {
                const providerId = currentUser.providerData[0].providerId;

                // If the user logged in with Google
                if (providerId === 'google.com') {
                  await GoogleSignin.revokeAccess(); // Optional, revokes all Google permissions
                  await GoogleSignin.signOut();
                }

                // Sign out from Firebase (common for both email/password and Google)
                await auth().signOut();
              }

              console.log('Logput');

              await AsyncStorage.removeItem('user');
              // Clear local data (if any)
              // clearData();
              // Clear user data in Redux
              dispatch(clearUser());

              // navigation.dispatch(
              //   CommonActions.reset({
              //     index: 0,
              //     routes: [{ name: 'Login' }], // Use the correct route name here
              //   })
              // );
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const getuser = async () => {
    setLoading(true);
    try {
      // Fetch user info and profile data concurrently
      const [userInfo, storedProfileData] = await Promise.all([
        GoogleSignin.getCurrentUser(),
        AsyncStorage.getItem('user'),
      ]);

      // Parse and set profile data if available
      if (storedProfileData) {
        console.log('Fetching user data for ID:', user.userid);
        const profileData = JSON.parse(storedProfileData);
        setProfile(prev => ({
          ...prev,
          name: profileData.name || userInfo?.user?.name,
          title: profileData.professional_title || '',
          description: profileData.discription || '',
          interests: profileData.interests || [],
          links: profileData.social_links || [],
          profileImage:
            profileData.profile_photo || userInfo?.user.photo || null,
          bannerImage: profileData.profile_background || null,
        }));
      } else {
        console.log('User info is not available or user data is not stored.');
      }

      // Fetch user details
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/creator/getuser/${user.userid}`,
      );

      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check the content type of the response
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Expected JSON response');
      }

      // Parse JSON response
      const jsonResponse = await response.json();
      setDetails(jsonResponse);
      console.log(jsonResponse);
      const modalShown = await AsyncStorage.getItem('modalShown');
      if (modalShown === null && jsonResponse?.followers?.length < 100) {
        console.log('Modal pop up again');
        setModalPopUp(true);
        await AsyncStorage.setItem('modalShown', 'true');
      }
      return jsonResponse;
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // console.log('His');
      getuser();
      getReels();
      getServices();
    }, []),
  );

  const getServices = async () => {
    try {
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/service/getallservicesofadviser/${user.userid}`,
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

  // const handleMonthClick = () => {
  //   // Logic to handle month click, e.g., open a dropdown or modal to select different months.
  //   console.log('Month clicked');
  //   // For demonstration, we're toggling between Jan Views and Feb Views
  //   setSelectedMonth(selectedMonth === 'Jan Views' ? 'Feb Views' : 'Jan Views');
  //   setViews(views === '1K' ? '2K' : '1K');
  // };

  const shareProfile = async () => {
  // Replace `details?.username` with the appropriate property if it contains the username or unique ID
  const profileLink = `https://www.adviserxiis.com/profile/${details?.username}`;

  const shareOptions = {
    message: `Check out ${details?.username}'s profile on this amazing app Luink.ai!`,
    url: profileLink, // Use the deep link to redirect users to the profile screen
  };

  try {
    const result = await Share.open(shareOptions);
    if (result) {
      console.log('Shared successfully:', result);
    }
  } catch (error) {
    if (error.message) {
      console.log('Error:', error.message);
    } else if (error.dismissedAction) {
      console.log('Share dismissed');
    }
  }
};

  const getReels = async () => {
    console.log('Sshh');
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

    // if(jsonresponse.length === 0){
    //   setModalPopUp(true);
    // }
    setReels(jsonresponse || []);

    const total = jsonresponse.reduce(
      (acc, reel) => acc + (reel?.data?.views?.length || 0),
      0,
    );
    setTotalViews(total);

    const totalDuration = jsonresponse.reduce(
      (acc, reel) => acc + (reel?.data?.video_duration || 0), // Assuming duration is in seconds
      0,
    );
    setTotalDuration(totalDuration);
    return jsonresponse;
  };

  const [bookings, setBookings] = useState([]);

  const getBooking = async () => {
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/service/getbookingsofuser/${user?.userid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const jsonresponse = await response.json();
    console.log('Booking Details', jsonresponse.bookings);
    setBookings(jsonresponse?.bookings);
  };

  // useEffect(()=>{
  //   getBooking();
  // },[]);

  useFocusEffect(
    useCallback(() => {
      getBooking();
    }, []),
  );

  const contact = () => {
    navigation.navigate('FeedBack');
  };

  const deletePost = postid => {
    Alert.alert(
      'Delete Reel',
      'Are you sure you want to delete this reel?',
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

              // Fetch updated reels list after deletion
              getReels();

              const jsonResponse = await response.json();
              console.log('Reel deleted:', jsonResponse);

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
  // useEffect(() => {
  //   getReels();
  // }, []);

  const renderReelItem = ({item}) => (
    <TouchableOpacity
      style={styles.reelItem}
      onPress={() =>
        navigation.navigate('multipleReel', {
          video: item,
          creator: details,
          advsid: user.userid,
        })
      }>
      <Video
        source={{uri: item.data.post_file}} // Use video source
        style={styles.reelThumbnail}
        controls={false} // Display video controls
        resizeMode="cover"
        // repeat={true} onPress={()=>setCurrentPlaying(item.id)}
        muted
        paused={true}
        // paused={currentPlaying !== item.id}// Adjust video aspect ratio
      />
      <TouchableOpacity
        onPress={() => deletePost(item?.id)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}>
        <Icon2 name="trash" size={18} color="white" />
      </TouchableOpacity>
      {/* <Image
        source={{uri: item.data.post_file}} // Use image source
        style={styles.reelThumbnail}
        resizeMode="cover" // Adjust image aspect ratio
      /> */}
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true); // Start refreshing
    await getuser();
    await getReels();
    await getBooking();
    await getServices();
    setRefreshing(false); // Stop refreshing
  }, []);

  const getPostList = async () => {
    try {
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/post/gethomepostsofadviser/${user.userid}`,
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

  useFocusEffect(
    useCallback(() => {
      getPostList();
    }, []),
  );

  

  // const [isExpandeds, setIsExpandeds] = useState(false);
  // const animationValue = useRef(new Animated.Value(0)).current;
  // const rotateValue = useRef(new Animated.Value(0)).current;

  // const toggleFAB = () => {
  //   if (isExpanded) {
  //     // Collapse animation
  //     Animated.parallel([
  //       Animated.timing(animationValue, {
  //         toValue: 0,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(rotateValue, {
  //         toValue: 0,
  //         duration: 300,
  //         easing: Easing.linear,
  //         useNativeDriver: true,
  //       }),
  //     ]).start(() => {
  //       setIsExpanded(false);
  //     });
  //   } else {
  //     // Expand animation
  //     setIsExpanded(true);
  //     Animated.parallel([
  //       Animated.timing(animationValue, {
  //         toValue: 1,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(rotateValue, {
  //         toValue: 1,
  //         duration: 300,
  //         easing: Easing.linear,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   }
  // };

  // const slidePostOption = animationValue.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [50, 0], // Moves vertically (slide in/out)
  // });

  // const slideReelsOption = animationValue.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [100, 0], // Moves vertically (slide in/out)
  // });

  // const rotateIcon = rotateValue.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['0deg', '45deg'], // Rotate the plus icon into an X
  // });

  return (
    <>
      {
      loading ? (
        <SkeletonLoading/>
      ): (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['black']} // Set loading spinner color to white
            tintColor="transparent"
            progressBackgroundColor="white"
          />
        }>
        <StatusBar barStyle="light-content" backgroundColor="#17191A" />
        {/* Header Image */}
        {/* <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          networkExtras: {
            collapsible: 'top',
          },
        }}
        /> */}
        <View style={styles.headerContainer}>
          <Image
            source={
              details?.profile_background
                ? {uri: details?.profile_background}
                : require('../../assets/images/bane.png')
            }
            style={styles.headerImage}
          />
          <TouchableOpacity onPress={showModal}>
            <Icon1
              name="more-vert"
              size={24}
              color="white"
              style={styles.shareIcon}
            />
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="none"
          onRequestClose={hideModal}>
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={styles.modalOverlay}>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [{translateY: modalYPosition}],
                    opacity: modalOpacity,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    hideModal();
                    shareProfile();
                  }}>
                  <Icon1
                    name="share"
                    size={16}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    hideModal();
                    // logout();
                    contact();
                  }}>
                  <Icon1
                    name="support-agent"
                    size={16}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalText}>Contact Us</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    hideModal();
                    logout();
                  }}>
                  <Icon1
                    name="logout"
                    size={16}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalText}>Logout</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Profile Information */}
        <View style={styles.profileContainer}>
          <Image
            source={
              details?.profile_photo
                ? {uri: details?.profile_photo}
                : require('../../assets/images/profiles.png')
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
              onPress={() => navigation.navigate('updateProfile')}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 15,
          }}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 19,
              fontFamily: 'Poppins-Medium',
              color: 'white',
            }}>
            {details?.professional_title}
          </Text>
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

          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              gap: 10,
            }}>
            {details?.social_links?.instagram && (
              <TouchableOpacity
                onPress={() =>
                  handleLinkPress(details?.social_links?.instagram)
                }>
                <Image
                  source={require('../../assets/images/instagram.png')}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            )}
            {details?.social_links?.spotify && (
              <TouchableOpacity
                onPress={() => handleLinkPress(details?.social_links?.spotify)}>
                <Image
                  source={require('../../assets/images/spotify.png')}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            )}
            {/* {details?.social_links?.linkedin && (
              <TouchableOpacity
                onPress={() => handleLinkPress(details?.social_links?.spotify)}>
                <Image
                  source={require('../../assets/images/icons8-linkedin-48.png')}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            )}
            {details?.social_links?.twitter && (
              <TouchableOpacity
                onPress={() => handleLinkPress(details?.social_links?.spotify)}>
                <Image
                  source={require('../../assets/images/spotify.png')}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            )} */}
          </View>

          {/* <View style={{
            flexDirection: 'row',
            width:'100%',
            justifyContent: 'space-between',
            alignItems:'center',
          }}> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              flex: 1,
              borderRadius: 15,
              marginRight: 10,
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
                {reels?.length || 0}
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
          {/* <TouchableOpacity style={styles.monthView} onPress={handleMonthClick}>
              <Text style={styles.label}>{selectedMonth}</Text>
              <Text style={styles.value}>{views}</Text>
            </TouchableOpacity> */}
          {/* </View> */}

          {/* <TouchableOpacity onPress={logout}>
            <Text>Logout</Text>
          </TouchableOpacity> */}

          <Card
            followers={details?.followers?.length || 0}
            duration={totalDuration}
            service={services.length > 0}
            earnings={details?.earnings || 0}
          />

          {/* <Card2/> */}
        </View>

        <View style={styles.navbar}>
        {['posts', 'reels', 'services', 'booking'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.navButton, activeTab === tab && styles.activeNavButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.navText, activeTab === tab && styles.activeNavText]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

        {activeTab === 'reels' ? (
          reels?.length === 0 ? (
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
          posts?.length === 0 ? (
            <View style={styles.noPostsContainer}>
              <Text style={styles.noPostsText}>No posts available</Text>
            </View>
          ) : (
            <FlatList
              data={posts}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <PostItem
                  post={item}
                  isVisible={visiblePostIndex === index}
                  getPostlist={getPostList}
                />
              )}
              keyExtractor={item => item.id}
              onViewableItemsChanged={onViewableItemsChanged.current}
              viewabilityConfig={viewabilityConfig}
            />
          )
        ) : activeTab === 'services' ? (
          services?.length === 0 ? (
            <View style={styles.noReelsContainer}>
              <Text style={styles.noReelsText}>No services available</Text>
            </View>
          ) : (
            <FlatList
              data={services}
              ListHeaderComponent={<SetAvailablity />}
              renderItem={({item}) => (
                <ServicesCard service={item} servicelist={getServices} />
              )}
              keyExtractor={item => item.serviceid}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.servicesList}
            />
          )
        ) : activeTab === 'booking' ? (
          bookings?.length === 0 ? (
            <View style={styles.noPostsContainer}>
              <Text style={styles.noPostsText}>No bookings available</Text>
            </View>
          ) : (
            <FlatList
              data={bookings}
              renderItem={({item}) => <BookingCard booking={item} />}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.bookingsList}
            />
          )
        ) : null}

        {/* <View style={styles.reelsSection}>
          {reels?.length === 0 ? (
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

        {modalPopUp && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalPopUp}
            onRequestClose={() => {
              setModalPopUp(!modalPopUp);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../../assets/images/rupees.png')}
                    resizeMethod="contain"
                    style={{
                      width: 80,
                      height: 80,
                    }}
                  />
                </View>

                {/* Notification Text */}
                <Text style={styles.mainText}>
                  You're just{' '}
                  <Text style={styles.boldText}>
                    {100 - details?.followers?.length || 0} followers
                  </Text>{' '}
                  away to <Text style={styles.boldText}>start earning!</Text>
                </Text>
                <Text style={styles.subText}>
                  Keep going—create more content to get there!
                </Text>

                {/* Button */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalPopUp(false)}>
                  <Text style={styles.buttonText}>Create Content</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
       )
    } 
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  label: {
    color: '#9C9C9C',
    fontSize: 10,
    lineHeight: 15,
    fontFamily: 'Poppins-Medium',
  },
  value: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Poppins-Medium',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    // Semi-transparent background
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: '#17191A',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 10,
    elevation: 5,
    width: '40%',
    top: 40, // Fixed for testing
    right: 15, // Fixed for testing
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
  },
  modalIcon: {
    marginRight: 10, // Space between icon and text
  },
  modalText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
    position: 'absolute',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  servicesList: {
    // paddingHorizontal:10,
    // paddingVertical:5,
  },
  monthView: {
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
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
    width: width * 0.25,
    height: width * 0.25,
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
    maxWidth: 140,
  },
  profileName: {
    fontSize: RFValue(14),
    color: 'white',
    fontFamily: 'Poppins-Medium',
    lineHeight: 21,
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
  profileRole: {
    fontSize: RFValue(10),
    color: '#fff',
    opacity: 0.5,
    lineHeight: 15,
    fontFamily: 'Poppins-Regular',
  },
  editProfileText: {
    fontSize: width * 0.035,
    color: '#0069B4',
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
    textDecorationLine: 'underline',
  },
  readMoreText: {
    fontSize: 12,
    color: '#0069B4',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  reelsSection: {
    marginTop: 20,
  },
  reelColumnWrapper: {
    justifyContent: 'flex-start',
    gap: 2,
    // gap: 1, // Add gap between columns
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    marginBottom: 10,
  },
  reelsList: {
    gap: 1,
  },
  reelItem: {
    // marginRight: 10,
    // borderRadius: 10,
    // overflow: 'hidden',
    // width: '33%',
    // position: 'relative',
    // gap: 1,

    marginBottom: 2,
    width: reelItemWidth,
    height: reelItemHeight,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  reelThumbnail: {
    aspectRatio: 9 / 16,
    // width: '100%',
    // height: '100%',
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
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 10,
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
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 10,
  },
  currencySymbol: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  mainText: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  boldText: {
    fontFamily: 'Poppins-Bold',
  },
  subText: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#0069B4',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});

export default Profile;
