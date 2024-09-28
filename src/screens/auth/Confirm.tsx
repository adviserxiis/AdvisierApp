import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {storeData} from '../../utils/store';
import {setUser} from '../../features/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Confirm = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const submitHandle = async() => {
    const newErrors = {};
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid Email format';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/sendchangepasswordotp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            userid: user.userid,
          }),
        },
      );
      const jsonresponse = await response.json();
      console.log(jsonresponse);
      console.log(jsonresponse.userid);
  
      if (response.status === 200) {
        // dispatch(setUser({ email, userid: jsonresponse.userid }));  // Dispatch to update user in Redux
        await storeData('user', jsonresponse.userid);
        AsyncStorage.setItem('user', jsonresponse.userid);
        AsyncStorage.setItem('user1', email);
        // AsyncStorage.setItem('user', email);
        // console.log(navigation.getState().routes);
        // console.log(navigation);  // Ensure navigation is defined
        navigation.navigate('Otp');  // Ensure case matches
      } else {
        setErrors('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setErrors('Failed to login. Please try again.');
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
        Confirm your email
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: 'white',
          opacity: 0.3,
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
        }}>
        Enter the email associated with your account and we’ll send an email
        with code to reset your password
      </Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          width: '100%',
          gap: 10,
        }}>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#838383"
          value={email}
          onChangeText={setEmail}
          style={{
            width: '100%',
            height: 52,
            color: 'white',
            marginTop: 40,
            opacity: 0.8,
            fontFamily: 'Poppins-Regular',
            alignItems: 'center',
            borderBottomColor: '#EDEDED',
            borderBottomWidth: 1,
          }}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </KeyboardAvoidingView>

      <Pressable
        onPress={submitHandle}
        style={{
          width: '100%',
          padding: 14,
          backgroundColor: '#388DEB',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          marginVertical: 20,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            fontFamily: 'Poppins-Medium',
          }}>
          Send Code
        </Text>
      </Pressable>
    </View>
  );
};

export default Confirm;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: -10,
  },
});
