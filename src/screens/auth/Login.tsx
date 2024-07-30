import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native';
import firebase from '../../api/firebase';
import {login, sendOTP} from '../../api/auth';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {storeData} from '../../utils/store';
import {setUser} from '../../features/user/userSlice';
import {useDispatch} from 'react-redux';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin'



const Login = () => {
  const navigation = useNavigation();
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const [confirmation, setConfirmation] = useState(null); 

  const validatePhoneNumber = phone => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  useEffect(()=>{
    GoogleSignin.configure({
      webClientId:'553796556466-btiglu1cssg04entlq545n5bknsuqdef.apps.googleusercontent.com'
    })
  },[])

  const onSubmitHandler = async (number: String) => {
    // const res = await login(number);
    // console.log('res', res);
    if (!validatePhoneNumber(number)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');

    console.log('check');
    try {
      const formattedNumber = `+91${number}`;
      const confirmationResult = await sendOTP(formattedNumber); 
      setConfirmation(confirmationResult); // Store the confirmation result
      storeData('mobile_number', formattedNumber);
      dispatch(setUser(formattedNumber));
      navigation.navigate('Otp', { phoneNumber: formattedNumber, confirmation: confirmationResult });
    } catch (error) {
      console.log(error);
      setError('Failed to send OTP. Please try again.');
    }

    setNumber('');
  };

  const signIn = async()=>{
    try{
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    }
    catch(error){
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In...');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available');
      } else {
        console.log(error,'Some Other Error Happened');
      }
    }
  }

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <Image source={require('../../assets/images/logo.png')} />
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
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.userImage}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Pressable
        style={styles.loginBtnContainer}
        onPress={() => onSubmitHandler(number)}>
        <Text style={styles.loginTxt}>Login</Text>
      </Pressable>
      <View style={styles.dividerContainer}>
        <View style={styles.Fdivider} />
        <Text
          style={{
            fontSize: 16,
            color: '#FFFFFF',
            marginHorizontal: 10,
            fontFamily: 'Poppins-Regular',
          }}>
          or
        </Text>
        <View style={styles.Sdivider} />
      </View>
      <TouchableOpacity
        style={{
          width: 280,
          padding: 18,
          backgroundColor: '#F7F7F7',
          borderRadius: 10,
          alignItems: 'center',
          marginVertical: 10,
        }} onPress={signIn}>
        <Text
          style={{
            fontSize: 16,
            color: 'black',
            fontFamily: 'Poppins-Regular',
            fontWeight: '700',
          }}>
          Sign In with Google
        </Text>
      </TouchableOpacity>
      <Text style={styles.bottomTxt}>
        by creating an account, you agree to our’s{' '}
        <Text
          style={{
            textDecorationLine: 'underline',
          }}>
          Privacy Policy
        </Text>{' '}
        and{' '}
        <Text
          style={{
            textDecorationLine: 'underline',
          }}>
          Terms of Use.
        </Text>
      </Text>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: '#FFFFFF',
    // fontWeight: '700',
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
    marginHorizontal: 10,
  },
  input: {
    color: '#FFFFFF',
    borderWidth: 2,
    padding: 15,
    marginHorizontal: 10,
    width: '81%',
    backgroundColor: '#323232',
    borderRadius: 12,
    fontSize: 15,
    letterSpacing: 0,
  },
  loginBtnContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    width: '80%',
    marginVertical: 20,
    borderRadius: 10,
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
    width: '80%',
    marginTop:10,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    fontSize: 12,
    paddingLeft: 45,
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
});
