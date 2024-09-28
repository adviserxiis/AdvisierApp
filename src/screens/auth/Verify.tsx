import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Verify = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const otpInput = useRef([]);
  const user = useSelector(state => state.user);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendMessage, setResendMessage] = useState('');

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      otpInput.current[index + 1].focus();
    } else if (!value && index > 0) {
      otpInput.current[index - 1].focus();
    }
  };

  useEffect(() => {
    let countdown;
    if (resendDisabled && timer > 0) {
      countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [resendDisabled, timer]);

  const handleResendCode = async () => {
    setTimer(50);
    setResendDisabled(true);
    setResendMessage('');
    // const emailid = await AsyncStorage.getItem('user1');
    // console.log(emailid);
    try {
      const userData = await AsyncStorage.getItem('user1');

      console.log('Email ID:', userData);

      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/sendchangepasswordotp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData,
          }),
        },
      );

      const jsonResponse = await response.json();
      console.log('sjs', jsonResponse);
      if (response.status === 200) {
        setResendMessage('A new OTP has been sent to your email.');
        setTimeout(() => {
          setResendMessage('');
        }, 3000);
      } else {
        setResendMessage(
          jsonResponse.error || 'Failed to resend OTP. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error during OTP resend:', error);
      setResendMessage('An unexpected error occurred. Please try again.');
    }
  };

  // const checkOTP = async () => {

  //   if (otp.some(digit => digit === '')) {
  //     setErrorMessage('Please enter the complete OTP.');
  //     setTimeout(() => {
  //       setErrorMessage('');
  //     }, 3000);
  //     return;
  //   }

  //   setErrorMessage('');
  //   const user1 = AsyncStorage.getItem('user',userid);
  //   console.log('OTP:', otp.join(''));
  //   console.log('User ID:', user1);
  //   try {
  //     const response = await fetch(
  //       'https://adviserxiis-backend-three.vercel.app/creator/verifychangepasswordotp',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           otp: otp.join(''),
  //           userid: user1
  //         }),
  //       },
  //     );
  //     const jsonResponse = await response.json();
  //     console.log("hai",jsonResponse);
  //     if (response.status === 200) {
  //       navigation.navigate('CreatePassword');
  //     } else {
  //       setErrorMessage(jsonResponse.error || 'Invalid OTP. Please try again.');
  //       setTimeout(() => {
  //         setErrorMessage('');
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     console.error('Error during OTP verification:', error);
  //     setErrorMessage('An unexpected error occurred. Please try again.');
  //   }
  // };

  // const checkOTP = async () => {
  //   // Check if OTP input is complete
  //   if (otp.some(digit => digit === '')) {
  //     setErrorMessage('Please enter the complete OTP.');
  //     setTimeout(() => {
  //       setErrorMessage('');
  //     }, 3000);
  //     return;
  //   }

  //   setErrorMessage('');

  //   try {
  //     // Retrieve the user data from AsyncStorage
  //     const userData = await AsyncStorage.getItem('user');

  //     // Parse the user data (ensure it's parsed correctly)
  //     const parsedUserData = userData ? JSON.parse(userData) : null;

  //     // Check if we have a valid user object
  //     if (!parsedUserData || !parsedUserData.userid) {
  //       setErrorMessage('User ID not found.');
  //       return;
  //     }

  //     const userId = parsedUserData.userid; // Extract the user ID

  //     console.log('OTP:', otp.join(''));
  //     console.log('User ID:', userId);

  //     // Send OTP verification request
  //     const response = await fetch(
  //       'https://adviserxiis-backend-three.vercel.app/creator/verifychangepasswordotp',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           otp: otp.join(''),
  //           userid: userId, // Use the parsed user ID
  //         }),
  //       },
  //     );

  //     const jsonResponse = await response.json();
  //     console.log('Response:', jsonResponse);

  //     // Check if OTP verification was successful
  //     if (response.status === 200) {
  //       navigation.navigate('CreatePassword');
  //     } else {
  //       setErrorMessage(jsonResponse.error || 'Invalid OTP. Please try again.');
  //       setTimeout(() => {
  //         setErrorMessage('');
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     console.error('Error during OTP verification:', error);
  //     setErrorMessage('An unexpected error occurred. Please try again.');
  //   }
  // };

  const checkOTP = async () => {
    if (otp.some(digit => digit === '')) {
      setErrorMessage('Please enter the complete OTP.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }
  
    setErrorMessage('');
  
    try {
      // Get user data from AsyncStorage
      const userData1 = await AsyncStorage.getItem('user');
      // const parsedUserData = userData ? JSON.parse(userData) : null;
  
      // if (!parsedUserData || !parsedUserData.userid) {
      //   console.error('User ID not found in AsyncStorage');
      //   setErrorMessage('User data not found. Please try again.');
      //   return;
      // }
  
      console.log('OTP:', otp.join(''));
      console.log('User ID:', userData1);
  
      // Make the API request
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/verifychangepasswordotp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            otp: otp.join(''),
            userid: userData1,
          }),
        }
      );
  
      // Parse the response
      const jsonResponse = await response.json();
      console.log('Parsed Response:', jsonResponse);
  
      if (response.status === 200) {
        navigation.navigate('CreatePassword');
      } else {
        setErrorMessage(
          jsonResponse.error || 'Invalid OTP. Please try again.'
        );
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
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
        Verify OTP
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: 'white',
          opacity: 0.3,
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
        }}>
        Enter your OTP which has been sent to your email and complete verify
        your account.
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (otpInput.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={value => handleOtpChange(value, index)}
            autoFocus={index === 0}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Backspace' && !otp[index]) {
                if (index > 0) {
                  otpInput.current[index - 1].focus();
                  const newOtp = [...otp];
                  newOtp[index - 1] = '';
                  setOtp(newOtp);
                }
              }
            }}
          />
        ))}
      </View>

      <View style={styles.resendContainer}>
        {resendDisabled ? (
          <>
            <Text style={styles.infoText}>
              A code has been sent to your email id
            </Text>
            <Text style={styles.resendText}>
              Resend in 00:{timer < 10 ? `0${timer}` : timer}
            </Text>
          </>
        ) : (
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.resendButtonText}>Resend Code</Text>
          </TouchableOpacity>
        )}
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* {resendMessage ? (
        <Text style={styles.resendMessageText}>{resendMessage}</Text>
      ) : null} */}

      <Pressable
        onPress={checkOTP}
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
          Continue
        </Text>
      </Pressable>
    </View>
  );
};

export default Verify;

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  otpInput: {
    width: 45,
    height: 45,
    borderBottomWidth: 1,
    borderColor: '#EDEDED',
    color: 'white',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontSize: 18,
  },
  resendContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  resendText: {
    fontSize: 12,
    color: '#388DEB',
    fontFamily: 'Poppins-Medium',
  },
  resendButtonText: {
    fontSize: 12,
    color: '#388DEB',
    fontFamily: 'Poppins-Medium',
  },
  resendMessageText: {
    fontSize: 12,
    color: '#00FF00',
    fontFamily: 'Poppins-Regular',
    marginTop: 5,
  },
  infoText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    opacity: 0.5,
  },
});
