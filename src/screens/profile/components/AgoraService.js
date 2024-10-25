// AgoraService.js
import { NativeEventEmitter, NativeModules } from 'react-native';

const { AgoraRtcEngineModule } = NativeModules;

// Initialize the NativeEventEmitter with Agora's RTC engine module
const agoraEmitter = new NativeEventEmitter(AgoraRtcEngineModule);

export default agoraEmitter;
