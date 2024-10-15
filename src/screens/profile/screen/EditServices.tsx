import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

const EditServices = () => {
  const route = useRoute();
  const {service} = route.params;

  const navigation = useNavigation();
  console.log('SJjsn', service?.serviceid);

  const [servicename, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [descriptionHeight, setDescriptionHeight] = useState(44);
  const user = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);

  const [isServiceFocused, setIsServiceFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [isDurationFocused, setIsDurationFocused] = useState(false);
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  useEffect(() => {
    // Populate the form fields with the service data
    if (service) {
      setServiceName(service.service_name || '');
      setDescription(service.about_service || '');
      setDuration(service.duration || '');
      setPrice(service.price || '');
    }
  }, [service]);
  // const serviceId = service?.serviceid;

  const handleSubmit = async () => {
    setLoading(true);
    if (!servicename || !description || !duration || !price) {
      setLoading(false);
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    try {
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/service/editservice`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adviserid: user.userid,
            serviceid: service?.serviceid,
            service_name: servicename,
            about_service: description,
            duration: duration,
            price: price,
            // isPublished:false,
          }),
        },
      );

      const text = await response.text(); // Get response as text

      if (response.ok) {
        const data = JSON.parse(text); // Parse if it's valid JSON
        console.log('Saved Data:', data);
        navigation.goBack();
      } else {
        console.error('Error response:', text);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error, please try again later.');
    } finally {
      setLoading(false);
    }
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
      <View
        style={{
          flexDirection: 'column',
          gap: 20,
          marginTop: 20,
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {(isServiceFocused || servicename) && (
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                  opacity: 0.5,
                  // textAlign: 'left',
                  position: 'absolute',
                }}>
                Service
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
            {servicename.length}/30
          </Text>
          <TextInput
            value={servicename}
            onChangeText={setServiceName}
            maxLength={30}
            placeholder="Services Name"
            placeholderTextColor="#838383"
            onFocus={() => setIsServiceFocused(true)}
            onBlur={() => setIsServiceFocused(false)}
            style={{
              height: 44,
              backgroundColor: '#3A3B3C',
              color: 'white',
              paddingLeft: 15,
              borderRadius: 10,
            }}
          />
        </View>
        <View>
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
            placeholder="Duration"
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
          /> */}
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
                label: 'Select Duration in Minutes',
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
            marginTop: 5,
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
        </View>
      </View>

      {/* </View> */}
      <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditServices;

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
    backgroundColor: '#0069B4',
    borderRadius: 10,
    marginTop: 30,
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
});
