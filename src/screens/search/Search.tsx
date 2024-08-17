import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Search = () => {
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust for iOS
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          {isFocused && (
            <Icon name="search" size={18} color="#B0B3B8" style={styles.searchIcon} />
          )}
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholderTextColor="#B0B3B8"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3B3C',
    marginVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFF',
  },
});
