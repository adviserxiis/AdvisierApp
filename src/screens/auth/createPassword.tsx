import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,

  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {storeData} from '../../utils/store';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../features/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreatePassword = () => {
  const navigation = useNavigation();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  // const handleRegister =async()=>{
  //   const newErrors = {};

  //   if (!password) {
  //     newErrors.password = 'Password is required';
  //   } else if (password.length < 6) {
  //     newErrors.password = 'Password must be at least 6 characters';
  //   }

  //   if (!confirmPassword) {
  //     newErrors.confirmPassword = 'Confirm Password required';
  //   } else if (confirmPassword !== password) {
  //     newErrors.confirmPassword = 'Passwords do not match';
  //   }

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   try {
  //     const userData = AsyncStorage.getItem('user');
  //     console.log(userData);
  //     const response = await fetch(
  //       'https://adviserxiis-backend-three.vercel.app/creator/resetpassword',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           password: password,
  //           userid: userData,
  //         }),
  //       },
  //     );
  //     const jsonresponse = await response.json();
  //     console.log(jsonresponse);

  //     if (response.status === 200) {
  //       storeData('user', jsonresponse.userid);
  //       dispatch(setUser({password, userid: jsonresponse.userid}));
  //       // navigation.navigate('setProfile');
  //       navigation.navigate('Login');
  //     } else {
  //       setErrors('Login failed. Please check your credentials.');
  //     }
  //   } catch (error) {
  //     console.error('Login Error:', error);
  //     setErrors('Failed to login. Please try again.');
  //   }

  //   setErrors({});
  // }

  // const handleRegister = async () => {
  //   const newErrors = {};

  //   // Validation for password
  //   if (!password) {
  //     newErrors.password = 'Password is required';
  //   } else if (password.length < 6) {
  //     newErrors.password = 'Password must be at least 6 characters';
  //   }

  //   // Validation for confirm password
  //   if (!confirmPassword) {
  //     newErrors.confirmPassword = 'Confirm Password required';
  //   } else if (confirmPassword !== password) {
  //     newErrors.confirmPassword = 'Passwords do not match';
  //   }

  //   // Check if there are any validation errors
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   try {
  //     // Retrieve the user data from AsyncStorage and parse it
  //     const userData = await AsyncStorage.getItem('user');
  //     const parsedUserData = userData ? JSON.parse(userData) : null;

  //     if (!parsedUserData || !parsedUserData.userid) {
  //       console.error('User ID not found in AsyncStorage');
  //       setErrors({ general: 'User data not found. Please try again.' });
  //       return;
  //     }

  //     console.log('User Data:', parsedUserData);

  //     // Send the API request
  //     const response = await fetch(
  //       'https://adviserxiis-backend-three.vercel.app/creator/resetpassword',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           password: password,
  //           userid: parsedUserData.userid,  // Correctly pass the userId from parsed data
  //         }),
  //       }
  //     );

  //     const jsonResponse = await response.json();
  //     console.log('Response:', jsonResponse);

  //     // Check if the request was successful
  //     if (response.status === 200) {
  //       // Save the new user data and navigate to login
  //       storeData('user', jsonResponse.userid);
  //       dispatch(setUser({ password, userid: jsonResponse.userid }));
  //       navigation.navigate('Login');
  //     } else {
  //       setErrors({ general: jsonResponse.error || 'Failed to reset password.' });
  //     }
  //   } catch (error) {
  //     console.error('Error during password reset:', error);
  //     setErrors({ general: 'Failed to reset password. Please try again.' });
  //   }
  // };

  const handleRegister = async () => {
    const newErrors = {};
  
    // Validation checks
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
  
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password required';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const userData = await AsyncStorage.getItem('user');
      console.log('Raw User Data from AsyncStorage:', userData); // Log the raw user data
  
      // console.log('Parsed User Data:', parsedUserData);
  
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/resetpassword',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: password,
            userid: userData, // Pass the userId from parsed data
          }),
        }
      );
  
      const responseText = await response.text(); // Get the raw response
      console.log('Raw Response:', responseText); // Log the raw response
  
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(responseText); // Attempt to parse the JSON response
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        setErrors({ general: 'Unexpected response format. Please try again later.' });
        return;
      }
  
      if (response.status === 200) {
        storeData('user', JSON.stringify({ userid: jsonResponse.userid })); // Store user data correctly
        // dispatch(setUser({ password, userid: jsonResponse.userid }));
        navigation.navigate('Login');
      } else {
        setErrors({ general: jsonResponse.error || 'Failed to reset password.' });
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setErrors({ general: 'Failed to reset password. Please try again.' });
    }
  };
  

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 100,
        alignItems: 'center',
        backgroundColor: '#17191A',
        paddingHorizontal: 20,
      }}>
      <StatusBar barStyle="light-content" backgroundColor={'#17191A'} />
      <Text
        style={{
          fontSize: 20,
          color: 'white',
          textAlign: 'center',
          fontFamily: 'Poppins-Medium',
        }}>
        Create new password
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: 'white',
          opacity: 0.3,
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
        }}>
        Welcome back! Please enter your details
      </Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          width: '100%',
          paddingTop: 40,
          gap: 10,
        }}>
        <TextInput
          placeholder="Create Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#838383"
          style={{
            width: '100%',
            height: 52,
            fontSize: 15,
            color: 'white',
            fontFamily: 'Poppins-Regular',
            borderBottomWidth: 1,
            borderBottomColor: '#EDEDED',
            opacity: 0.8,
          }}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#838383"
          style={{
            width: '100%',
            height: 52,
            fontSize: 15,
            color: 'white',
            fontFamily: 'Poppins-Regular',
            borderBottomWidth: 1,
            borderBottomColor: '#EDEDED',
            opacity: 0.8,
          }}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </KeyboardAvoidingView>

      <Pressable
        onPress={handleRegister}
        style={{
          width: '100%',
          padding: 14,
          backgroundColor: '#388DEB',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          marginTop: 30,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            fontFamily: 'Poppins-Medium',
          }}>
          Register
        </Text>
      </Pressable>
    </View>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: -10,
  },
});
