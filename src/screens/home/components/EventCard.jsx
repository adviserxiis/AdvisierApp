import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LeadershipBoard from '../screen/LeadershipBoard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import Share from 'react-native-share';

const EventCard = () => {
  const LeadershipBoardRef = useRef(null); // No TypeScript type annotation in JS

  const handlePresentEventModal = () => {
    LeadershipBoardRef.current?.present(); // Present the modal
  };

  const [contestdetail, setContestDetail] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [modalpopup, setModalPopUp] = useState(false);
  const [modalpopup1, setModalPopUp1] = useState(false);

  useEffect(() => {
    const fourHoursInMs = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

    const intervalId = setInterval(() => {
      setModalPopUp(true);
    }, fourHoursInMs);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const oneHoursInMs = 1 * 60 * 60 * 1000; // 4 hours in milliseconds

    const intervalId = setInterval(() => {
      setModalPopUp1(true);
    }, oneHoursInMs);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const handleJoin = () => {
    setHasJoined(true);
    console.log('Joined the contest');
    navigation.navigate('ContestReelUpload');
    // setModalPopUp(true);
    // setHasJoined(false);
  };

  const viewLeaderBoard = () => {
    setModalPopUp(false);
    console.log('View LeaderBoard');
    handlePresentEventModal();
    // setHasJoined(false);
  };

  const user = useSelector(state => state.user);

  useEffect(() => {
    contestdetial();
  }, []);

  const contestdetial = async () => {
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/contest/getongoingcontest',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const jsonresponse = await response.json();
      const contestid = jsonresponse?.contestId;

      if (contestid) {
        await AsyncStorage.setItem('Contest_detail', contestid); // Awaiting the setItem call
        console.log('Contest ID set in AsyncStorage:', contestid);
      }

      setContestDetail(jsonresponse);
      console.log('Event Contest:', jsonresponse);
      if (jsonresponse?.contestDetails?.participants?.includes(user.userid)) {
        setHasJoined(true);
        // return false;
      }
    } catch (error) {
      console.error('Error fetching or setting contest details:', error);
    }
  };

  const navigation = useNavigation();

  const shareProfile = async () => {
    const storedProfileData = await AsyncStorage.getItem('user');
    const profileData = JSON.parse(storedProfileData);
    console.log('Profile Data', profileData.name);
    const shareOptions = {
      message: `Check out ${profileData?.name} profile on this amazing Luink.ai!`,
      url: 'https://play.google.com/store/apps/details?id=com.advisiorapp', // Replace with your actual URL
    };
    try {
      setModalPopUp1(false);
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

  function formatDate(dateString) {
    if (!dateString) {
      return 'Invalid date'; // Handle the case where dateString is undefined or null
    }
  
    // Split the input date string into day, month, and year
    const parts = dateString.split("-");
    const date = new Date(parts[2], parts[1] - 1, parts[0]); // Create a Date object
  
    // Define options for formatting the date
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
  
    // Format the date to "30 Sep 2024"
    return date.toLocaleDateString('en-GB', options);
  }

  const [name, setName] = useState('');

  const Leaderboard = async () => {
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/contest/getleaderboard/${contestId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  
    const jsonResponse = await response.json();
    setName(jsonResponse.leaderboard[0]?.name || 'No leader found'); // Default message if no leader
    console.log('LeaderBoardDetails', jsonResponse);
  };
  
  useFocusEffect(
    useCallback(() => {
      if (contestId) {
        Leaderboard();
      }
    }, [contestId])
  );
  

  const [contestId, setContestId] = useState(null);
  console.log(contestId);

  useEffect(() => {
    const getContestId = async () => {
      try {
        const value = await AsyncStorage.getItem('Contest_detail');
        if (value !== null) {
          // Value exists in AsyncStorage
          setContestId(value);
          console.log('Retrieved contestId:', value);
        }
      } catch (error) {
        console.error('Error retrieving contestId from AsyncStorage:', error);
      }
    };

    getContestId(); // Fetch contestId on screen load
  }, []);

  return (
    <View
      style={{
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#333',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
      <ImageBackground
        source={require('../../../assets/images/newcontest.png')}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.23,
          padding: 5,
        }}
        resizeMode="cover">
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            marginBottom: 10,
            fontFamily: 'Montserrat-Bold',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}>
          {!hasJoined
            ? `${contestdetail?.contestDetails?.name}`
            : "You're In! Your Reel is Live!"}
        </Text>

        <View
          style={{
            paddingHorizontal: 10,
            maxWidth: 250,
            marginTop: 5,
          }}>
          {!hasJoined ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  •
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {contestdetail?.contestDetails?.description}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  •
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Prize -{' '}
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                    }}>
                    {contestdetail?.contestDetails?.prize_money}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  •
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Deadline -{' '}
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                    }}>
                    {formatDate(contestdetail?.contestDetails?.last_date)}
                  </Text>
                </Text>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  •
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Share your reel to get more likes.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  •
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Track your and other participants ranking and total likes.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  •
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Highest likes win rewards!
                </Text>
              </View>
            </>
          )}
          {/* <View
            style={{
              flexDirection: 'row',
              gap: 8,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
              }}>
              •
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
              }}>
              When user upload video for challenge, it should give sign to share
              video
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
              }}>
              •
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
              }}>
              Price -{' '}
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                }}>
                ₹1000
              </Text>
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
              }}>
              •
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
              }}>
              Deadline -{' '}
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                }}>
                30 Sept 2024
              </Text>
            </Text>
          </View> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            marginTop: 10,
            gap: 8,
          }}>
          {!hasJoined ? (
            <>
              <Pressable
                onPress={
                  // () => navigation.navigate('CreatePost')
                  handleJoin
                }
                style={{
                  backgroundColor: 'white',
                  paddingVertical: 3,
                  paddingHorizontal: 12,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: '#FFFFFF',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 11,
                    fontFamily: 'Poppins-Regular',
                    marginTop: 2,
                  }}>
                  Join Challenge
                </Text>
              </Pressable>
              <Pressable
                onPress={handlePresentEventModal}
                style={{
                  backgroundColor: '#6A3D9A',
                  paddingVertical: 3,
                  paddingHorizontal: 12,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: '#FFFFFF',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 11,
                    fontFamily: 'Poppins-Regular',
                    marginTop: 2,
                    // textAlign:'center',
                  }}>
                  Leadership board
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* <TouchableOpacity
                onPress={
                  // () => navigation.navigate('CreatePost')
                  handleJoin
                }
                style={{
                  backgroundColor: 'white',
                  paddingVertical: 3,
                  paddingHorizontal: 12,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: '#FFFFFF',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 11,
                    fontFamily: 'Poppins-Regular',
                    marginTop: 2,
                  }}>
                  Join Challenge
                </Text>
              </TouchableOpacity> */}
              <Pressable
                onPress={viewLeaderBoard}
                style={{
                  backgroundColor: '#6A3D9A',
                  paddingVertical: 3,
                  paddingHorizontal: 12,
                  borderRadius: 15,
                  borderWidth: 1,
                  width: 220,
                  borderColor: '#FFFFFF',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 11,
                    fontFamily: 'Poppins-Regular',
                    marginTop: 2,
                    textAlign: 'center',
                  }}>
                  View Leadership board
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ImageBackground>
      <LeadershipBoard ref={LeadershipBoardRef} />
      {modalpopup && hasJoined && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalpopup}
          onRequestClose={() => {
            setModalPopUp(!modalpopup);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* Icon */}
              {/* <View style={styles.iconContainer}>
              <Image
                source={require('../../../assets/images/contestimg.png')}
                style={{
                  width: 80,
                  objectFit: 'contain',
                  height: 80,
                }}
              />
            </View> */}

              {/* Notification Text */}

              <Text style={styles.boldText}>Leaderboard Update</Text>

              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Poppins-Medium',
                    color: '#0069B4',
                    fontSize: 16,
                    textDecorationLine:'underline'
                  }}>
                  @{name}
                </Text>
                <Text style={styles.subText}>
                  is currently leading the challenge!
                </Text>
              </View>

              {/* Button */}
              <TouchableOpacity style={styles.button} onPress={viewLeaderBoard}>
                <Text style={styles.buttonText}>View Leaderboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {modalpopup1 && hasJoined && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalpopup1}
          onRequestClose={() => {
            setModalPopUp1(!modalpopup1);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../../assets/images/sharenow.png')}
                  style={{
                    width: 80,
                    objectFit: 'contain',
                    height: 80,
                  }}
                />
              </View>

              {/* Notification Text */}

              <Text style={styles.boldText}>
                Share your challenge reel and get more votes to win!
              </Text>

              <Text style={styles.subText}>
              The more you share, the closer you get to the top!
              </Text>

              {/* Button */}
              <TouchableOpacity style={styles.button} onPress={shareProfile}>
                <Text style={styles.buttonText}>Share Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({
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
    padding: 25,
    flexDirection: 'column',
    gap: 24,
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
  subText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    // marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  boldText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    // textDecorationLine: 'underline',
    color: 'white',
    textAlign: 'center',
    // marginBottom: 10,
    // marginTop:20,
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
