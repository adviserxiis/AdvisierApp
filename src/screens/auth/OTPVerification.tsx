import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {storeData} from './../../utils/store';
import {setUser} from '../../features/user/userSlice';
import { sendOTP } from './../../api/auth';
const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigation = useNavigation();
  const route = useRoute();
  const otpInput = useRef([]);
  const [loading, setLoading] = useState(false);
  const phoneNumber = route.params?.phoneNumber;
  const confirmation = route.params?.confirmation;
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [resendLoading, setResendLoading] = useState(false);
  const dispatch = useDispatch();
  const [error, setError] = useState('');

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

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== otp.length) {
      setError('Please enter the complete OTP.');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }
    setLoading(true);
    setError('');

    try {
      await confirmation.confirm(otpCode);
      storeData('mobile_number', phoneNumber);
      dispatch(setUser(phoneNumber));
      setTimeout(() => {
        navigation.navigate('Thanks');
      }, 2000);
    } catch (error) {
      console.error('Invalid OTP. Please try again.', error);
      setError('Invalid OTP. Please try again!.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [phoneNumber]);

  const startTimer = () => {
    setTimer(30); // 30 seconds timer
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    // Handle resending OTP code logic here
    if (timer > 0) return;

    setResendLoading(true);
    try {
      const newConfirmation = await sendOTP(phoneNumber);
      route.params.confirmation = newConfirmation;
      startTimer();
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        Enter the code we’ve sent to your phone number {phoneNumber}
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
              if (nativeEvent.key === 'Backspace' && !opt[index]) {
                if (index > 0) {
                  otpInput.current[index - 1].focus();
                }
              }
            }}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={handleResendCode}
        disabled={timer > 0 || resendLoading}>
        {resendLoading ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : (
          <Text style={styles.resendCode}>
            {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code'}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={handleVerify}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text style={styles.verifyButtonText}>Verify</Text>
        )}
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 32,
    marginHorizontal: 30,
    fontFamily: 'Poppins-Regular',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 8,
    width:35
  },
  resendText: {
    color: '#007BFF',
    fontSize: 14,
    marginBottom: 32,
    fontFamily: 'Poppins-Medium',
  },
  verifyButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 32,

    width: '80%',
  },
  verifyButtonText: {
    color: '#000000',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  resendCode: {
    color: '#007BFF',
    marginVertical: 20,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Poppins-Medium',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 16,
    position: 'absolute',
    bottom: 40,
    fontFamily: 'Poppins-Regular',
  },
});

export default OTPVerification;
