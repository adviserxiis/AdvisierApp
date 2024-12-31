import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/store/store';
import Navigator from './src/navigator/Navigator';
import messaging from '@react-native-firebase/messaging';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {useEffect, useState} from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import CodePush from 'react-native-code-push';
import {navigationRef} from './src/navigator/RootNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import NetworkBanner from './src/screens/NetworkBanner';

const config = {
  screens:{
    ViewProfile:'/user/:username',
    Reel:'/reel/:id'
  }
}

const linking = {
  prefixes: ['https://adviserxiis.com','adviserxiis://'],
  config,
}

const App = () => {
  // useEffect(() => {
  //   // CodePush sync on app start
  //   CodePush.sync(
  //     {
  //       installMode: CodePush.InstallMode.IMMEDIATE,
  //       mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  //     },
  //     (status) => {
  //       switch (status) {
  //         case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
  //           console.log('Downloading package...');
  //           break;
  //         case CodePush.SyncStatus.INSTALLING_UPDATE:
  //           console.log('Installing update...');
  //           break;
  //         case CodePush.SyncStatus.UPDATE_INSTALLED:
  //           console.log('Update installed!');
  //           break;
  //         case CodePush.SyncStatus.UNKNOWN_ERROR:
  //           console.log('An unknown error occurred.');
  //           Alert.alert('Update Error', 'An unknown error occurred during the update. Please try again later.');
  //           break;
  //       }
  //     },
  //     (error:any) => {
  //       console.error('CodePush Sync Error:', error);
  //       Alert.alert('Update Error', 'An error occurred while syncing the update. Please check your internet connection and try again.');
  //     }
  //   );
  // }, []);

  const CURRENT_VERSION = DeviceInfo.getVersion();
  console.log('Current Version:', CURRENT_VERSION);
  

  useEffect(() => {
    requestNotificationPermissions();
    initializeMessaging();
    initializeAds();

    const unsubscribeMessaging = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received!', remoteMessage);
      await displayNotification(remoteMessage);
    });

    const unsubscribeForegroundEvent = notifee.onForegroundEvent(
      handleForegroundEvent,
    );

    // Add the background event handler
    const unsubscribeBackgroundEvent = notifee.onBackgroundEvent(
      handleBackgroundEvent,
    );

    messaging().getInitialNotification().then(handleInitialNotification);

    return () => {
      unsubscribeMessaging();
      unsubscribeForegroundEvent();
      unsubscribeBackgroundEvent(); // Cleanup the background event listener
    };
  }, []);

  const initializeAds = () => {
    mobileAds()
      .initialize()
      .then(() => console.log('Ads initialized'));
  };

  const requestNotificationPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message:
              'This app needs notification permissions to keep you updated.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
          // Alert.alert(
          //   'Permission Denied',
          //   'Please enable notifications in your app settings.',
          //   [{ text: 'Go to Settings', onPress: () => Linking.openSettings() }]
          // );
        }
      } else {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        } else {
          console.log('Notification permission denied');
          Alert.alert(
            'Permission Denied',
            'Please enable notifications in your app settings.',
            [{text: 'Go to Settings', onPress: () => Linking.openSettings()}],
          );
        }
      }
    } catch (err) {
      console.error('Permission error:', err);
    }
  };

  const initializeMessaging = async () => {
    try {
      const token = await messaging().getToken();
      await AsyncStorage.setItem('device-Token', token);
      console.log('FCM Token:', token);

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background message received:', remoteMessage);
        displayNotification(remoteMessage);
      });
    } catch (err) {
      console.error('Error in messaging initialization:', err);
    }
  };

  const handleForegroundEvent = async ({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('Foreground Event Press');
      handleNotificationClick('Foreground', detail);
    }
  };

  const handleBackgroundEvent = async ({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('Background Event Press');
      handleNotificationClick('Background', detail);
    }
  };

  const handleInitialNotification = remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification opened app from quit state:',
        remoteMessage.notification,
      );
      handleNotificationClick('Initial', remoteMessage.data?.screen);
    }
  };

  function getLastWord(str) {
    const trimmedStr = str.trim();
    const words = trimmedStr.split(' ');
    return words[words.length - 1];
  }

  const displayNotification = async remoteMessage => {
    const screen = remoteMessage.data?.screen;
    const latestVersion = remoteMessage.data?.latest_version;

    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
        importance: AndroidImportance.HIGH,
      });

      const notificationOptions = {
        title: remoteMessage.notification?.title || 'Update Available',
        body: remoteMessage.notification?.body || 'You have a new notification',
        android: {
          channelId: 'default',
          sound: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {id: 'default'},
        },
      };

      if (latestVersion && compareVersions(latestVersion, CURRENT_VERSION)) {
        notificationOptions.body = `A new version ${latestVersion} is available. Update now!`;
      }

      await notifee.displayNotification(notificationOptions);
    } catch (err) {
      console.error('Error displaying notification:', err);
    }
  };

  const compareVersions = (latestVersion, currentVersion) => {
    const latestParts = latestVersion.split('.').map(Number);
    const currentParts = currentVersion.split('.').map(Number);

    for (
      let i = 0;
      i < Math.max(latestParts.length, currentParts.length);
      i++
    ) {
      const latestPart = latestParts[i] || 0;
      const currentPart = currentParts[i] || 0;

      if (latestPart > currentPart) return true;
      if (latestPart < currentPart) return false;
    }
    return false;
  };

  const handleNotificationClick = (context, remoteMessage) => {
    console.log('Notification Click Data:', remoteMessage);
    console.log('MNC', context);

    const title = remoteMessage.notification?.title || '';
    const lastWord = getLastWord(title);

    if (navigationRef.current) {
      if (remoteMessage.data?.screen) {
        console.log(
          `${context} - Navigating to screen: ${remoteMessage.data.screen}`,
        );
        navigationRef.current.navigate(remoteMessage.data.screen);
      } else if (lastWord === 'Post' || lastWord === 'Now') {
        console.log(
          `${context} - Navigating to Home screen because last word is ${lastWord}`,
        );
        navigationRef.current.navigate('Home');
      } else if (lastWord === 'Reel') {
        console.log(
          `${context} - Navigating to Reel screen because last word is ${lastWord}`,
        );
        navigationRef.current.navigate('Reel');
      } else if (lastWord === 'Update') {
        console.log(
          `${context} - Navigating to PRofile screen because last word is ${lastWord}`,
        );
        navigationRef.current.navigate('Profile');
      } else {
        console.warn(
          'No screen specified in notification data. Redirecting to Home.',
        );
        navigationRef.current.navigate('Home');
      }
    } else {
      console.error('Navigation reference is not defined.');
    }
  };

  const [isBannerVisible, setBannerVisible] = useState(false);
  const handleBannerVisibility = (visible: boolean) => {
    setBannerVisible(visible);
  };
  


  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <GestureHandlerRootView
          style={{
            flex: 1,
          }}>
          <BottomSheetModalProvider>
            <NetworkBanner onBannerVisible={handleBannerVisibility} />
            <Navigator />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </NavigationContainer>
    </Provider>
  );
};

let codePushOptions = {
  deploymentKey: 'Lnp8myMJX1vFKxWp_G5RFcj8aOfGmJv_MKJfM',
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.IMMEDIATE, // Install the update immediately after download
  // mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: false,
};

export default CodePush(codePushOptions)(App);
