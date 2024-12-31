import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  // ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ScrollView} from 'react-native-virtualized-view';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import {RAZERPAY_KEY_ID} from '@env';
import {useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import ZegoExpressEngine from 'zego-express-engine-reactnative';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import DateBox from '../components/DateBox';
import TimeSlot from '../components/TimeSlot';
import CheckOutButton from '../components/CheckOutButton';

const KnowMore = () => {
  const route = useRoute();
  // const {service} = route.params;
  // const user = useSelector((state: any) => state.user);
  const {service, serviceid, adviser} = route.params;
  const navigation = useNavigation();
  console.log('Servicd', serviceid);
  console.log('Abdvk', adviser);
  const [ShowModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slot, setSlot] = useState([]);
  const [loading, setLoading] = useState(false);
  // const route = useRoute();
  const user = useSelector((state: any) => state.user);
  // const {service} = route.params;
  // console.log(service?.adviserid);
  // console.log(RAZERPAY_KEY_ID);
  // console.log(user?.userInfo?.name);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#17191A',
      },
      headerShadowVisible: false,
      title: '',
      headerTintColor: 'white',
    });
  }, [navigation]);

  const bottomSheetRef = useRef(null);

  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  function convertMinutesToHours(minutes) {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60); // Get the number of full hours
    const remainingMinutes = minutes % 60; // Get the remaining minutes

    // If no remaining minutes, just return hours, otherwise append minutes
    if (remainingMinutes === 0) {
      return `${hours} hr${hours > 1 ? '' : ''}`; // Pluralize 'Hr' if needed
    } else {
      return `${hours} hr${hours > 1 ? '' : ''} ${remainingMinutes} Min`;
    }
  }

  const [date, setDate] = useState([]);
  const [time, setTime] = useState([]);

  const getAvailable = async () => {
    setLoading(true);
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/service/getavailabledays/${service?.adviserid}`,
      {
        method: 'GET',
      },
    );
    const data = await response.json();
    console.log('Hsi', data.availability);
    setDate(data.availability);
    setTime(data.availability);
    setLoading(false);
  };

  useEffect(() => {
    getAvailable();
  }, []);
  console.log('Service', service);

  const fetchSlots = async (date, timing, item) => {
    setScheduleDate(date);
    const response = await fetch(
      'https://adviserxiis-backend-three.vercel.app/service/getavailabletimeslots',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration: service?.duration,
          timing: timing,
          // item: item,
          scheduledDate: date,
          adviserid: service?.adviserid,
        }),
      },
    );
    const jsonresponse = await response.json();
    setSelectedDate(item);
    console.log('Slot', jsonresponse);
    setSlot(jsonresponse?.availableSlots);
    console.log(jsonresponse?.availableSlots);
    // console.log(scheduleDate);
    // console.log(scheduleTime);
  };

  const CheckOuts = () => {
    if (!selectedDate || !selectedTime) {
      const missingField = !selectedDate
        ? 'date'
        : !selectedTime
        ? 'time'
        : 'date and time';
      Alert.alert(`Please select a ${missingField}`);
      return;
    }

    const scheduleTime = selectedTime; // Adjust as necessary
    const scheduleDate = selectedDate;

    if (bottomSheetRef?.current) {
      bottomSheetRef.current.close();
    }

    // Debugging: Log the data being passed
    console.log('Navigating to CheckOut with:', {
      service,
      scheduleDate,
      scheduleTime,
      serviceid,
      adviser,
    });

    navigation.navigate('CheckOut', {
      service,
      scheduleDate,
      scheduleTime,
      serviceid: serviceid || service?.serviceid,
      adviser,
    });

    // Reset the selected date and time
    setSelectedDate(null);
    setSelectedTime(null);
  };

  function getStartTime(timing) {
    // Check if timing is a valid string
    if (typeof timing !== 'string') {
      throw new Error('Input must be a string');
    }

    // Split the timing string by the hyphen
    const parts = timing.split('-');

    // Trim and return the first part (start time)
    return parts[0].trim();
  }

  const formatDate = date => {
    return moment(date).format('ddd'); // Full day, day of the month, and abbreviated month
  };
  const formatDate1 = date => {
    return moment(date).format('DD MMM'); // Full day, day of the month, and abbreviated month
  };

  const isDisabled = !selectedDate || !selectedTime;

  return (
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#17191A',
          }}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <>
          <ScrollView style={{flex: 1, backgroundColor: '#17191A'}}>
            <View style={styles.container}>
              <View style={{flexDirection: 'column'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                    <Pressable
                      onPress={() =>
                        navigation.navigate('PostView', service?.adviserid)
                      }>
                      <Image
                        source={{uri: adviser?.profile_photo}}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 30,
                        }}
                      />
                    </Pressable>
                    <View>
                      <Pressable
                        onPress={() =>
                          navigation.navigate('PostView', service?.adviserid)
                        }>
                        <Text
                          style={{
                            fontSize: RFValue(14),
                            fontFamily: 'Poppins-Medium',
                            color: 'white',
                          }}>
                          {adviser?.username}
                        </Text>
                      </Pressable>
                      <Text
                        style={{
                          fontSize: RFValue(10),
                          color: '#FFFFFF9C',
                          fontFamily: 'Poppins-Light',
                        }}>
                        {adviser?.professional_title}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 5,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        color: '#FFFFFF',
                        fontFamily: 'Poppins-Light',
                        marginTop: 6,
                      }}>
                      0.0
                    </Text>
                    <AntDesign name="star" size={RFValue(14)} color="#D9D250" />
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        color: 'white',
                        fontFamily: 'Poppins-Light',
                        marginTop: 6,
                        textDecorationLine: 'underline',
                      }}>
                      0 reviews
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: RFValue(12),
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: 'Poppins-Light',
                    marginHorizontal: 16,
                    marginVertical: 10,
                    marginBottom: 40,
                  }}>
                  {adviser?.professional_bio}
                </Text>

                <View
                  style={{
                    flexDirection: 'column',
                    gap: 5,
                    marginHorizontal: 16,
                    borderTopWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: '#FFFFFF50',
                    paddingTop: 10,
                    // marginTop:30,
                  }}>
                  <Text style={styles.title}>{service?.service_name}</Text>
                  {service?.about_service &&
                    service?.about_service.split('*').map((point, index) => {
                      const trimmedPoint = point.trim();
                      if (trimmedPoint) {
                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              gap: 10,
                              marginBottom: 5,
                            }}>
                            <Text
                              style={{
                                fontSize: RFValue(10),
                                fontFamily: 'Poppins-Bold',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}>
                              •
                            </Text>
                            <Text
                              style={{
                                fontSize: RFValue(12),
                                fontFamily: 'Poppins-Light',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}>
                              {trimmedPoint}
                            </Text>
                          </View>
                        );
                      }
                      return null; // If point is empty, don't render it
                    })}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  marginTop: 20,
                }}>
                <View
                  style={{
                    width: '50%',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#FFFFFF20',
                  }}>
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      color: 'white',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    ₹{service?.price}
                  </Text>
                </View>
                <View
                  style={{
                    width: '50%',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#FFFFFF20',
                  }}>
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      color: 'white',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {convertMinutesToHours(service?.duration)}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              // flexDirection: 'row',
              // justifyContent: 'space-between',
              //   alignItems: 'flex-end',
              alignItems: 'center',
              paddingHorizontal: 16,
              backgroundColor: '#121212',
              paddingVertical: 16,
              // gap: 10,
            }}>
            {/* <View
              style={{
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  fontSize: RFValue(10),
                  fontFamily: 'Poppins-Bold',
                  color: '#9c9c9c',
                }}>
                Next available
              </Text>
              <Text
                style={{
                  fontSize: RFValue(14),
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                }}>
                {/* ₹{service?.price} *
                {selectedDate?.dateFormatted || '--'}
              </Text>
              <Text
                style={{
                  fontSize: RFValue(14),
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                }}>
                {selectedTime?.slot || '--'}
              </Text>
            </View> */}
            <LinearGradient
              colors={['#3184FE', '#003582']} // Gradient colors
              style={styles.gradient}>
              <TouchableOpacity
                style={styles.buttonContent}
                onPress={() => bottomSheetRef.current?.open()}>
                <Text style={styles.text}>Book Slot</Text>
              </TouchableOpacity>
            </LinearGradient>
            {/* <TouchableOpacity
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                // width: '100%',
                paddingHorizontal: 20,
                // paddingVertical: 1,
                height: 48,
                // flex: 1,
                // marginRight:10,
                borderRadius: 8,
                // padding: 10,
              }}
              onPress={CheckOuts}>
              <Text
                style={{
                  // textAlign: 'center',
                  color: 'black',
                  marginTop: 1,
                  letterSpacing: 0.1,
                  fontSize: RFValue(14),
                  fontFamily: 'Poppins-Regular',
                }}>
                Confirm Details
              </Text>
            </TouchableOpacity> */}
            {ShowModal && (
              <Modal
                visible={ShowModal}
                transparent={true}
                animationType="fade">
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#3c3c3c',
                      padding: 15,
                      borderRadius: 10,
                      width: '90%',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'white',
                        fontFamily: 'Poppins-Medium',
                      }}>
                      Select Date
                    </Text>
                    <FlatList
                      data={date}
                      keyExtractor={item => item.dateISO} // Using dateISO as a unique key
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={[
                            styles.dateBox,
                            selectedDate?.dateISO === item.dateISO &&
                              styles.selectedBox,
                          ]}
                          // onPress={() => setSelectedDate(item)}
                          onPress={() =>
                            fetchSlots(item?.dateISO, item?.timing, item)
                          }>
                          <Text
                            style={{
                              color:
                                selectedDate?.dateISO === item.dateISO
                                  ? 'black'
                                  : 'white',
                            }}>
                            {item?.dateFormatted}
                          </Text>
                          {/* <Text
                      style={{
                        color:
                          selectedDate?.dateISO === item.dateISO
                            ? 'black'
                            : 'white',
                      }}>
                      {item.timing} {/* Display the timing as well *
                    </Text> */}
                        </TouchableOpacity>
                      )}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                    />

                    {slot && (
                      <View style={{marginTop: 20}}>
                        <Text style={styles.modalTitle}>Select Time</Text>
                        {/* <TouchableOpacity
                    style={[
                      styles.timeBox,
                      selectedTime === selectedDate.startTime && styles.selectedBox,
                    ]}
                    onPress={() => setSelectedTime(selectedDate.startTime)}
                  >
                    <Text style={styles.dateText}>
                      {selectedDate.startTime} - {selectedDate.endTime}
                    </Text>
                  </TouchableOpacity> */}
                        <FlatList
                          data={slot}
                          keyExtractor={(item, index) => index.toString()} // Changed to use index as key
                          renderItem={({item}) => {
                            const isDisabled = item.available === 'no';
                            const isSelected = selectedTime?.slot === item.slot;

                            return (
                              <TouchableOpacity
                                style={[
                                  styles.dateBox,
                                  isSelected && styles.selectedBox, // Highlight selected slot
                                  isDisabled && styles.disabledBox, // Style for disabled slot
                                ]}
                                disabled={isDisabled} // Disable if the slot is not available
                                onPress={() => {
                                  if (!isDisabled) {
                                    setSelectedTime(item); // Set selected time
                                    setScheduleTime(item?.slot); // Set schedule time
                                  }
                                }}>
                                <Text
                                  style={{
                                    color: isDisabled
                                      ? 'gray'
                                      : isSelected
                                      ? 'black'
                                      : 'white',
                                  }}>
                                  {item?.slot}
                                </Text>
                              </TouchableOpacity>
                            );
                          }}
                          showsHorizontalScrollIndicator={false}
                          horizontal
                        />
                      </View>
                    )}
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <TouchableOpacity
                        onPress={() => setShowModal(false)}
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          // padding: 5,
                          alignItems: 'center',
                          borderColor: 'red',
                          borderRadius: 5,
                          paddingHorizontal: 30,
                          paddingVertical: 5,
                        }}>
                        <Text
                          style={{
                            color: 'red',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={CheckOuts}
                        style={{
                          flex: 1,
                          borderWidth: 0,
                          // padding: 7,
                          alignItems: 'center',
                          borderRadius: 5,
                          paddingHorizontal: 30,
                          paddingVertical: 7,
                          backgroundColor: '#0069B4',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Book Slot
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </View>
          <RBSheet
            ref={bottomSheetRef}
            height={600}
            openDuration={250}
            customStyles={{
              container: {
                // padding: 15,
                // paddingVertical: 15,
                // paddingHorizontal:5,
                paddingTop: 10,
                backgroundColor: '#17191A',
                borderTopLeftRadius: 35,
                borderTopRightRadius: 35,
              },
            }}>
            <ScrollView contentContainerStyle={{paddingBottom: 60}}>
              <View
                style={{
                  marginTop: 10,
                  // paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: RFValue(16),
                      fontFamily: 'Poppins-Bold',
                      color: 'white',
                      paddingHorizontal: 16,
                    }}>
                    Book Your Sessions
                  </Text>
                  <TouchableOpacity
                    style={{
                      padding: 5,
                      borderRadius: 30,
                      marginRight: 10,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }}
                    onPress={() => bottomSheetRef.current.close()}>
                    <AntDesign name="close" size={RFValue(16)} color="white" />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontSize: RFValue(11),
                    paddingHorizontal: 16,
                    fontFamily: 'Poppins-Light',
                    color: '#9c9c9c',
                  }}>
                  You can book your session according to your preference
                </Text>

                {/* Date List */}
                <FlatList
                  data={date}
                  keyExtractor={item => item.dateISO}
                  renderItem={({item}) => (
                    <DateBox
                      item={item}
                      selectedDate={selectedDate}
                      fetchSlots={fetchSlots}
                      // formatDate={formatDate}
                      // formatDate1={formatDate1}
                    />
                  )}
                  showsHorizontalScrollIndicator={false}
                  style={styles.dateList}
                  horizontal
                />

                {/* Available Times after selecting a date */}
                {selectedDate && (
                  <>
                    <Text
                      style={{
                        fontSize: RFValue(16),
                        fontFamily: 'Poppins-Bold',
                        color: 'white',
                        marginTop: 10,
                        paddingHorizontal: 16,
                      }}>
                      Available Times
                    </Text>
                    {slot.length > 0 ? (
                      <FlatList
                        data={slot}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => {
                          const isDisabled = item.available === 'no';
                          const isSelected = selectedTime?.slot === item.slot;

                          return (
                            <TimeSlot
                              item={item}
                              isSelected={isSelected}
                              isDisabled={isDisabled}
                              setSelectedTime={setSelectedTime}
                              setScheduleTime={setScheduleTime}
                              getStartTime={getStartTime}
                            />
                          );
                        }}
                        numColumns={4}
                        style={styles.dateList}
                      />
                    ) : (
                      <View style={{alignItems: 'center', marginVertical: 10}}>
                        <Text
                          style={{
                            fontSize: RFValue(14),
                            color: 'gray',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          No Time Slots Given By Adviser on this date
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </View>

              {/* Bottom Action Button */}
            </ScrollView>
            <View
              style={{
                alignItems: 'center',
                paddingHorizontal: 16,
                backgroundColor: '#121212',
                paddingVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    fontSize: RFValue(10),
                    fontFamily: 'Poppins-Bold',
                    color: '#9c9c9c',
                  }}>
                  Selected Slot
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                  }}>
                  {selectedDate?.dateFormatted || '--'}
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                  }}>
                  {selectedTime?.slot || '--'}
                </Text>
              </View>
              <CheckOutButton isDisabled={isDisabled} CheckOuts={CheckOuts}/>
            </View>
          </RBSheet>
        </>
      )}
    </>
  );
};

export default KnowMore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
    paddingVertical: 10,
    // paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  timeList: {
    marginTop: 10,
  },
  timeButton: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  gradient: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: '100%',
  },
  text: {
    color: 'white',
    letterSpacing: 0.1,
    fontSize: RFValue(14), // Adjusted font size using RFValue
    fontFamily: 'Poppins-Regular', // Font family
  },
  title: {
    // paddingHorizontal: 16,
    fontSize: RFValue(24),
    color: 'white',
    letterSpacing: 0.2,
    marginTop: 20,
    fontFamily: 'Poppins-Medium',
  },
  dateList: {
    marginBottom: 10,
    // marginTop: 5,
    marginLeft: 16,
  },
  dateButton: {
    // backgroundColor: '#1e1e1e',
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF4D',
    marginRight: 8,
    borderRadius: 8,
  },
  dateText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontFamily: 'Poppins-Regular',
  },
  sessions: {
    fontSize: RFValue(12),
    color: '#cf6679',
    fontFamily: 'Poppins-Medium',
  },
  modalTitle: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  dateBox: {
    marginTop: 10,
    // flex: 1,
    alignItems: 'center',
    // padding: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // maxWidth: '65%',
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#FFFFFF1A',
  },
  dateBox1: {
    marginTop: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    // maxWidth: '65%',
    marginRight: 10,
    // width: 95,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#FFFFFF1A',
  },
  selectedBox: {
    backgroundColor: '#FFFFFF1B',

    // borderColor: '#0069B4',
    // color:'black'
  },
  duration: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  regularText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
  },
  description: {
    fontSize: RFValue(14),
    color: 'white',
    fontFamily: 'Poppins-Regular',
    lineHeight: 22, // Add this for better readability
    whiteSpace: 'pre-wrap', // Ensures that newlines are respected
  },
  bulletPoint: {
    marginBottom: 8, // Adds spacing between each bullet point
    lineHeight: 20, // Adjusts the line height
  },
  disabledBox: {
    backgroundColor: 'lightgray', // Gray out for disabled slot
    borderColor: 'gray',
    borderWidth: 1,
  },
});
