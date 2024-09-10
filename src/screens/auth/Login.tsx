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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {getData, storeData} from '../../utils/store';
import {setUser} from '../../features/user/userSlice';
import {useDispatch} from 'react-redux';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Mixpanel} from 'mixpanel-react-native';

const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(
  'f03fcb4e7e5cdc7d32f57611937c5525',
  trackAutomaticEvents,
);
mixpanel.init();

// import Mixpanel from 'react-native-mixpanel';

// Mixpanel.sharedInstanceWithToken('f03fcb4e7e5cdc7d32f57611937c5525');

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '553796556466-btiglu1cssg04entlq545n5bknsuqdef.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSign = async () => {
    setGoogleLoading(true);
    const device_token = await AsyncStorage.getItem('device-Token');
    console.log('Debic', device_token);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      await auth().signInWithCredential(googleCredential);

      // const token = await messaging().getToken();
      // if (token) {
      //   await AsyncStorage.setItem('user', token);
      // }

      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/signinwithgoogle',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userInfo.user.email,
            username: userInfo.user.name,
            profile_photo: userInfo.user.photo,
            deviceToken: device_token,
          }),
        },
      );
      const jsonresponse = await response.json();
      console.log('jahs', jsonresponse);
      console.log('useird', jsonresponse.userid);
      const newData = {
        userid: jsonresponse.userid,
        name: userInfo.user.name,
        email: userInfo.user.email,
        profile_photo: userInfo.user.photo,
      };
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({
          name: userInfo.user.name,
          email: userInfo.user.email,
          profile_photo: userInfo.user.photo,
          userid: jsonresponse.userid,
        }),
      );
      // await AsyncStorage.setItem('user', JSON.stringify(newData));
      storeData('user', newData);
      dispatch(
        setUser({
          email: userInfo.user.email,
          username: userInfo.user.name,
          userid: jsonresponse.userid,
          profile_photo: userInfo.user.photo,
        }),
      );
      // const isExists = await checkProfileExist(jsonresponse.userid);
      // if (isExists) {
      //   navigation.reset({
      //     index: 0,
      //     routes: [{ name: 'Main' }],
      //   });
      // } else {
      //   navigation.navigate('setProfile');
      // }

      // Track the login event
      mixpanel.identify(jsonresponse.userid); // Identifies the user by unique ID
      mixpanel.getPeople().set({
        $email: userInfo.user.email, // Set properties like email
        $name: userInfo.user.name, // Set user's name// Any custom properties
      });
      // mixpanel.setLoggingEnabled(true);
      mixpanel.track('Creator Login', {
        userID: jsonresponse.userid,
        email: userInfo.user.email,
      });

      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
      
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
    } finally {
      setGoogleLoading(false); // Hide loading overlay
    }
  };

  const checkProfileExist = async userid => {
    try {
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/creator/getuser/${userid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const jsonresponse = await response.json();
      console.log('checkProfileExist', jsonresponse);
      if (jsonresponse.professional_title) {
        // Store the data in AsyncStorage before returning true
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({
            name: jsonresponse.username,
            professional_title: jsonresponse.professional_title,
            discription: jsonresponse.professional_bio,
            interests: jsonresponse.interests,
            social_links: jsonresponse.social_links,
            profile_photo: jsonresponse.profile_photo,
            profile_background: jsonresponse.profile_background,
            userid: userid,
          }),
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking profile existence:', error);
      return false; // In case of error, assume profile does not exist
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newError: any = {};

    if (!email) {
      newError.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newError.email = 'Invalid email format.';
    }

    if (!password) {
      newError.password = 'Password is required.';
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      setLoading(false);
      return;
    }

    const device_token = await AsyncStorage.getItem('device-Token');
    console.log('Debic', device_token);

    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/creator/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
            deviceToken: device_token,
          }),
        },
      );
      const jsonresponse = await response.json();

      if (response.status === 200) {
        storeData('user', jsonresponse.userid);
        dispatch(setUser({email, password, userid: jsonresponse.userid}));
        const isExists = await checkProfileExist(jsonresponse.userid);

        // Track the login event
        mixpanel.identify(jsonresponse.userid); // Identifies the user by unique ID
        mixpanel.getPeople().set({
          $email: email,
        });
        // mixpanel.setLoggingEnabled(true);
        mixpanel.track('Creator Login', {
          userID: jsonresponse.userid,
          email: email,
        });

        if (isExists) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Main'}],
          });
        } else {
          navigation.navigate('setProfile');
        }
      } else if (response.status === 401) {
        setError({password: 'Incorrect email or password. Please try again.'});
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = (text: string) => {
    setEmail(text);
    if (error.email) {
      setError(prevError => ({...prevError, email: ''}));
    }
  };

  const handleChangePassword = (text: string) => {
    setPassword(text);
    if (error.password) {
      setError(prevError => ({...prevError, password: ''}));
    }
  };

  const LoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#17191A" />
      {googleLoading && <LoadingOverlay />}
      <View style={styles.centeredView}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.infoText}>
          Welcome back! Please enter your details.
        </Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#838383"
            value={email}
            onChangeText={handleChangeEmail}
            style={styles.input}
          />
          {error.email && <Text style={styles.errorText}>{error.email}</Text>}
          <TextInput
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#838383"
            value={password}
            onChangeText={handleChangePassword}
            style={styles.input}
          />
          {error.password && (
            <Text style={styles.errorText}>{error.password}</Text>
          )}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkboxWrapper}
              onPress={() => setRememberMe(!rememberMe)}>
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Icon name="check" size={14} color="black" />}
              </View>
              <Text style={styles.checkboxText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('confirm')}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.divider} />
          </View>
          <Pressable onPress={handleGoogleSign} style={styles.googleButton}>
            <Image
              source={require('../../assets/images/google.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#17191A',
    flex: 1,
    paddingHorizontal: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  infoText: {
    color: '#838383',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  keyboardAvoidingView: {
    width: '100%',
    paddingTop: 40,
    gap: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure it's on top of all other content
  },
  input: {
    width: '100%',
    height: 52,
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    opacity: 0.8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: -10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderColor: '#EDEDED',
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
  forgotPasswordText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    backgroundColor: '#388DEB',
    padding: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: 16,
  },
  loginButtonText: {
    fontFamily: 'Poppins-Medium',
    color: 'white',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    width: '43%',
  },
  orText: {
    color: '#838383',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 7,
    opacity: 0.5,
  },
  googleButton: {
    padding: 14,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    borderColor: '#EDEDED',
    gap: 6,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 1,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 4,
    marginTop: 5,
  },
  registerText: {
    color: '#838383',
    fontSize: 12,
    opacity: 0.4,
    fontFamily: 'Poppins-Regular',
  },
  registerLink: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
});

export default Login;
