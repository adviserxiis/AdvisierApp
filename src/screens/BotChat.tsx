import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  
  Animated,
  Modal,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type Message = {
  text: string;
  sender: 'user' | 'gemini';
};

const GEMINI_API_KEY = 'AIzaSyDpqrWSaTosINopL8TLRkdD6KrR3ZYczB8';

const BotChat = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [msg, setMsg] = useState<string>(''); // User's message
  const [messages, setMessages] = useState<Message[]>([]); // All messages in chat
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const fadeAnim = useRef(new Animated.Value(1)).current; // Animation for welcome message
  const inputRef = React.useRef(null);

  // Bubble animation
  const bubbleScale = useRef(new Animated.Value(0)).current;

  const handleButtonClick = async () => {
    if (!msg.trim()) return; // If the message is empty, do nothing

    const userMessage: Message = {text: msg, sender: 'user'};
    setMessages(prevMessages => [userMessage, ...prevMessages]);
    setMsg(''); // Clear the input field

    // If this is the first message, start fade-out animation for the welcome message
    if (messages.length === 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }

    setLoading(true); // Set loading state

    try {
      // API request to Gemini AI
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: msg,
                  },
                ],
              },
            ],
          }),
        },
      );

      const data = await response.json();
      console.log('Full API Response:', data);

      let reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      reply = reply.replace(/\*/g, ''); // Clean the reply

      const geminiMessage: Message = {text: reply, sender: 'gemini'};
      setMessages(prevMessages => [geminiMessage, ...prevMessages]); // Add Gemini's reply
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {text: 'Error occurred', sender: 'gemini'};
      setMessages(prevMessages => [errorMessage, ...prevMessages]);
    } finally {
      setLoading(false); // Turn off loading state
    }
  };

  const messageSave = (text: string) => {
    setMsg(text);
    console.log(text);
  };

  const renderItem = ({item}: {item: Message}) => (
    <View
      style={[
        styles.message,
        item.sender === 'user' ? styles.userMessage : styles.geminiMessage,
      ]}>
      <Text
        style={[
          styles.messageText,
          item.sender === 'user'
            ? styles.userMessageText
            : styles.geminiMessageText,
        ]}>
        {item.text}
      </Text>
    </View>
  );

  // Bubble animation when loading
  const renderLoadingBubble = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bubbleScale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return (
      <View style={styles.loadingBubbleContainer}>
        <Animated.View
          style={[styles.loadingBubble, {transform: [{scale: bubbleScale}]}]}
        />
        <Animated.View
          style={[styles.loadingBubble, {transform: [{scale: bubbleScale}]}]}
        />
        <Animated.View
          style={[styles.loadingBubble, {transform: [{scale: bubbleScale}]}]}
        />
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onDismiss={onClose}
      presentationStyle="formSheet"
      onRequestClose={onClose}
      //   transparent={true}
    >
      <SafeAreaView style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
            marginVertical: 10,
            backgroundColor: '#3a3b3c',
            borderRadius: 25, // To create the capsule shape
            minWidth: 100, // Set a minimum width to ensure it's not too small
            alignSelf: 'center', // Center the button horizontally
          }}>
          <Text
            onPress={onClose}
            style={{
              color: 'white',
              fontFamily: 'Poppins-Medium',
            }}>
            Luink.ai
          </Text>
        </View>
        {messages.length === 0 && (
          <Animated.View style={[styles.welcomeContainer, {opacity: fadeAnim}]}>
            <Image
              source={require('../assets/images/Luink.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                alignSelf: 'center',
                marginBottom: 3,
              }}
            />
            <Text style={styles.welcomeText}>
              Welcome to Luink.
              <Text
                style={{
                  color: '#007aff',
                }}>
                ai
              </Text>
            </Text>
          </Animated.View>
        )}

        <FlatList
          showsVerticalScrollIndicator={false}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.messagesContainer}
          inverted
        />

        {loading && renderLoadingBubble()}

        <View style={styles.inputView}>
          <TextInput
            // ref={inputRef} // Attach a reference to the TextInput
            style={styles.input}
            placeholder="Type Something..."
            value={msg}
            onChangeText={messageSave}
            returnKeyType="send"
            placeholderTextColor="gray"
            // onSubmitEditing={handleButtonClick} // Prevent keyboard from closing
          />
          <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  welcomeContainer: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    color: 'white',
  },
  messagesContainer: {
    paddingBottom: 10,
    flexGrow: 1,
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
  },
  message: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#3c3c3c',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userMessage: {
    backgroundColor: '#007aff',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  geminiMessage: {
    backgroundColor: '#3c3c3c',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  userMessageText: {
    color: 'white',
  },
  geminiMessageText: {
    color: 'white',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#3c3c3c',
    borderRadius: 25,
  },
  input: {
    flex: 1,
    backgroundColor: '#17191A',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 5,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#007aff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingBubbleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loadingBubble: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: '#007aff',
    marginHorizontal: 5,
  },
});

export default BotChat;
