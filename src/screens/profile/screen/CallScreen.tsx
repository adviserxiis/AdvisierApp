import {StyleSheet, View} from 'react-native';
import React from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const CallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useSelector((state: any) => state.user);
  const {meetingid} = route.params;
  
  console.log(user.userid);

  return (
    <View style={{flex: 1}}>
      <ZegoUIKitPrebuiltCall
        appID={1262356013}
        appSign={
          '99b777ea4289d9f9e818bd822e2584f1043d8b43615004702a3e34d2255b2610'
        }
        userID={user.userid} // userID can be something like a phone number or the user id on your own user system.
        userName={user?.userInfo?.name}
        callID={meetingid} // callID can be any unique string.
        config={{
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          turnOnCameraWhenJoin: false, // Camera will be off when joining the call
          avatar: {
            // Provide the user avatar or fallback to a local image
            userID: user.userid,
            userAvatar:
              user?.userInfo?.profile_photo || require('../../../assets/images/profilei.png'),
          },
          onCallEnd: () => {
            navigation.navigate('profile');
          },
        }}
      />
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({});
