import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { storeData } from '../../utils/store';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../features/user/userSlice';

const CreatePassword = () => {
  const navigation = useNavigation();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.user);
  const handleRegister =async()=>{
    const newErrors = {};

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
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/resetpassword',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: password,
            userid: user.userid,
          }),
        },
      );
      const jsonresponse = await response.json();
      console.log(jsonresponse);

      if (response.status === 200) {
        storeData('user', jsonresponse.userid);
        dispatch(setUser({password, userid: jsonresponse.userid}));
        // navigation.navigate('setProfile');
        navigation.navigate('Login');
      } else {
        setErrors('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setErrors('Failed to login. Please try again.');
    }

    setErrors({});
  }

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
          secureTextEntry value={password} onChangeText={setPassword}
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
         {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword}
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
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      </KeyboardAvoidingView>
      


      <Pressable onPress={handleRegister}
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
