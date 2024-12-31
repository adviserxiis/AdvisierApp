import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-date-picker';
import {useNavigation} from '@react-navigation/native';
import InputField from './components/InputField';
import TagInput from './components/TagInput';
import TagSelector from './components/TagSelector';
import DateTextInput from './components/DateTextInput';
import LinearGradient from 'react-native-linear-gradient';

const suggestions = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'CSS',
  'HTML',
  'Redux',
  'Vue',
];

const ServicesPost = () => {
  const [servicename, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [descriptionHeight, setDescriptionHeight] = useState(44);
  const user = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  // const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState('');
  const [errors, setErrors] = useState({
    servicename: '',
    description: '',
    selectedTags: '',
    duration: '',
    price: '',
  });
  
  // const [isServiceFocused, setIsServiceFocused] = useState(false);
  // const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  // const [isDurationFocused, setIsDurationFocused] = useState(false);
  // const [isPriceFocused, setIsPriceFocused] = useState(false);

  const [currentDay, setCurrentDay] = useState('');
  const [isStart, setIsStart] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [checkedbox, setCheckedBox] = useState(false);
  const [AvailableModal, setAvailableModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState({
    Monday: {start: new Date(), end: new Date()},
    Tuesday: {start: new Date(), end: new Date()},
    Wednesday: {start: new Date(), end: new Date()},
    Thursday: {start: new Date(), end: new Date()},
    Friday: {start: new Date(), end: new Date()},
    Saturday: {start: new Date(), end: new Date()},
    Sunday: {start: new Date(), end: new Date()},
  });
  

  useEffect(() => {
    AvailableDetails();
  }, []);

  const tagsArray = selectedTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

      console.log(tagsArray);

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};

    if (!servicename || servicename.trim().length === 0) {
      newErrors.servicename = 'Service name is required.';
    }

    if (!description || description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    }

    if (
      !selectedTags ||
      selectedTags.split(',').filter(tag => tag.trim() !== '').length === 0
    ) {
      newErrors.selectedTags = 'Please add at least one tag.';
    } else if (
      selectedTags.split(',').filter(tag => tag.trim() !== '').length > 5
    ) {
      newErrors.selectedTags = 'You can add up to 5 tags.';
    }

    if (!duration) {
      newErrors.duration = 'Duration is required.';
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const AvailableDetails = async () => {
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/creator/getuser/${user.userid}`,
    );
    const data = await response.json();
    console.log('user dtata', data?.availability);
    if (!data?.availability) {
      setAvailableModal(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    // if (!servicename || !description || !duration || !price) {
    //   Alert.alert('Error', 'Please fill all the fields');
    //   setLoading(false);
    //   return;
    // }

    // if (price === '0') {
    //   Alert.alert(
    //     'Invalid Price', // Title of the alert
    //     'Price cannot be zero', // Message of the alert
    //     [{text: 'OK'}], // Button options
    //   );
    //   setLoading(false);
    //   return;
    // }

    // if(!currentDay){
    //   setAvailableModal(true);
    //   setLoading(false);
    //   return;
    // }

    try {

      
      
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/service/createservice',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_name: servicename,
            about_service: description,
            duration: duration,
            price: price,
            adviserid: user.userid,
            tags:tagsArray,
          }),
        },
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        Alert.alert('Success', 'Service created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to the Profile screen in the Services tab
              navigation.navigate('Profile', {initialTab: 'services'});

              // Optionally clear fields after successful submission
              setServiceName('');
              setDescription('');
              setDuration('');
              setPrice('');
              setSelectedTags('');
            },
          },
        ]);
      } else {
        Alert.alert(
          'Error',
          data.message || 'Something went wrong, please try again.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Network error, please try again later.');
    } finally {
      setLoading(false); // End loading
    }
  };

  // useEffect(() => {
  //   setAvailableModal(true);
  // }, []);

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

        if (startTime === endTime) {
          Alert.alert('Error', "Starting Time and Ending time doesn't be same");
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

  return (
    <View style={styles.container}>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
          <ActivityIndicator size={'large'} color={'white'} />
        </View>
      )}
      <ScrollView
        contentContainerStyle={{flexGrow: 1, marginTop: 20}}
        keyboardShouldPersistTaps="handled">
        <InputField
          label="Service Name"
          placeholder="Give a name to your service"
          maxLength={40}
          value={servicename}
          onChangeText={text => {
            setServiceName(text);
            if (errors.servicename)
              setErrors(prev => ({...prev, servicename: ''})); // Clear error
          }}
          helperText={`${servicename.length}/10`}
          error={errors.servicename}
        />
        <InputField
          label="Description"
          placeholder="Describe what will you provide"
          maxLength={500}
          value={description}
          onChangeText={text => {
            setDescription(text);
            if (errors.description)
              setErrors(prev => ({...prev, description: ''})); // Clear error
          }}
          helperText={`${description.length}/1000`}
          error={errors.description}
        />
        <TagSelector
          label="Tag Topics"
          placeholder="Add topics according to your niche"
          value={selectedTags}
          maxLength={50}
          onChangeText={text => {
            setSelectedTags(text);
            if (errors.selectedTags)
              setErrors(prev => ({...prev, selectedTags: ''})); // Clear error
          }}
          helperText={`${
            selectedTags
              ? selectedTags.split(',').filter(tag => tag.trim() !== '').length
              : 0
          }/5`} // Count non-empty tags
          error={errors.selectedTags}
          navigateTo="TagSelectionScreen" // Optional navigation
        />
        <DateTextInput
          label="Duration"
          value={duration}
          setDuration={value => {
            setDuration(value);
            if (errors.duration) setErrors(prev => ({...prev, duration: ''})); // Clear error
          }}
          error={errors.duration}
        />
        <InputField
          label="Price"
          placeholder="Enter your price"
          maxLength={10}
          value={price}
          onChangeText={text => {
            setPrice(text);
            if (errors.price) setErrors(prev => ({...prev, price: ''})); // Clear error
          }}
          error={errors.price}
        />
      </ScrollView>
      {/* <View
        style={{
          flexDirection: 'column',
          // gap: 20,
          marginTop: 20,
        }}>
        <InputField
          label="Service Name"
          placeholder="Give a name to your service"
          maxLength={10}
          value={servicename}
          onChangeText={(text) => {
            setServiceName(text);
            if (errors.servicename) setErrors((prev) => ({ ...prev, servicename: '' })); // Clear error
          }}
          helperText={`${servicename.length}/10`}
          error={errors.servicename}
        />
        <InputField
          label="Description"
          placeholder="Describe what will you provide"
          maxLength={500}
          // multiline={true}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' })); // Clear error
          }}
          helperText={`${description.length}/1000`}
          error={errors.description}
        />
        <TagSelector
          label="Tag Topics"
          placeholder="Add topics according to your niche"
          value={selectedTags}
          maxLength={50}
          onChangeText={(text) => {
          setSelectedTags(text);
          if (errors.selectedTags) setErrors((prev) => ({ ...prev, selectedTags: '' })); // Clear error
        }}
          helperText={`${
            selectedTags
              ? selectedTags.split(',').filter(tag => tag.trim() !== '').length
              : 0
          }/5`} // Count non-empty tags
          error={errors.selectedTags}
          navigateTo="TagSelectionScreen" // Optional navigation
        />

        <DateTextInput
          label="Duration"
          value={duration}
          setDuration={(value) => {
            setDuration(value);
            if (errors.duration) setErrors((prev) => ({ ...prev, duration: '' })); // Clear error
          }}
          error={errors.duration}
        />

        <InputField
          label="Price"
          placeholder="Enter your price"
          maxLength={10}
          value={price}
          onChangeText={(text) => {
          setPrice(text);
          if (errors.price) setErrors((prev) => ({ ...prev, price: '' })); // Clear error
        }}
        error={errors.price}
          // helperText={`${servicename.length}/10`}
        />

        {/* <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {(isDescriptionFocused || description) && (
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                  opacity: 0.5,
                  // textAlign: 'left',
                  position: 'absolute',
                }}>
                Description
              </Text>
            )}
          </View>
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'Poppins-Regular',
              color: 'white',
              opacity: 0.5,
              textAlign: 'right',
            }}>
            {description.length}/1000
          </Text>

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            maxLength={1000}
            placeholderTextColor="#838383"
            multiline={true}
            onContentSizeChange={event =>
              setDescriptionHeight(event.nativeEvent.contentSize.height)
            }
            style={{
              height: Math.max(44, descriptionHeight),
              backgroundColor: '#3A3B3C',
              color: 'white',
              paddingLeft: 15,
              marginBottom: 10,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            marginTop: 5,
          }}>
          {(isDurationFocused || duration) && (
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-Regular',
                color: 'white',
                opacity: 0.5,
                // textAlign: 'left',
                position: 'absolute',
                top: -15,
              }}>
              Duration
            </Text>
          )}
          {/* <TextInput
            placeholder="Duration is Minutes"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            onFocus={() => setIsDurationFocused(true)}
            onBlur={() => setIsDurationFocused(false)}
            placeholderTextColor="#838383"
            style={{
              height: 44,
              backgroundColor: '#3A3B3C',
              color: 'white',
              paddingLeft: 15,
              marginBottom: 10,
              borderRadius: 10,
            }}
          /> *
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={value => setDuration(value)}
              items={[
                {label: '30 min', value: 30},
                {label: '60 min', value: 60},
                {label: '90 min', value: 90},
                {label: '120 min', value: 120},
              ]}
              placeholder={{
                label: 'Duration in Minutes',
                value: null,
                color: '#838383',
              }}
              style={{
                inputIOS: {
                  color: 'white',
                  // paddingLeft: 50,
                  marginLeft: 5,
                  fontSize: 10,
                  fontFamily: 'Poppins-Regular',
                  borderRadius: 10,
                },
                inputAndroid: {
                  color: 'white',
                  // paddingLeft: 50,
                  marginLeft: 5,
                  fontSize: 10,
                  fontFamily: 'Poppins-Regular',
                  borderRadius: 10,
                },
                placeholder: {
                  color: '#838383',
                  fontSize: 10, // Font size for placeholder
                  fontFamily: 'Poppins-Regular',
                },
              }}
              value={duration} // Bind the state value
              onOpen={() => setIsDurationFocused(true)}
              onClose={() => setIsDurationFocused(false)}
            />
          </View>
        </View>
        <View
          style={{
            marginTop: 15,
          }}>
          {(isPriceFocused || price) && (
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-Regular',
                color: 'white',
                opacity: 0.5,
                // textAlign: 'left',
                position: 'absolute',
                top: -15,
              }}>
              Price
            </Text>
          )}
          <TextInput
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            onFocus={() => setIsPriceFocused(true)}
            onBlur={() => setIsPriceFocused(false)}
            placeholderTextColor="#838383"
            style={{
              height: 44,
              backgroundColor: '#3A3B3C',
              color: 'white',
              paddingLeft: 15,
              borderRadius: 10,
            }}
          />
        </View> *
      </View> */}
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
                    color: 'white',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Days
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Start
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  End
                </Text>
              </View>

              {Object.keys(selectedTime).map(day => (
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
                  {/* <Icon1 name="check" size={16} color="white" /> */}
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

<TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
  <LinearGradient
    colors={['#3184FE', '#003582']} // Gradient colors
    style={[styles.createButton, { padding: 15, borderRadius: 10 }]} // Ensure styling fits your button style
  >
    <Text style={styles.buttonText}>Create</Text>
  </LinearGradient>
</TouchableOpacity>
      {/* </View> */}
    </View>
  );
};

export default ServicesPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  createButton: {
    // backgroundColor: '#0069B4',
    borderRadius: 10,
    // marginVertical: 10,
    paddingVertical: 12,
    // paddingHorizontal: 55,
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1,
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
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
  pickerContainer: {
    height: 44,
    backgroundColor: '#3A3B3C',
    borderRadius: 10,
    justifyContent: 'center',
  },
  picker: {
    color: 'white',
    // paddingLeft: 50,
    marginLeft: 5,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    borderRadius: 10,
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
