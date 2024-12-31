import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FeedBack = () => {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [descriptionHeight, setDescriptionHeight] = useState(40);

  const user = useSelector((state)=>state.user);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Contact Us',
      headerTintColor: 'white',
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: '#17191A',
      },
    });
  }, [navigation]);
  const [loading, setLoading] = useState(false);

  const getUserEmail = async () => {
    try {
      // Retrieve the user email stored in AsyncStorage
      const userEmail = await AsyncStorage.getItem('user');  // Assuming the key is 'user'
      
      // If the user email is found, log it
      if (userEmail) {
        console.log('User email:', userEmail);
      } else {
        console.log('No user email found.');
      }
    } catch (error) {
      console.error('Error retrieving user email:', error);
    }
  };

  useEffect(()=>{
    getUserEmail();
  },[]);

  console.log(user?.email);


  //   const handleSubmit = () => {
  //     // Check if any of the fields are empty
  //     if (!subject || !description || !phoneNumber) {
  //       Alert.alert(
  //         'Validation Error',
  //         'Please fill in all fields before submitting.'
  //       );
  //       return; // Exit the function if any field is empty
  //     }

  //     // Regular expression to validate phone number (example: 10 digits)
  //     const phoneRegex = /^[0-9]{10}$/;

  //     // Validate the phone number
  //     if (!phoneRegex.test(phoneNumber)) {
  //       Alert.alert(
  //         'Invalid Mobile Number',
  //         'Please enter a valid 10-digit mobile number.'
  //       );
  //       return; // Exit the function if phone number is invalid
  //     }

  //     // Set loading to true when the submit button is pressed
  //     setLoading(true);

  //     const email = 'adviserxiis@gmail.com'; // The recipient email
  //     const subjectText = subject ? `Subject: ${subject}` : 'No Subject';
  //     const bodyText = `Description: ${description}\nMobile Number: ${phoneNumber}`;

  //     // Construct the mailto URL
  //     const url = `mailto:${email}?subject=${encodeURIComponent(
  //       subjectText
  //     )}&body=${encodeURIComponent(bodyText)}`;

  //     // Open the email client
  //     Linking.openURL(url)
  //       .then(() => {
  //         console.log('Email client opened');
  //         // Navigate back to the previous screen after the email client opens
  //         setLoading(false);
  //         navigation.goBack();
  //       })
  //       .catch((err) => {
  //         console.error('Failed to open email client', err);
  //         setLoading(false);
  //         Alert.alert(
  //           'Error',
  //           'Failed to open the email client. Please try again.'
  //         );
  //         setLoading(false);
  //       });
  //   };

  const handleSubmit = async () => {

    const StoredEmail = user?.email;

    // Check if any of the fields are empty
    if (!subject || !description || !phoneNumber) {
      Alert.alert(
        'Validation Error',
        'Please fill in all fields before submitting.',
      );
      return; // Exit the function if any field is empty
    }

    // Regular expression to validate phone number (example: 10 digits)
    const phoneRegex = /^[0-9]{10}$/;

    // Validate the phone number
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number.',
      );
      return; // Exit the function if phone number is invalid
    }

    // Set loading to true when the submit button is pressed
    setLoading(true);

    // const email = 'adviserxiis@gmail.com'; // The recipient email
    // const subjectText = subject ? `Subject: ${subject}` : 'No Subject';
    // const bodyText = `Description: ${description}\nMobile Number: ${phoneNumber}`;

    try {
      // API endpoint for sending the email
      const apiUrl =
        'https://adviserxiis-backend-three.vercel.app/sendenquirymail'; // Update with your API endpoint

      // Make a POST request to the API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderEmail: StoredEmail, // You can replace this with the user's email or get it dynamically
          subject: subject,
          description: description,
          mobileNumber: phoneNumber,
        }),
      });

    //   console.log("Respone",response.text());
      
      const jsonRespone = await response.json();
      console.log("sjbhhsb",jsonRespone);
      if(response.status===200){
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      Alert.alert('Error', 'Failed to send email. Please try again.');
    } finally {
      setLoading(false); // Reset loading state after the API call
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: '#17191A',
        }}>
        <View
          style={{
            padding: 20,
          }}>
          <Text
            style={{
              color: '#838383',
              fontFamily: 'Poppins-Regular',
            }}>
            Subject
          </Text>
          <TextInput
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor="#838383"
            style={{
              height: 40,
              marginVertical: 10,
              paddingLeft: 10,
              color: 'white',
              borderRadius: 10,
              backgroundColor: '#3a3b3c',
            }}
          />
          <Text
            style={{
              color: '#838383',
              fontFamily: 'Poppins-Regular',
            }}>
            Description
          </Text>
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#838383"
            multiline={true}
            style={[
              styles.textInput,
              styles.descriptionInput,
              {height: descriptionHeight},
            ]}
            onContentSizeChange={e =>
              setDescriptionHeight(
                e.nativeEvent.contentSize.height > 80
                  ? e.nativeEvent.contentSize.height
                  : 80,
              )
            }
            textAlignVertical="top"
          />
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: '#838383',
            }}>
            Mobile Number
          </Text>

          <TextInput
            placeholder="Enter Your Mobile No.."
            placeholderTextColor="#838383"
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={{
              height: 40,
              marginVertical: 10,
              paddingLeft: 10,
              color: 'white',
              borderRadius: 10,
              backgroundColor: '#3a3b3c',
            }}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 5,
            backgroundColor: '#17191A',
          }}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 5,
          backgroundColor: '#17191A',
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: '#0069B4',
            paddingVertical: 14,
            borderRadius: 15,
          }}
          onPress={handleSubmit} // Call handleSubmit on press
        >
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-Regular',
              fontSize: 16,
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View> */}
    </>
  );
};

export default FeedBack;

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    marginVertical: 10,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: '#3a3b3c',
    color: 'white',
  },
  descriptionInput: {
    minHeight: 80, // Minimum height for multiline input
    paddingTop: 10,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#0069B4',
    paddingVertical: 13,
    borderRadius: 15,
  },
  submitButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});
