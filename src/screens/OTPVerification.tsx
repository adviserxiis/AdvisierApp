import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerify = () => {
    // Handle OTP verification logic here
  };

  const handleResendCode = () => {
    // Handle resending OTP code logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        Enter the code we’ve sent to your phone number +1 123 456 789
      </Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={value => handleOtpChange(value, index)}
          />
        ))}
      </View>
      <TouchableOpacity onPress={handleResendCode}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 32,
    marginHorizontal: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    width: 50,
  },
  resendText: {
    color: '#007BFF',
    fontSize: 16,
    marginBottom: 32,
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
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default OTPVerification;
