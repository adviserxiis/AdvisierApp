import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const CallScreen = (props: any) => {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <ZegoUIKitPrebuiltCall
        appID={1262356013}
        appSign={
          '99b777ea4289d9f9e818bd822e2584f1043d8b43615004702a3e34d2255b2610'
        }
        userID={'1234'} // userID can be something like a phone number or the user id on your own user system.
        userName={'Abhijeet'}
        callID={'1220'} // callID can be any unique string.
        config={{
          // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          onCallEnd: () => {
            props.navigation.navigate('profile');
          },
        }}
      />
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({});
