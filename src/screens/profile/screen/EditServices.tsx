import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import React, {useEffect, useState} from 'react';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Octicons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

const EditServices = () => {
  const route = useRoute();
  const {service, servicelist} = route.params;

  const navigation = useNavigation();
  console.log('SJjsn', service?.serviceid);

  const [servicename, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [descriptionHeight, setDescriptionHeight] = useState(44);
  const user = useSelector((state: any) => state.user);
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
  const serviceId = service?.serviceid;
  const [rememberMe, setRememberMe] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);

  const deleteService = async serviceId => {
    // setDeleteModal(true);

    try {
      console.log('Deleting Services with ID:', serviceId);
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/service/deleteservice',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceid: serviceId,
            adviserid: user.userid,
            // postid: postid,
          }),
        },
      );

      // getPostlist();
      servicelist;
      // Fetch updated reels list after deletion
      const jsonResponse = await response.json();
      console.log('Services deleted:', jsonResponse);
      navigation.goBack();

      // Optional: You can show another alert for success
      // Alert.alert('Success', 'The reel has been deleted.');
    } catch (error) {
      console.error('Error deleting reel:', error);
      Alert.alert('Error', 'Failed to delete the Service. Please try again.');
    } finally {
      setDeleteModal(false);
    }
  };

  // const deletePost = postid => {
  //   Alert.alert(
  //     'Delete Post',
  //     'Are you sure you want to delete this Post?',
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Delete canceled'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Delete',
  //         onPress: async () => {
  //           try {
  //             console.log('Deleting reel with ID:', postid);
  //             const response = await fetch(
  //               'https://adviserxiis-backend-three.vercel.app/post/deletepost',
  //               {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({
  //                   adviserid: user.userid,
  //                   postid: postid,
  //                 }),
  //               },
  //             );

  //             getPostlist();
  //             // Fetch updated reels list after deletion
  //             const jsonResponse = await response.json();
  //             console.log('Post deleted:', jsonResponse);

  //             // Optional: You can show another alert for success
  //             // Alert.alert('Success', 'The reel has been deleted.');
  //           } catch (error) {
  //             console.error('Error deleting reel:', error);
  //             Alert.alert(
  //               'Error',
  //               'Failed to delete the reel. Please try again.',
  //             );
  //           }
  //         },
  //         style: 'destructive', // Optional: Makes the delete button red on iOS
  //       },
  //     ],
  //     {cancelable: false},
  //   );
  // };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Edit Service',
      headerTitleStyle: {
        fontFamily: 'Poppins-Medium',
      },
      headerStyle: {
        backgroundColor: '#17191A',
      },
      headerShadowVisible: false,
      headerTintColor: 'white',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setDeleteModal(true)}
          style={{
            marginRight: 16,
          }}>
          <Icon name="trash" size={20} color="#FF2C2C" />
        </TouchableOpacity>
      ),
    });
  });

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
        </View>
      </View>

      {/* </View> */}
      <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>

      {deleteModal && (
        <Modal visible={deleteModal} transparent={true} animationType="fade">
          <View style={styles.modalContainer1}>
            <View style={styles.modalContent1}>
              <View
                style={{
                  // justifyContent: 'center',
                  gap: 16,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../../assets/images/deleteds.png')}
                  style={{
                    width: 80,
                    objectFit: 'cover',
                    alignSelf: 'center',
                    height: 80,
                  }}
                />
                <View
                  style={{
                    alignItems: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'white',
                      fontFamily: 'Poppins-Medium',
                      // textAlign:'center',
                    }}>
                    Permanently Deleting Service?
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#FF2C2C',
                      fontFamily: 'Poppins-Regular',
                    }}>
                    This service will be permanently delete and cannot be
                    restored. Please confirm if you want to proceed.
                  </Text>

                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={styles.checkboxWrapper}
                      onPress={() => setRememberMe(!rememberMe)}>
                      <View
                        style={[
                          styles.checkbox,
                          rememberMe && styles.checkboxChecked,
                        ]}>
                        {rememberMe && (
                          <Icon2 name="check" size={14} color="white" />
                        )}
                      </View>
                      <Text style={styles.checkboxText}>
                        I want to delete my service.
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 8,
                  marginTop: 5,
                }}>
                <TouchableOpacity
                  onPress={() => setDeleteModal(false)}
                  // disabled={!rememberMe}
                  style={{
                    // padding: 10,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                  }}>
                  <Text
                    style={{
                      color: '#0069B4',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteService(serviceId)}
                  disabled={!rememberMe}
                  style={{
                    // padding: 10,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 15,
                    backgroundColor: rememberMe ? '#0069B4' : '#A7A7A7',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                    }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent1: {
    backgroundColor: '#3c3c3c',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
  checkboxText: {
    color: '#fff',
    fontSize: 12,
    marginTop:3,
    fontFamily: 'Poppins-Regular',
  },
});
