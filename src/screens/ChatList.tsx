import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define the type for chat data items
interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unreadCount: number;
}

// Define the type for the navigation prop
type NavigationProp = {
  navigate: (screen: string, params?: object) => void;
  setOptions: (options: object) => void;
};

// Sample chat data
const chatData: ChatItem[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey! How are you?',
    time: '2:30 PM',
    avatar: 'https://via.placeholder.com/50',
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'Let’s meet tomorrow.',
    time: '1:15 PM',
    avatar: 'https://via.placeholder.com/50',
    unreadCount: 1,
  },
  {
    id: '3',
    name: 'Jane Smith',
    lastMessage: 'Let’s meet tomorrow.',
    time: '1:15 PM',
    avatar: 'https://via.placeholder.com/50',
    unreadCount: 5,
  },
  // Add more items here
];

const ChatList: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Chat',
      headerStyle: {
        backgroundColor: '#17191A',
      },
      headerShadowVisible: false,
      headerTintColor: '#fff',
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatScreen')}
    >
      <Image
        source={require('../assets/images/profiles.png')} // Replace with `item.avatar` if dynamic avatar URLs are used
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <View style={styles.chatMeta}>
        <Text style={styles.time}>{item.time}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  listContainer: {
    paddingVertical: 10,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: '#333',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  lastMessage: {
    color: '#555',
    marginTop: 3,
  },
  chatMeta: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#007AFF', // Blue background for the badge
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 5,
  },
  unreadCount: {
    color: '#fff', // White text color
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
