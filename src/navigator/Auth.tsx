import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from '../screens/auth/Login';
import OTPVerification from '../screens/auth/OTPVerification';
import Thanks from '../screens/thanks/thanks';
const Stack = createStackNavigator();
const Auth = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Otp"
        component={OTPVerification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Thanks"
        component={Thanks}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default Auth;
