import { useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from '../screens/auth/Login';
import SplashScreen from '../screens/auth/SplashScreen';
import Register from '../screens/auth/Register';
import SetProfile from '../screens/auth/SetProfile';
import Main from './Main';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import CreatePassword from '../screens/auth/createPassword';
import OTPVerification from '../screens/auth/OTPVerification';
import Verify from '../screens/auth/Verify';
import Confirm from '../screens/auth/Confirm';
const Stack = createStackNavigator();
const Auth = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);

  // useEffect(() => {
  //   if (user) {
  //     navigation.navigate('Main');
  //   }else{
  //     navigation.navigate('setProfile');
  //   }
  // }, [user, navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name='Splash'
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen 
      name='confirm'
      component={Confirm}
      options={{
        headerShown: false,
      }}/>
      <Stack.Screen
      name='Otp'
      component={Verify}
      options={{
        headerShown: false,
      }}/>
      <Stack.Screen 
       name='CreatePassword'
       component={CreatePassword}
        options={{
          headerShown: false,
        }}
       />
      <Stack.Screen 
      name="setProfile"
      component={SetProfile}
      options={{
        headerShown: false,
        }}
      />
      <Stack.Screen name='Main' component={Main} options={{
        headerShown: false,
      }}/>
    </Stack.Navigator>
  );
};

export default Auth;
