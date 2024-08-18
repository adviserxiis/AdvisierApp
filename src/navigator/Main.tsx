// App.js
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';
import Home from '../screens/home/home';
import User from '../screens/user/user';
import Profile from '../screens/profile/profile';
import Icon from 'react-native-vector-icons/Feather';
import Search from '../screens/search/Search';
import AddPost from '../screens/add/AddPost';
import SetProfile from '../screens/auth/SetProfile';
import UpdateProfile from '../screens/profile/screen/UpdateProfile';

// Bottom Tabs
const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarLabel:'',
        tabBarStyle:{
          height: 70,
          borderColor:'#17191A',
          paddingTop:10,
          backgroundColor:'#17191A',
        },
        tabBarInactiveTintColor:'white',
        tabBarHideOnKeyboard:true,
        tabBarIcon: ({color, size}) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'AddPost':
              iconName = 'plus';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name='AddPost' component={AddPost}/>
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

// Stack Navigator
const Stack = createStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={MyTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="updateProfile"
        component={UpdateProfile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default function Main() {
  return <MyStack />;
}
