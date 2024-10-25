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
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import KeepAwake from 'react-native-keep-awake';

const CallScreen = () => {
  const route = useRoute();
  const { meetingid } = route.params;
  const [videoCall, setVideoCall] = useState(true);
  const navigation = useNavigation();
  const callEndedRef = useRef(false);
  const user = useSelector((state) => state.user);

  // State to manage usernames
  const [usernames, setUsernames] = useState({
    local: user?.userInfo?.name || 'Local User', // Local username from Redux or default
    remote: 'Remote User',
  });

  const connectionData = {
    appId: 'f33a78e85a4e4fb5b10b4f295aac37c1',
    channel: meetingid || 'test',
    
  };


  const handleEndCall = useCallback(() => {
    if (!callEndedRef.current) {
      callEndedRef.current = true;
      setVideoCall(false); // Schedule state update after component has fully rendered
      navigation.goBack();
      KeepAwake.deactivate();
    }
  }, [navigation]);

  const rtcCallbacks = {
    EndCall: handleEndCall,
    // Additional callbacks (onUserJoined, onUserOffline) can go here
  };

  useEffect(() => {
    if (videoCall) {
      KeepAwake.activate(); // Activate KeepAwake to keep the screen on during the call
    }
    return () => {
      KeepAwake.deactivate(); // Ensure KeepAwake is deactivated if the component unmounts
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
        }}
      />
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
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  // username: {
  //   color: 'white',
  //   fontSize: 16,
  //   marginBottom: 5,
  // },
});

export default CallScreen;
