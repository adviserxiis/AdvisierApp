// import {StyleSheet, View} from 'react-native';
// import React from 'react';
// import {
//   ZegoUIKitPrebuiltCall,
//   ONE_ON_ONE_VIDEO_CALL_CONFIG,
// } from '@zegocloud/zego-uikit-prebuilt-call-rn';
// import {useNavigation, useRoute} from '@react-navigation/native';
// import {useSelector} from 'react-redux';

// const CallScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const user = useSelector((state: any) => state.user);
//   const {meetingid} = route.params;

//   console.log(user.userid);

//   return (
//     <View style={{flex: 1}}>
//       <ZegoUIKitPrebuiltCall
//         appID={1655382353}
//         appSign={
//           'ffc70774b12c9e84c7aa790db8829bbb1827ad58bb41ef63ca2afbc69f1fa652'
//         }
//         userID={user.userid} // userID can be something like a phone number or the user id on your own user system.
//         userName={user?.userInfo?.name}
//         callID={meetingid} // callID can be any unique string.
//         config={{
//           ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
//           turnOnCameraWhenJoin: false, // Camera will be off when joining the call
//           avatar: {
//             // Provide the user avatar or fallback to a local image
//             userID: user.userid,
//             userAvatar:
//               user?.userInfo?.profile_photo || require('../../../assets/images/profilei.png'),
//           },
//           onCallEnd: () => {
//             navigation.navigate('profile');
//           },
//         }}
//       />
//     </View>
//   );
// };

// export default CallScreen;

// const styles = StyleSheet.create({});

// import React, { useEffect, useState, useRef } from 'react';
// import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
// import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora';
// import { useRoute } from '@react-navigation/native';

// const APP_ID = 'f33a78e85a4e4fb5b10b4f295aac37c1'; // Replace with your Agora App ID

// const CallScreen = () => {
//   const [isJoined, setIsJoined] = useState(false);
//   const [remoteUids, setRemoteUids] = useState([]);
//   const engineRef = useRef(null);
//   const route = useRoute();
//   const { meetingid } = route.params;

//   useEffect(() => {
//     const initAgora = async () => {
//       const rtcEngine = await RtcEngine.create(APP_ID);
//       engineRef.current = rtcEngine;

//       await rtcEngine.enableVideo();
//       rtcEngine.addListener('UserJoined', (uid) => {
//         setRemoteUids((prev) => [...prev, uid]);
//       });
//       rtcEngine.addListener('UserOffline', (uid) => {
//         setRemoteUids((prev) => prev.filter((id) => id !== uid));
//       });
//       rtcEngine.addListener('JoinChannelSuccess', () => {
//         setIsJoined(true);
//       });

//       await rtcEngine.joinChannel(null, meetingid, null, 0);
//     };

//     initAgora().catch(console.error);

//     return () => {
//       if (engineRef.current) {
//         engineRef.current.leaveChannel();
//         engineRef.current.destroy();
//       }
//     };
//   }, [meetingid]);

//   return (
//     <View style={styles.container}>
//       {isJoined ? (
//         <>
//           <RtcLocalView.SurfaceView
//             style={styles.localVideo}
//             channelId={meetingid}
//             renderMode={VideoRenderMode.Hidden}
//           />
//           {remoteUids.map((uid) => (
//             <RtcRemoteView.SurfaceView
//               key={uid}
//               style={styles.remoteVideo}
//               uid={uid}
//               channelId={meetingid}
//               renderMode={VideoRenderMode.Hidden}
//             />
//           ))}
//         </>
//       ) : (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//           <Text style={styles.joiningText}>Joining Channel...</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   localVideo: {
//     width: '100%',
//     height: '50%',
//   },
//   remoteVideo: {
//     width: '100%',
//     height: '50%',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   joiningText: {
//     color: 'black',
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default CallScreen;

// 

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, BackHandler, Alert } from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import KeepAwake from 'react-native-keep-awake';

const CallScreen = () => {
  const route = useRoute();
  const { meetingid, adviserid, userid } = route.params;
  const [videoCall, setVideoCall] = useState(true);
  const navigation = useNavigation();
  const callEndedRef = useRef(false);
  const user = useSelector((state) => state.user);

  const [remoteDetails, setRemoteDetails] = useState(null);
  const [localDetails, setLocalDetails] = useState({
    name: user?.userInfo?.name || 'Local User',
  });

  const [usernames, setUsernames] = useState({
    local: localDetails.name,
    remote: '',
  });

  const connectionData = {
    appId: 'f33a78e85a4e4fb5b10b4f295aac37c1',
    channel: meetingid || 'luinkai',
    // token:'007eJxTYPj54//zf2H88ypzox7kPJpTz+B/dkNc0lTV4z8296vP3zJbgSHN2DjR3CLVwjTRJNUkLck0ydAgySTNyNI0MTHZ2DzZsHenTHpDICPDocuHGRkZIBDEZ2fIKc3My07MZGAAAPD6JNc=',
    // uid: parseInt(meetingid, 10),
  };

  const showExitAlert = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end the call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: handleEndCall }
      ],
      { cancelable: true }
    );
  };

  const handleBackPress = useCallback(() => {
    showExitAlert();
    return true; // Prevents default back action
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress]);

  // Fetch remote user details based on the user role
  const getDetails = async (userid) => {
    try {
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/creator/getuser/${userid}`
      );
      const data = await response.json();
      console.log(data);
      setRemoteDetails(data);
      setUsernames((prev) => ({ ...prev, remote: data.username }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    if (user?.userid === adviserid) {
      getDetails(userid);
    } else {
      getDetails(adviserid);
    }
  }, []);

  const handleEndCall = useCallback(() => {
    if (!callEndedRef.current) {
      callEndedRef.current = true;
      setVideoCall(false);
      navigation.goBack();
      KeepAwake.deactivate();
    }
  }, [navigation]);

  const rtcCallbacks = {
    EndCall: handleEndCall,
    onUserJoined: (uid) => {
      console.log('User joined with UID:', uid);
      if (uid !== connectionData.uid) {
        // Assuming remote user joined, show their username
        setUsernames((prev) => ({ ...prev, remote: remoteDetails?.username || 'Remote User' }));
      }
    },
    onUserOffline: (uid) => {
      console.log('User went offline with UID:', uid);
      if (uid !== connectionData.uid) {
        // Remote user left, reset remote username to default
        setUsernames((prev) => ({ ...prev, remote: 'Remote User' }));
      }
    },
  };

  useEffect(() => {
    if (videoCall) {
      KeepAwake.activate();
    }
    return () => {
      KeepAwake.deactivate();
    };
  }, [videoCall]);

  return videoCall ? (
    <View style={styles.container}>
      <AgoraUIKit
        connectionData={connectionData}
        rtcCallbacks={rtcCallbacks}
        styleProps={{
          UIKitContainer: {
            flex: 1,
            width: '100%',
            height: Dimensions.get('window').height,
          },
          minViewContainer: {
            top: 60,
            left: 10,
          },
          minViewStyles: {
            width: 100,
            height: 180,
          },
          usernameText:{
            fontSize: 18,
            color: '#fff',
          }
        }}
      />
      {/* Display remote or local username based on view */}
      <View style={styles.usernameContainer}>
        <Text style={styles.username}>{usernames.remote}</Text>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  usernameContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  username: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default CallScreen;

