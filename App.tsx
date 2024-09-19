import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/store/store';
import Navigator from './src/navigator/Navigator';
import messaging from '@react-native-firebase/messaging';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import CodePush from 'react-native-code-push';
import { navigationRef } from './src/navigator/RootNavigator';

const App = () => {
  
  const CURRENT_VERSION = DeviceInfo.getVersion();
  console.log("Current Version", CURRENT_VERSION);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    await AsyncStorage.setItem('device-Token', token);
    console.log('Token = ', token);
  };

  async function displayNotification(remoteMessage) {
    const latestVersion = remoteMessage.data.latest_version;

    if (latestVersion && compareVersions(latestVersion, CURRENT_VERSION)) {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: remoteMessage.notification.title || 'Update Available',
        body: remoteMessage.notification.body || `A new version ${latestVersion} of the app is available. Update now!`,
        android: {
          channelId: 'default',
          sound: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'open_play_store',
          },
        },
      });
    } else {
      console.log('No notification displayed. Current version is up-to-date or newer.');
    }
  }

  

  function compareVersions(latestVersion, currentVersion) {
    const latestParts = latestVersion.split('.').map(Number);
    const currentParts = currentVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
      const latestPart = latestParts[i] || 0;
      const currentPart = currentParts[i] || 0;

      if (latestPart > currentPart) {
        return true; // Latest version is newer
      } else if (latestPart < currentPart) {
        return false; // Current version is newer or equal
      }
    }
    return false;
  }

  async function handleNotificationPress() {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.advisiorapp';
    if (Platform.OS === 'android') {
      Linking.openURL(playStoreUrl).catch(err =>
        console.error("Couldn't load page", err),
      );
    }
  }

  const requestNotificationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS');
        if (!granted) {
          await PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS', {
            title: 'Notification Permission',
            message:
              'App needs access to your notifications so you can receive updates.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          });
        }
      } catch (err) {
        console.log("Notification Error=====>", err);
      }
    }
  };

  const navigateToScreen = (screen) => {
    if (screen === 'Reel') {
      navigationRef.current?.navigate('MainHome');  // Navigate to your screen
    } else if (screen === 'Post') {
      navigationRef.current?.navigate('PostScreen');  // Update with your screen name
    }
  };

  const checkInitialNotification = async () => {
    const initialNotification = await messaging().getInitialNotification();

    if (initialNotification) {
      const { screen } = initialNotification.data;
      console.log(screen);
      if (screen) {
        navigateToScreen(screen);  // Handle navigation when the app is opened from a notification
      }
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    requestUserPermission();
    getToken();
    mobileAds().initialize().then(() => console.log('Ads initialized'));

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // Handle background message
      displayNotification(remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      displayNotification(remoteMessage);
    });

    const unsubscribeNotifee = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS && detail.pressAction.id) {
        console.log("Details",detail);
        navigateToScreen(detail.pressAction.id);
      }
    });

    // Handle background events
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS && detail.pressAction.id) {
        navigateToScreen(detail.pressAction.id);
      }
    });

    checkInitialNotification(); 

    return () => {
      unsubscribe();
      unsubscribeNotifee();
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Navigator />
      </NavigationContainer>
    </Provider>
  );
};

let codePushOptions = {
  deploymentKey: 'Lnp8myMJX1vFKxWp_G5RFcj8aOfGmJv_MKJfM',
  checkFrequency: CodePush.CheckFrequency.ON_APP_START
};


export default CodePush(codePushOptions)(App);
