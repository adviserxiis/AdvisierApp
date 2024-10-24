import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import {RAZERPAY_KEY_ID} from '@env';
import {useSelector} from 'react-redux';
import ZegoExpressEngine from 'zego-express-engine-reactnative';
const KnowMore = () => {
  const route = useRoute();
  // const user = useSelector((state: any) => state.user);
  const {service} = route.params;
  const navigation = useNavigation();
  const [ShowModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slot, setSlot] = useState([]);
  // const route = useRoute();
  const user = useSelector((state: any) => state.user);
  // const {service} = route.params;
  // console.log(service?.adviserid);
  // console.log(RAZERPAY_KEY_ID);
  // console.log(user?.userInfo?.name);

  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  function convertMinutesToHours(minutes) {
    if (minutes < 60) {
      return `${minutes} Min`;
    }

    const hours = Math.floor(minutes / 60); // Get the number of full hours
    const remainingMinutes = minutes % 60; // Get the remaining minutes

    // If no remaining minutes, just return hours, otherwise append minutes
    if (remainingMinutes === 0) {
      return `${hours} Hr${hours > 1 ? '' : ''}`; // Pluralize 'Hr' if needed
    } else {
      return `${hours} Hr${hours > 1 ? '' : ''} ${remainingMinutes} Min`;
    }
  }

  const [date, setDate] = useState([]);
  const [time, setTime] = useState([]);

  const getAvailable = async () => {
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/service/getavailabledays/${service?.adviserid}`,
      {
        method: 'GET',
      },
    );
    const data = await response.json();
    console.log(data.availability);
    setDate(data.availability);
    setTime(data.availability);
  };

  useEffect(() => {
    getAvailable();
  }, []);

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
      Alert.alert('Please select a date and time');
      return;
    }
    const scheduleTime = selectedTime; // Adjust as necessary
    const scheduleDate = selectedDate;
    setShowModal(false);
    navigation.navigate('CheckOut', {service, scheduleDate, scheduleTime});
  };

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: '#17191A'}}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'column',
              gap: 20,
            }}>
            <Text style={styles.title}>{service?.service_name}</Text>
            <Text style={styles.duration}>
              Duration -{' '}
              <Text style={styles.regularText}>
                {convertMinutesToHours(service?.duration)}
              </Text>
            </Text>
            {/* Handle the multiline description properly */}
            <Text style={styles.description}>{service?.about_service}</Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          //   alignItems: 'flex-end',
          paddingHorizontal: 16,
          backgroundColor: '#17191A',
          paddingVertical: 8,
          gap: 10,
        }}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins-Regular',
              color: '#838383',
            }}>
            Price
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontFamily: 'Poppins-Bold',
              color: '#0069B4',
            }}>
            ₹{service?.price}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#0069B4',
            // alignItems:'center',
            // width: '100%',
            paddingHorizontal: 90,
            // flex: 1,
            // marginRight:10,
            borderRadius: 15,
            padding: 15,
          }}
          onPress={() => setShowModal(true)}>
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              fontSize: 17,
              fontFamily: 'Poppins-Regular',
            }}>
            Buy Now
          </Text>
        </TouchableOpacity>
        {ShowModal && (
          <Modal visible={ShowModal} transparent={true} animationType="fade">
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
    </>
  );
};

export default KnowMore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    color: 'white',
    letterSpacing: 0.2,
    fontFamily: 'Poppins-Medium',
  },
  modalTitle: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  dateBox: {
    marginTop: 10,
    padding: 10,
    // maxWidth: '65%',
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
  },
  selectedBox: {
    backgroundColor: 'white',
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
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    lineHeight: 22, // Add this for better readability
    whiteSpace: 'pre-wrap', // Ensures that newlines are respected
  },
  disabledBox: {
    backgroundColor: 'lightgray', // Gray out for disabled slot
    borderColor: 'gray',
    borderWidth: 1,
  },
  dateText: {
    color: 'white',
  },
});
