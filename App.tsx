import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/store/store';
import Navigator from './src/navigator/Navigator';
import messaging from '@react-native-firebase/messaging'
import { Alert ,Linking , PermissionsAndroid, Platform } from 'react-native';
import { useEffect } from 'react';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
const App = () => {

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async()=>{
    const token = await messaging().getToken();
    console.log("Token = " ,  token);
  }

  async function displayNotification(remoteMessage) {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      importance: AndroidImportance.HIGH, // Ensures the notification pops up and plays sound
    });

    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId: 'default',
        sound: 'default',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  async function handleNotificationClick() {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.advisiorapp';
    if (Platform.OS === 'android') {
      Linking.openURL(playStoreUrl).catch((err) => console.error("Couldn't load page", err));
    }
  }

  useEffect(()=>{
    requestUserPermission();
    getToken();

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      // Handle your background message here
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      // Optionally show an alert if you want
      // Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body, [
      //   {
      //     text: 'Update Now',
      //     onPress: () => handleNotificationClick(remoteMessage),
      //   },
      //   {
      //     text: 'Later',
      //     style: 'cancel',
      //   },
      // ]);
      // Display the notification using Notifee
      displayNotification(remoteMessage);
    });
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotificationClick();
      }
    });

    return () => {
      unsubscribe();
      unsubscribeNotifee();
    };
  },[]);
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
