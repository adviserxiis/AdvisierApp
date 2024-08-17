// firebaseConfig.js
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBkV2RaH7IMbXr2k6zSmfWd4IVPayRq1X8',
  authDomain: '1:553796556466:android:67e94618b3476b29081bab.firebaseapp.com',
  databaseURL: 'https://adviserxiis-920e5-default-rtdb.firebaseio.com/',
  projectId: 'adviserxiis-920e5',
  storageBucket: 'gs://adviserxiis-920e5.appspot.com',
  appId: '1:553796556466:android:67e94618b3476b29081bab',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
