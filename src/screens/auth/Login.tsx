import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Pressable,
} from 'react-native';
import firebase from '../../api/firebase';
import {login, sendOTP} from '../../api/auth';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {storeData} from '../../utils/store';
import {setUser} from '../../features/user/userSlice';
import {useDispatch} from 'react-redux';
const Login = () => {
  const navigation = useNavigation();
  const [number, setNumber] = useState('');
  const dispatch = useDispatch();

  const onSubmitHandler = async (number: String) => {
    // const res = await login(number);
    // console.log('res', res);
    console.log('check');
    // navigation.navigate('Otp');
    const res = await sendOTP('+918287228020');
    if (res._auth._config.statics.PhoneAuthState.CODE_SENT === 'sent') {
      storeData('mobile_number', '+918287228020');
      dispatch(setUser('+918287228020'));
    }
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <Image source={require('../../assets/images/logo.png')} />
      <Text style={styles.heading}>Sign in or create Account</Text>
      <Text style={styles.subHeading}>
        Hello! Looks like you’re enjoying our page, but you haven’t signed up
        for an account yet.
      </Text>
      <TextInput
        style={styles.input}
        value={number}
        onChangeText={val => setNumber(number)}
        placeholderTextColor="#FFFFFF"
        placeholder="Phone Number"
      />
      <Pressable
        style={styles.loginBtnContainer}
        onPress={() => onSubmitHandler(number)}>
        <Text style={styles.loginTxt}>Login</Text>
      </Pressable>
      <Text style={styles.bottomTxt}>
        by creating an account, you agree to our’s Privacy Policy and Terms of
        Use.
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
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  input: {
    color: '#FFFFFF',
    borderWidth: 2,
    padding: 15,
    marginHorizontal: 10,
    width: '80%',
    backgroundColor: '#323232',
    borderRadius: 12,
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
  },
  bottomTxt: {
    color: '#FFFFFF',
    marginHorizontal: 25,
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center',
  },
});
