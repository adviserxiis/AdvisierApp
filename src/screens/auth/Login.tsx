import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  View,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { storeData } from '../../utils/store';
import { setUser } from '../../features/user/userSlice';
import { useDispatch } from 'react-redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { sendOTP } from '../../api/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
const Login = () => {
  const navigation = useNavigation();
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading
  const dispatch = useDispatch();

  const validatePhoneNumber = phone => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '553796556466-btiglu1cssg04entlq545n5bknsuqdef.apps.googleusercontent.com',
    });
  }, []);

  const onSubmitHandler = async (number: String) => {
    if (!validatePhoneNumber(number)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
  
    try {
      const formattedNumber = `+91${number}`;
      const confirmationResult = await sendOTP(formattedNumber);
      setConfirmation(confirmationResult);
      storeData('mobile_number', formattedNumber);
      dispatch(setUser(formattedNumber));
      navigation.navigate('Otp', { phoneNumber: formattedNumber, confirmation: confirmationResult });
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        setError('We have blocked all requests from this device due to unusual activity. Try again later.');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
      console.log(error);
    }
  
    setNumber('');
  };

  const signIn = async () => {
    setLoading(true); // Start loading indicator
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
    await auth().signInWithCredential(googleCredential);
    storeData('user', userInfo.user.email);
    dispatch(setUser({email: userInfo.user.email, token: userInfo.idToken}));
    navigation.navigate('Thanks');
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User Cancelled the Login Flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Signing In...');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play Services Not Available');
    } else if (error.code === 'auth/too-many-requests') {
      setError('We have blocked all requests from this device due to unusual activity. Try again later.');
    } else {
      console.log(error, 'Some Other Error Happened');
    }
  } finally {
    setLoading(false); // Stop loading indicator
  }
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.innerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.heading}>Sign in or create Account</Text>
        <Text style={styles.subHeading}>
          Hello! Looks like you’re enjoying our page, but you haven’t signed up
          for an account yet.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={number => {
              setNumber(number);
              if (error) setError('');
            }}
            placeholderTextColor="#FFFFFF"
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
          <Image source={require('../../assets/images/user.png')} style={styles.userImage} />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable style={styles.loginBtnContainer} onPress={() => onSubmitHandler(number)}>
          <Text style={styles.loginTxt}>Login</Text>
        </Pressable>
        <View style={styles.dividerContainer}>
          <View style={styles.Fdivider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.Sdivider} />
        </View>
        <Pressable style={styles.googleBtnContainer} onPress={signIn}>
          {loading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <View style={styles.googleBtnContent}>
              <AntDesign name="google" size={20} color="#000000" style={styles.googleLogo} /> 
              <Text style={styles.googleBtnText}>Sign In with Google</Text>
            </View>
          )}
        </Pressable>
        <Text style={styles.bottomTxt}>
          by creating an account, you agree to our’s{' '}
          <Text style={styles.underlineText}>Privacy Policy</Text> and{' '}
          <Text style={styles.underlineText}>Terms of Use.</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'black',
    flex: 1,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 60,
    objectFit: 'contain',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Poppins-Bold',
  },
  subHeading: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginVertical: 10,
    padding: 10,
    width: '110%',
    marginHorizontal: 10,
  },
  input: {
    color: '#FFFFFF',
    borderWidth: 2,
    padding: 15,
    marginHorizontal: 10,
    width: '100%',
    backgroundColor: '#323232',
    borderRadius: 12,
    fontSize: 15,
    letterSpacing: 0,
  },
  loginBtnContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 20,
    borderRadius: 10,
    width: '100%',
  },
  loginTxt: {
    textAlign: 'center',
    color: '#161616',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  bottomTxt: {
    color: '#FFFFFF',
    marginHorizontal: 25,
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    fontSize: 12,
    paddingLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    position: 'absolute',
    width: 20,
    height: 20,
    right: 30,
  },
  Fdivider: {
    width: 100,
    height: 1,
    backgroundColor: 'gray',
  },
  Sdivider: {
    width: 100,
    height: 1,
    backgroundColor: 'gray',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  orText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  googleBtnContainer: {
    width: '100%',
    padding: 18,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 7,
  },
  googleBtnText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontWeight: '700',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
});

export default Login;