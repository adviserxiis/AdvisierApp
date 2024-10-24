import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import {useSelector} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const SetAvailablity = () => {
  const [AvailableModal, setAvailableModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState({})
  const user = useSelector(state => state.user);
  const navigation = useNavigation();

  const [currentDay, setCurrentDay] = useState('');
  const [isStart, setIsStart] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [checkedbox, setCheckedBox] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  const handleTimeConfirm = selectedDate => {
    setSelectedTime({
      ...selectedTime,
      [currentDay]: {
        ...selectedTime[currentDay],
        [isStart ? 'start' : 'end']: selectedDate,
      },
    });
    setShowPicker(false); // Close the picker after selecting the time
  };

  const openTimePicker = (day, isStartTime) => {
    setCurrentDay(day);
    setIsStart(isStartTime);
    setShowPicker(true);
  };

  const handleAvailable = async () => {
    const availableTimes = Object.keys(selectedTime)
      .filter(day => checkedbox[day]) // Only get days where the checkbox is true
      .map(day => {
        const {start: startTime, end: endTime} = selectedTime[day];

        // Check if end time is less than start time
        if (endTime < startTime) {
          Alert.alert(
            'Error',
            `End time cannot be less than start time for ${day}.`,
          );
          return null; // Skip this day
        }

        // Format startTime and endTime in "AM/PM" format and convert to uppercase
        const formattedStartTime = startTime
          .toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Force AM/PM format
          })
          .toUpperCase(); // Convert to uppercase

        const formattedEndTime = endTime
          .toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Force AM/PM format
          })
          .toUpperCase(); // Convert to uppercase

        return {
          day,
          startTime: formattedStartTime, // Send in "AM/PM" uppercase format
          endTime: formattedEndTime, // Send in "AM/PM" uppercase format
        };
      })
      .filter(Boolean); // Filter out null values

    if (availableTimes.length === 0) {
      Alert.alert('Warning', 'No valid availability times to submit.');
      return; // Exit if there are no valid times
    }

    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/saveavailability',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            availability: availableTimes.map(({day, startTime, endTime}) => ({
              day,
              startTime,
              endTime,
            })),
            adviserid: user.userid,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unknown error');
      }

      console.log('Success:', data);
      if (response.ok) {
        setAvailableModal(false);
      }
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error', error.message);
    }

    console.log('Available times:', availableTimes);
  };

  const allDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const userdata = async () => {
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/creator/getuser/${user.userid}`,
      {
        method: 'GET',
      },
    );
    const jsonresponse = await response.json();
  
    console.log('User Availability:', jsonresponse.availability);
  
    // Initialize selectedTime and checkedbox with default values for all days
    const defaultSelectedTime = {};
    const defaultCheckedbox = {};
  
    allDays.forEach(day => {
      defaultSelectedTime[day] = {
        start: new Date('1970-01-01T09:00'), // Default start time (9:00 AM)
        end: new Date('1970-01-01T17:00'),  // Default end time (5:00 PM)
      };
      defaultCheckedbox[day] = false; // Default is unchecked
    });
  
    // If the user has availability data, update selectedTime and checkedbox
    if (jsonresponse.availability && jsonresponse.availability.length > 0) {
      jsonresponse.availability.forEach(item => {
        const { day, timing } = item;
        
        // Capitalize the first letter of the day to match the app's state
        const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
  
        // Parse the start and end time from the timing string
        const [startTime, endTime] = timing.split(' - '); // E.g., "4:50 PM - 6:00 PM"
  
        // Update the default times if this day is set in the server data
        defaultSelectedTime[capitalizedDay] = {
          start: new Date(`1970-01-01T${formatTime(startTime)}`),
          end: new Date(`1970-01-01T${formatTime(endTime)}`),
        };
        defaultCheckedbox[capitalizedDay] = true; // Mark the day as checked
      });
    }
  
    // Update the state with the selected times and checked days
    setSelectedTime(defaultSelectedTime);
    setCheckedBox(defaultCheckedbox);
  };
  
  // Helper function to convert 12-hour format to 24-hour for Date parsing
  const formatTime = time => {
    const [hour, minute, period] = time
      .match(/(\d+):(\d+)\s?(AM|PM)/i)
      .slice(1, 4);
  
    let hours = parseInt(hour, 10);
    if (period.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
  
    return `${hours.toString().padStart(2, '0')}:${minute}`;
  };
  

  useEffect(() => {
    userdata();
  }, []);

  return (
    <View
      style={{
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection:'row',
        gap:10,
        paddingHorizontal: 16,
      }}>
      <TouchableOpacity
        onPress={() => setAvailableModal(true)}
        style={{
          flexDirection: 'row',
          gap: 6,
          backgroundColor: '#0069B4',
          paddingHorizontal: 12,
          alignItems: 'center',
          paddingVertical: 3,
          borderRadius: 15,
        }}>
          <Icon name="calendar" size={14} color="white" />
        <Text
          style={{
            color: 'white',
            fontSize: 12,
            fontFamily: 'Poppins-Regular',
            marginTop: 4,
          }}>
          Calendar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('ServicesPost')} style={{
        flexDirection: 'row',
        gap: 6,
        backgroundColor: '#0069B4',
        paddingHorizontal: 12,
        alignItems: 'center',
        paddingVertical: 3,
        borderRadius: 15,
      }}>
          <Icon name="plus" size={14} color="white" />
        <Text style={{
            color: 'white',
            fontSize: 12,
            fontFamily: 'Poppins-Regular',
            marginTop: 4,
          }}>Add Service</Text>
      </TouchableOpacity>
      {AvailableModal && (
        <Modal visible={AvailableModal} transparent={true} animationType="fade">
          <View style={styles.modalContainer1}>
            <View style={styles.modalContent1}>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 20,
                  fontFamily: 'Poppins-Medium',
                  color: 'white',
                }}>
                Set Availability
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignContent: 'center',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color:'white',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Days
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color:'white',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Start
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color:'white',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  End
                </Text>
              </View>

              {/* {Object.keys(selectedTime).map(day => (
                <View key={day} style={styles.dayRow1}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setCheckedBox(prev => ({
                          ...prev,
                          [day]: !prev[day], // Toggle only the clicked day
                        }));
                      }}>
                      <View
                        style={[
                          styles.checkbox,
                          checkedbox[day] && styles.checkboxChecked,
                        ]}>
                        {checkedbox[day] && (
                          <Icon name="check" size={14} color="white" />
                        )}
                      </View>
                      <Text style={styles.dayText1}>{day}</Text>
                    </TouchableOpacity>
                  </View>
                  {/* <Icon1 name="check" size={16} color="white" /> *
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 10,
                    }}>
                    <TouchableOpacity onPress={() => openTimePicker(day, true)}>
                      <Text style={styles.timeText1}>
                        {selectedTime[day].start.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => openTimePicker(day, false)}>
                      <Text style={styles.timeText1}>
                        {selectedTime[day].end.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))} */}

              {allDays.map(day => (
                <View key={day} style={styles.dayRow1}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setCheckedBox(prev => ({
                          ...prev,
                          [day]: !prev[day], // Toggle only the clicked day
                        }));
                      }}>
                      <View
                        style={[
                          styles.checkbox,
                          checkedbox[day] && styles.checkboxChecked,
                        ]}>
                        {checkedbox[day] && (
                          <Icon name="check" size={14} color="white" />
                        )}
                      </View>
                      <Text style={styles.dayText1}>{day}</Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 10,
                    }}>
                    <TouchableOpacity onPress={() => openTimePicker(day, true)}>
                      <Text style={styles.timeText1}>
                        {selectedTime[day].start
                          .toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })
                          .toUpperCase()}{' '}
                        {/* Display start time in AM/PM */}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => openTimePicker(day, false)}>
                      <Text style={styles.timeText1}>
                        {selectedTime[day].end
                          .toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })
                          .toUpperCase()}{' '}
                        {/* Display end time in AM/PM */}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 10,
                  marginTop: 5,
                }}>
                <TouchableOpacity
                  onPress={() => setAvailableModal(false)}
                  style={{
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      color: '#0069B4',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    CANCEL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAvailable}
                  style={{
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      color: '#0069B4',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    SAVE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {showPicker && (
        <DatePicker
          modal
          open={showPicker}
          date={
            isStart
              ? selectedTime[currentDay].start
              : selectedTime[currentDay].end
          }
          mode="time"
          onConfirm={date => handleTimeConfirm(date)}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </View>
  );
};

export default SetAvailablity;

const styles = StyleSheet.create({
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent1: {
    backgroundColor: '#3c3c3c',
    padding: 15,
    borderRadius: 10,
    width: '90%',
  },
  heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dayRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText1: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: 'white',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderColor: '#EDEDED',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  checkboxChecked: {
    backgroundColor: '#388DEB',
    // borderColor: 'white',
    borderWidth: 0,
  },
  timeText1: {
    fontSize: 15,
    color: 'white',
    borderWidth: 1,
    // padding: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: 'white',
    borderRadius: 10,
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
