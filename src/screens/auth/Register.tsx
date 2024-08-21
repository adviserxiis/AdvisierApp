import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {storeData} from '../../utils/store';
import {setUser} from '../../features/user/userSlice';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
const Register = () => {
  const navigation = useNavigation();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '553796556466-btiglu1cssg04entlq545n5bknsuqdef.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSign = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      await auth().signInWithCredential(googleCredential);
      storeData('user', userInfo.user);
      dispatch(
        setUser({
          email: userInfo.user.email,
          // password: '',
          userid: userInfo.idToken,
        }),
      );
      navigation.navigate('setProfile');
    } catch (error: any) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.log('User Cancelled the Login Flow');
          break;
        case statusCodes.IN_PROGRESS:
          console.log('Signing In...');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log('Play Services Not Available');
          break;
        default:
          console.log('Some Other Error Happened', error);
      }
    }
  };

  const handleRegister = async () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!rememberMe) {
      Alert.alert('Terms and Conditions', 'You must agree to the terms and conditions.');
      return;
    }

    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      );
      const jsonresponse = await response.json();
      console.log('Hello', jsonresponse);
      if (jsonresponse.success) {
        // Alert.alert('Success', 'Registration successful');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', jsonresponse.message || 'Email Address already exists!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during registration');
    }
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#17191A" />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Poppins-Medium',
            color: '#fff',
          }}>
          Register to join us
        </Text>
        <Text
          style={{
            color: '#838383',
            fontSize: 14,
            fontFamily: 'Poppins-Regular',
          }}>
          Welcome back! Please enter your details.{' '}
        </Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            width: '100%',
            paddingTop: 40,
            gap: 10,
          }}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#838383"
            value={email}
            onChangeText={setEmail}
            style={{
              width: '100%',
              height: 52,
              fontSize: 15,
              color: '#fff',
              fontFamily: 'Poppins-Regular',
              borderBottomWidth: 1,
              borderBottomColor: '#EDEDED',
              opacity: 0.8,
            }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <TextInput
            placeholder="Create Password"
            secureTextEntry
            placeholderTextColor="#838383"
            value={password}
            onChangeText={setPassword}
            style={{
              width: '100%',
              height: 52,
              fontSize: 15,
              color: '#fff',
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
            placeholderTextColor="#838383"
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              if (text === password) {
                setErrors({...errors, confirmPassword: ''});
              }
            }}
            style={{
              width: '100%',
              height: 52,
              fontSize: 15,
              color: '#fff',
              fontFamily: 'Poppins-Regular',
              borderBottomWidth: 1,
              borderBottomColor: '#EDEDED',
              opacity: 0.8,
            }}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}>
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Icon name="check" size={14} color="#17191A" />}
              </View>
              <Text style={styles.checkboxText}>
                I agree to Terms and Condition
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            style={{
              backgroundColor: '#388DEB',
              padding: 15,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              marginTop: 16,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: 'white',
                textAlign: 'center',
              }}>
              Register
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <View
              style={{
                height: 1,
                backgroundColor: '#D9D9D9',
                width: '43%',
              }}
            />
            <Text
              style={{
                color: '#838383',
                fontSize: 16,
                fontFamily: 'Poppins-Regular',
                marginHorizontal: 7,
                opacity: 0.5,
              }}>
              Or
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: '#D9D9D9',
                width: '43%',
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}>
            <Pressable
              style={{
                padding: 14,
                width: '100%',
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: '#EDEDED',
                borderRadius: 12,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }} onPress={handleGoogleSign}>
              <Image
                source={require('../../assets/images/google.png')}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  textAlign: 'center',
                }}>
                Continue with Google
              </Text>
            </Pressable>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'center',
                gap: 4,
                marginTop: 5,
              }}>
              <Text
                style={{
                  color: '#838383',
                  fontSize: 12,
                  opacity: 0.4,
                  fontFamily: 'Poppins-Regular',
                }}>
                Have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#17191A',
    flex: 1,
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  checkboxChecked: {
    backgroundColor: '#388DEB',
    borderColor: 'black',
  },
  checkboxText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: -10,
  },
});
