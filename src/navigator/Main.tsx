// App.js
import * as React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, TouchableOpacity, View} from 'react-native';
import User from '../screens/user/user';
import Profile from '../screens/profile/profile';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
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
import MultipleReel from '../screens/reels/screen/MultipleReel';
import ServicesPost from '../screens/home/screen/ServicesPost';
import PreviewScreen from '../screens/profile/screen/PreviewScreen';
import EditServices from '../screens/profile/screen/EditServices';
import KnowMore from '../screens/home/screen/KnowMore';
// import Login from '../screens/auth/Login';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CallScreen from '../screens/profile/screen/CallScreen';
import CheckOut from '../screens/reels/screen/CheckOut';
import Services from '../screens/servicec/Services';
import ServiceDetails from '../screens/servicec/screen/ServiceDetails';

const Tabs = createMaterialTopTabNavigator();
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
        name="multipleReel"
        component={MultipleReel}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="ContestReelView"
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
        name="multipleReel"
        component={MultipleReel}
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
        name="multipleReel"
        component={MultipleReel}
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
        name="multipleReel"
        component={MultipleReel}
        options={{
          headerShown: false,
        }}
      />
    </ProfileStack.Navigator>
  );
}

const ServiceStack =createStackNavigator();
function ServiceStackScreen() {
  return (
    <ServiceStack.Navigator>
      <ServiceStack.Screen name='Services' component={Services}/>
      {/* <ServiceStack.Screen name='ServiceDetails' component={ServiceDetails}/> */}
    </ServiceStack.Navigator>
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
            case 'Service': 
              iconName='bookmark';
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
      <Tab.Screen name="Service" component={ServiceStackScreen}/>
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}

// Stack Navigator
const Stack = createStackNavigator();
function MyStack() {

  const navigation = useNavigation();
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
      <Stack.Screen
        name="ContestReelUpload"
        component={ContestReelUpload}
        options={{
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: '#17191A',
          },
          headerShadowVisible: false,
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="ServicesPost"
        component={ServicesPost}
        options={{
          headerShown: true,
          title:'Create Service',
          headerTitleStyle:{
            fontFamily:'Poppins-Medium'
          },
          headerStyle: {
            backgroundColor: '#17191A',
          },
          headerShadowVisible: false,
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="PreviewScreen"
        component={PreviewScreen}
        // options={{
        //   headerShown: true,
        //   title:'Service',
        //   headerTitleStyle:{
        //     fontFamily:'Poppins-Medium'
        //   },
        //   headerRight:()=>(
        //     <TouchableOpacity style={{
        //       marginRight:16
        //     }} onPress={()=>{
        //       navigation.navigate('EditServices');
        //     }}>
        //     <Icon1 name='pen' color='white' size={16}/>
        //     </TouchableOpacity>
        //   ),
        //   headerStyle: {
        //     backgroundColor: '#17191A',
        //   },
        //   headerShadowVisible: false,
        //   headerTintColor: 'white',
        // }}
      />
      <Stack.Screen
        name="EditServices"
        component={EditServices}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="KnowMore"
        component={KnowMore}
        options={{
          headerShown: true,
          title:'Service',
          headerTitleStyle:{
            fontFamily:'Poppins-Medium'
          },
          headerStyle: {
            backgroundColor: '#17191A',
          },
          headerShadowVisible: false,
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen name='CallScreen' options={{
        headerShown:false
      }} component={CallScreen}/>
      <Stack.Screen name='CheckOut' options={{
        headerShown:false
      }} component={CheckOut}/>
    </Stack.Navigator>
  );
}

export default function Main() {
  return <MyStack />;
}
