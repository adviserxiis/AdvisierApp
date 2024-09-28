// App.js
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';
import User from '../screens/user/user';
import Profile from '../screens/profile/profile';
import Icon from 'react-native-vector-icons/Feather';
import Search from '../screens/search/Search';
import AddPost from '../screens/add/AddPost';
import UpdateProfile from '../screens/profile/screen/UpdateProfile';
import ViewProfile from '../screens/reels/screen/ViewProfile';
import SingleReel from '../screens/reels/screen/SingleReel';
import SearchText from '../screens/search/screen/SearchText';
import reel from '../screens/reels/Reel';
import Home from '../screens/home/home';
import PostScreen from '../screens/home/screen/PostScreen';
import PostView from '../screens/home/screen/PostView';
import LeadershipBoard from '../screens/home/screen/LeadershipBoard';
import ContestReelUpload from '../screens/home/screen/ContestReelUpload';
import ContestReelView from '../screens/home/screen/ContestReelView';
// import Login from '../screens/auth/Login';

//Home Stack
const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={Home}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: '#17191A',
          },
          // headerShadowVisible:false
        }}
      />
      <HomeStack.Screen
        name="PostView"
        component={PostView}
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
      <HomeStack.Screen 
        name='ContestReelView'
        component={ContestReelView}
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

//Reel Stack
const ReelStack = createStackNavigator();
function ReelStackScreen() {
  return (
    <ReelStack.Navigator>
      <ReelStack.Screen
        name="MainHome"
        component={reel}
        options={{
          headerShown: false,
        }}
      />
      <ReelStack.Screen
        name="ViewProfile"
        component={ViewProfile}
        options={{
          headerShown: false,
        }}
      />
      <ReelStack.Screen
        name="singleReel"
        component={SingleReel}
        options={{
          headerShown: false,
        }}
      />
    </ReelStack.Navigator>
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
        name="SearchText"
        component={SearchText}
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
      <SearchStack.Screen
        name="singleReel"
        component={SingleReel}
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
          height: 74,
          paddingTop: 10,
          borderColor: '#17191A',
          backgroundColor: '#17191A',
        },
        tabBarInactiveTintColor: 'white',
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({color, size, focused}) => {
          let iconName;
          let iconColor = color;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'AddPost':
              iconName = 'plus';
              iconColor = focused ? 'black' : 'black';
              return (
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 30,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center', // Center the Add button in the navbar
                  }}>
                  <Icon name={iconName} size={26} color={iconColor} />
                </View>
              );
              break;
            case 'Reel':
              iconName = 'play';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
              break;
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Search" component={SearchStackScreen} />
      {/* <Tab.Screen name="AddPost" component={PostStackScreen} /> */}
      <Tab.Screen name="Reel" component={ReelStackScreen} />
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
      <Stack.Screen
        name="CreatePost"
        component={AddPost}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{
          title: 'Create Post',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-Medium',
            fontSize: 18,
            marginTop: 8,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#17191A', // Set the header background to black
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="LeadershipBoard"
        component={LeadershipBoard}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: '#17191A',
          },
          // headerShadowVisible:false
        }}
      />
      <Stack.Screen name="ContestReelUpload" component={ContestReelUpload}  
        options={{
          headerShown:true,
          title:'',
          headerStyle: {
            backgroundColor: '#17191A',
          },
          headerShadowVisible:false,
          headerTintColor:'white'
        }}
      />
    </Stack.Navigator>
  );
}

export default function Main() {
  return <MyStack />;
}
