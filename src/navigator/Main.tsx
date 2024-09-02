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
import UpdateProfile from '../screens/profile/screen/UpdateProfile';
import ViewProfile from '../screens/home/screen/ViewProfile';
import SingleReel from '../screens/home/screen/SingleReel';
// import Login from '../screens/auth/Login';

//Home Stack
const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="MainHome"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="ViewProfile"
        component={ViewProfile}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="singleReel"
        component={SingleReel}
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

//Post Stack
const PostStack = createStackNavigator();
function PostStackScreen() {
  return (
    <PostStack.Navigator>
      {/* <PostStack.Screen 
        name='MainPost'
        component={CameraGallery}
        options={{
          headerShown: false,
        }}
      /> */}
      <PostStack.Screen
        name="CreatePost"
        component={AddPost}
        options={{
          headerShown: false,
        }}
      />
    </PostStack.Navigator>
  );
}

//Search Stack
const SearchStack = createStackNavigator();
function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchMain"
        component={Search}
        options={{
          headerShown: false,
        }}
      />
      <SearchStack.Screen
        name="ViewProfile"
        component={ViewProfile}
        options={{
          headerShown: false,
        }}
      />
    </SearchStack.Navigator>
  );
}

//Profile Stack
const ProfileStack = createStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="singleReel"
        component={SingleReel}
        options={{
          headerShown: false,
        }}
      />
    </ProfileStack.Navigator>
  );
}
// Bottom Tabs
const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarLabel: '',
        tabBarStyle: {
          height: 64,
          borderColor: '#17191A',
          paddingTop: 10,
          backgroundColor: '#17191A',
        },
        tabBarInactiveTintColor: 'white',
        tabBarHideOnKeyboard: true,
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
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="AddPost" component={PostStackScreen} />
      <Tab.Screen name="Search" component={SearchStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
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
      {/* <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        /> */}
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
