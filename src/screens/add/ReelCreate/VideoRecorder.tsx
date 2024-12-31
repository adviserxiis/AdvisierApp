import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Linking,
  Dimensions,
  Animated,
  AppState,
} from 'react-native';
const MIN_RECORDING_TIME = 1000;
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Video from 'react-native-video';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import RecordButton from './components/RecordButton';

const {width, height} = Dimensions.get('window');

const VideoPreview = ({videoPath, onClose}) => (
  <View style={styles.previewContainer}>
    <Video
      source={{uri: videoPath}}
      style={styles.fullScreenPreview}
      resizeMode="contain"
      controls={false}
      repeat={true}
    />
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <Text style={styles.closeButtonText}>Close</Text>
    </TouchableOpacity>
  </View>
);

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [cameraPosition, setCameraPosition] = useState('back');
  const [torch, setTorch] = useState('off');
  const [isActive, setIsActive] = useState(true);
  const camera = useRef(null);
  const appState = useRef(AppState.currentState);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice(cameraPosition);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const checkPermissions = async () => {
    if (!hasPermission) {
      try {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to record videos. Please enable it in your device settings.',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
          );
        }
      } catch (error) {
        console.error('Permission check error:', error);
        Alert.alert('Error', 'Failed to check camera permissions.');
      }
    }
  };

  const toggleCamera = () => {
    setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'));
    if (cameraPosition === 'back') {
      setTorch('off');
    }
  };

  const toggleFlash = () => {
    setTorch(prev => (prev === 'off' ? 'on' : 'off'));
  };

  const startRecording = async () => {
    try {
      if (camera.current && !isRecording) {
        setIsRecording(true);
        Animated.timing(progressAnimation, {
          toValue: 1,
          duration: 10000, // 10 seconds for demo purposes
          useNativeDriver: false,
        }).start();

        const options = {
          flash: cameraPosition === 'back' ? torch : 'off',
          fileType: 'mp4',
          onRecordingFinished: video => {
            console.log('Recording finished:', video);
            if (video?.path) {
              setVideoPath(video.path);
            }
          },
          onRecordingError: error => {
            console.error('Recording error:', error);
            setIsRecording(false);
            Alert.alert('Error', 'Failed to record video');
          },
        };

        await camera.current.startRecording(options);
      }
    } catch (error) {
      console.error('Start recording error:', error);
      setIsRecording(false);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (camera.current && isRecording) {
        await camera.current.stopRecording();
        Animated.timing(progressAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }).stop();
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Stop recording error:', error);
      setIsRecording(false);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handlePressIn = () => {
    if (!isRecording) {
      startRecording();
    }
  };

  const handlePressOut = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  const animatedCircle = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={checkPermissions}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {videoPath ? (
        <VideoPreview
          videoPath={videoPath}
          onClose={() => setVideoPath(null)}
        />
      ) : (
        <>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            video={true}
            audio={true}
            isActive={isActive}
            torch={torch}
            enableZoomGesture={true}
            preset="high"
          />
          <View style={styles.topRightControls}>
            {cameraPosition === 'back' && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleFlash}>
                <Icon
                  name={torch === 'off' ? 'flash-off' : 'flash'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCamera}>
              <Icon name="camera-reverse" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.controls}>
          <RecordButton
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              maxDuration={10000}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  camera: {
    flex: 1,
  },
  topRightControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
  },
  controlButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4444ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  fullScreenPreview: {
    width: width,
    height: height,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoRecorder;
