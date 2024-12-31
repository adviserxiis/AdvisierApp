import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const SearchText = () => {
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.selectedCategory) {
      setSearch(route.params.selectedCategory); // Set the initial value to the selected category
    }
  }, [route.params?.selectedCategory]);

  const handleSearch = async text => {
    setSearch(text);
    console.log('Entered Text', text);
    try {
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/creator/getuserbyname/${text}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log('Response:', jsonResponse); // Check the structure of the response

      const users = jsonResponse.map((user, idx) => ({
        id: user.id,
        profilePhoto: user.profile_photo,
        name: user.username,
        description: user.professional_title,
      }));
      setFilteredUsers(users);
      // Ensure jsonResponse is an array and filter accordingly
      // if (Array.isArray(jsonResponse)) {
      //   const filtered = jsonResponse.filter(user => {
      //     // Add checks to avoid accessing properties of undefined
      //     return user && user.name && user.name.toLowerCase().includes(text.toLowerCase());
      //   });
      //   setFilteredUsers(filtered);
      // } else {
      //   console.error('Unexpected response format:', jsonResponse);
      // }
    } catch (error) {
      console.error('Search error:', error);
      // Optionally, set an error state to show an error message to the user
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.userContainer}
      onPress={() => navigation.navigate('PostView', item.id)}>
      {item.profilePhoto ? (
        <Image source={{uri: item.profilePhoto}} style={styles.profilePhoto} />
      ) : (
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 25,
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="user" size={20} color="#B0B3B8" />
        </View>
      )}
      <View style={styles.userInfo}>
        {item.name && <Text style={styles.userName}>{item.name}</Text>}
        {item.description && (
          <Text style={styles.userDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
      {/* <TouchableOpacity style={styles.closeButton} onPress={() => handleClose(item.id)}>
        <Icon name="x" size={20} color="#B0B3B8" />
      </TouchableOpacity> */}
    </TouchableOpacity>
  );

  // const handleClose = (userId) => {
  //   // Handle the close action, such as removing the user from the list
  //   const updatedUsers = filteredUsers.filter(user => user.id !== userId);
  //   setFilteredUsers(updatedUsers);
  // };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust for iOS
    >
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            height: 40,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
            marginBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                console.warn('No screen to go back to');
              }
            }}>
            <Icon name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            {/* <Text style={{
              fontSize: 14,
              paddingLeft:3,
            }}>Search by name or category</Text> */}
            <TextInput
              placeholder="Search by name or category"
              style={styles.searchInput}
              value={search}
              autoFocus={true}
              onChangeText={handleSearch}
              placeholderTextColor="#B0B3B8"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
        </View>
        <FlatList
          data={filteredUsers}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SearchText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
    paddingHorizontal: 16,
  },
  listContainer: {
    flexGrow: 1,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profilePhotoIcon: {
    // padding: 12,
    // height:50,
    // width:50,
    // backgroundColor: '#FFFFFF', // or any other background color you prefer
    // alignContent: 'center',
    // justifyContent: 'center',
    // borderRadius: 25, // Match the border radius to the profilePhoto for a consistent look
    // marginRight: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    // backgroundColor:'#333',
    marginVertical: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#3A3B3C',
    marginTop: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 40,
  },
  searchIcon: {
    marginRight: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  userDescription: {
    color: '#B0B3B8',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  closeButton: {
    padding: 5,
  },
});
