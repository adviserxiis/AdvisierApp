import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useState,
  forwardRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

export type Ref = BottomSheetModal;

const LeadershipBoard = forwardRef<Ref>((props, ref) => {
  const {dismiss} = useBottomSheetModal();
  // const [profilePhoto, setProfilePhoto] = useState(null);
  const {bottom} = useSafeAreaInsets();
  const [leader, setLeader] = useState([]);
  const snapPoints = useMemo(() => ['92.5%', '100%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.4}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={dismiss}
      />
    ),
    [],
  );

  const navigation = useNavigation();

  const [contestId, setContestId] = useState(null);
  // console.log(contestId);

  useEffect(() => {
    const getContestId = async () => {
      try {
        const value = await AsyncStorage.getItem('Contest_detail');
        if (value !== null) {
          // Value exists in AsyncStorage
          setContestId(value);
          // console.log('Retrieved contestId:', value);
        }
      } catch (error) {
        console.error('Error retrieving contestId from AsyncStorage:', error);
      }
    };

    getContestId(); // Fetch contestId on screen load
  }, []);

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
    setLeader(jsonResponse.leaderboard);
    console.log('LeaderBoardDetails', jsonResponse);
  };

  useFocusEffect(
    useCallback(() => {
      if (contestId) {
        Leaderboard();
      }
      
    }, [contestId])
  );
  

  const [refreshing, setRefreshing] = useState(false);

  // Function to refresh leaderboard data
  const onRefresh = async () => {
    setRefreshing(true);
    await Leaderboard();
    setRefreshing(false); // Stop the refreshing
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleComponent={null}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => dismiss()}>
            <Icon name="keyboard-arrow-left" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Leadership Board</Text>
          <View />
        </View>
        <BottomSheetScrollView
          contentContainerStyle={{paddingBottom: 20}}
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
          {leader?.length > 0 ? ( // Check if leader has items
            leader.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: 16,
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  <Image
                    source={
                      item?.profile_photo
                        ? {uri: item?.profile_photo}
                        : require('../../../assets/images/profiles.png')
                    }
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                    }}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      maxWidth: 110,
                    }}>
                    {item?.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 10,
                        fontFamily: 'Poppins-Medium',
                        letterSpacing: 0.6,
                        opacity: 0.5,
                      }}>
                      Rank
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Bold',
                        fontSize: 14,
                        color: 'white',
                      }}>
                      {index+1}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 10,
                        fontFamily: 'Poppins-Medium',
                        letterSpacing: 0.6,
                        opacity: 0.5,
                      }}>
                      Likes
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Bold',
                        fontSize: 14,
                        color: 'white',
                      }}>
                      {item?.likes?.length || 0}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      dismiss();

                      navigation.navigate('ContestReelView', {video: item});
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      backgroundColor: '#0069B4',
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontFamily: 'Poppins-Regular',
                      }}>
                      View Reel
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <Text style={{color: 'white', textAlign: 'center'}}>
              No leaderboard data available.
            </Text>
          )}
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
});

export default LeadershipBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A', // Dark background
    // paddingBottom: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    // To accommodate safe area insets
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
});
