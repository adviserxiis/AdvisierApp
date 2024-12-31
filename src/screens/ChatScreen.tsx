import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const ChatScreen = () => {
  const navigation = useNavigation();
  const isMounted = useRef(true);
  const [imageUri, setImageUri] = useState(null);
  const [userid, setUserId] = useState(null);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  // const getDataFromAsyncStorage = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('session');
  //     if (value) {
  //       const sessionData = JSON.parse(value);
  //       setUserId(sessionData.user.id);
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving data from AsyncStorage:', error);
  //   }
  // };

  // useEffect(() => {
  //   getDataFromAsyncStorage();
  // }, []);

  const [selectedMessages, setSelectedMessages] = useState([]);

  // Handle long press to select a message
  const handleLongPress = id => {
    setSelectedMessages(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(msgId => msgId !== id); // Deselect message
      } else {
        return [...prevSelected, id]; // Add to selection
      }
    });
  };

  const handleDeleteMessages = () => {
    const updatedMessages = messages.filter(
      msg => !selectedMessages.includes(msg.id),
    );
    AsyncStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save updated messages to storage
    setMessages(updatedMessages);
    setSelectedMessages([]); // Clear selection
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#17191A',
      },
      title: '',
      headerTintColor: 'white',
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flexDirection: 'row',
              marginLeft: 16,
              gap: 10,
              alignItems: 'center',
            }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Image
            source={require('../assets/images/profiles.png')}
            style={{width: 40, height: 40, borderRadius: 30}}
          />
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                fontFamily: 'Poppins-Medium',
              }}>
              ABHIJEET VISHWAKARMA
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                marginTop: -7,
              }}>
              {/* <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: 'green',
                }}
              /> */}
              {/* <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                }}>
                Online
              </Text> */}
            </View>
          </View>
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <TouchableOpacity
            onPress={handleDeleteMessages}
            style={{
              marginRight: 16,
            }}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, selectedMessages]);

  const handleSendMessage = async () => {
    if (text.trim() === '' && !imageUri) return;

    const newMessageText = imageUri || text;
    const msgType = imageUri ? 'image' : 'text';

    const newMessage = {
      id: (messages.length + 1).toString(),
      text: newMessageText,
      time: formatTime(new Date()),
      sender: true,
      status: 'sent',
      date: formatDate(new Date()),
      msgType,
    };

    const existingMessages = await AsyncStorage.getItem('messages');
    const messagesArray = existingMessages ? JSON.parse(existingMessages) : [];
    messagesArray.push(newMessage);

    await AsyncStorage.setItem('messages', JSON.stringify(messagesArray));

    setMessages(messagesArray);
    setText('');
    setImageUri(null); // Reset image
    setAudioPath('');
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'multiple', quality: 1}, response => {
      if (response.didCancel) return;
      setImageUri(response.assets[0].uri);
      console.log(response.assets[0].uri);
    });
  };

  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatTime = date => {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const groupMessagesByDate = messages => {
    const grouped = [];
    let currentDate = '';

    messages.forEach(message => {
      if (message.date !== currentDate) {
        currentDate = message.date;
        grouped.push({date: currentDate, messages: []});
      }
      grouped[grouped.length - 1].messages.push(message);
    });

    return grouped;
  };

  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  const handleLinkPress = url => {
    if (!url.startsWith('http')) {
      url = `http://${url}`; // Add "http" if the URL is missing it
    }
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  // const renderTextWithLinks = (text) => {
  //   const parts = text.split(urlRegex); // Split text by URLs
  //   return parts.map((part, index) => {
  //     if (urlRegex.test(part)) {
  //       // If part is a URL, render it as a clickable link
  //       return (
  //         <TouchableOpacity key={index} onPress={() => handleLinkPress(part)}>
  //         <Text style={styles.linkText}>{part}</Text>
  //       </TouchableOpacity>
  //       );
  //     }
  //     // Otherwise render the part as regular text
  //     return <Text key={index}>{part}</Text>;
  //   });
  // };

  const audioRecorderPlayer = new AudioRecorderPlayer();

  const [recording, setRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return (
        granted['android.permission.RECORD_AUDIO'] === 'granted' &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
      );
    }
    return true;
  };
  

  const startRecording = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setRecording(true);
    const result = await audioRecorderPlayer.startRecorder();
    setAudioPath(result); // Save audio file path
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    setRecording(false);
    setAudioPath(result);
    console.log('Audio saved at:', result);

    // Send audio message
    handleSendMessage(result, 'audio');
  };

  const playAudio = async path => {
    setIsPlaying(true);
    await audioRecorderPlayer.startPlayer(path);
    audioRecorderPlayer.addPlayBackListener(() => {
      setIsPlaying(false);
      return;
    });
  };

  const renderTextWithLinks = text => {
    const parts = text.split(urlRegex); // Split text by URL matches
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        // If part is a URL, render it as a clickable link
        return (
          <Text
            key={index}
            style={styles.linkText}
            onPress={() => handleLinkPress(part)}>
            {part}
          </Text>
        );
      }
      // Otherwise, render the part as regular text
      return (
        <Text key={index} style={styles.messageText}>
          {part}
        </Text>
      );
    });
  };

  const renderMessage = ({item}) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item.id)}
      onPress={
        () => setSelectedMessages([]) // Clear selection on normal press
      }
      style={[
        styles.messageContainer,
        item.sender ? styles.senderMessage : styles.receiverMessage,
        selectedMessages.includes(item.id) && styles.selectedMessage, // Highlight if selected
      ]}>
      {item.msgType === 'image' && (
        <Image source={{uri: item.text}} style={styles.imageMessage} />
      )}
      {item.msgType === 'audio' && (
        <TouchableOpacity
          onPress={() => playAudio(item.text)}
          style={styles.audioButton}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      )}
      {item.msgType === 'text' && (
        <Text style={styles.messageText}>
          {renderTextWithLinks(item.text)} {/* Render text with links */}
        </Text>
      )}
      <View style={styles.messageInfo}>
        <Text style={styles.timeText}>{item.time}</Text>
        {item.sender && item.status && (
          <Text style={styles.statusIcon}>
            {item.status === 'seen' ? '✓✓' : '✓'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderDateHeader = date => <Text style={styles.dateText}>{date}</Text>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={groupMessagesByDate(messages)}
        renderItem={({item}) => (
          <View>
            {renderDateHeader(item.date)}
            {item.messages.map(message => (
              <View key={message.id}>{renderMessage({item: message})}</View>
            ))}
          </View>
        )}
        keyExtractor={item => item.date}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.mediaButton}>
          <Ionicons name="image" size={24} color="white" />
        </TouchableOpacity>
        {recording ? (
          <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
            <Ionicons name="stop" size={24} color="red" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording} style={styles.micButton}>
            <Ionicons name="mic" size={24} color="white" />
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
          style={styles.button}
          onPress={
            recording
              ? paused
                ? resumeRecording
                : pauseRecording
              : startRecording
          }>
          <Ionicons
            name={recording ? (paused ? 'play' : 'pause') : 'mic'}
            size={24}
            color="gray"
          />
        </TouchableOpacity> */}
        {imageUri && (
          <Image source={{uri: imageUri}} style={styles.selectedImage} />
        )}
        <TextInput
          style={styles.textInput}
          placeholder="Type a message"
          placeholderTextColor={'grey'}
          value={text}
          onChangeText={setText}
          autoFocus
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  linkText: {
    color: 'white', // Blue color for the links
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 10,
  },
  mediaButton: {
    marginRight: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
    flexDirection: 'column',
    marginHorizontal: 5,
  },
  profileContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedImage: {
    width: 35,
    height: 35,
    borderRadius: 5,
    marginRight: 10,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: 'black',
  },
  senderMessage: {
    backgroundColor: '#0069B4', // light green background for sender
    alignSelf: 'flex-end', // Align to the right for sender
    borderBottomRightRadius: 0, // Rounded corner for sender's message
  },
  selectedMessage: {
    backgroundColor: '#3a3b3c', // Highlight color for selection
  },
  receiverMessage: {
    backgroundColor: '#333', // light gray background for receiver
    alignSelf: 'flex-start', // Align to the left for receiver
    borderBottomLeftRadius: 0, // Rounded corner for receiver's message
  },
  messageText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  messageInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    marginRight: 5,
  },
  statusIcon: {
    fontSize: 12,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#17191A',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#17191A',
    color: 'white',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0069B4',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  dateText: {
    fontSize: 12,
    color: '#bbb',
    marginVertical: 10,
    textAlign: 'center',
  },
  textInput: {
    textDecorationLine: 'none',
    flex: 1,
    color: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    marginRight: 10,
  },
  imageMessage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default ChatScreen;
