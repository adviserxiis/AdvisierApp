import React from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>User Profile</Text>
        <Pressable style={styles.moreButton}>
          <Icon name="more-vert" size={24} color="#fff" />
        </Pressable>
      </View>
      <View style={styles.profileSection}>
        <Image
          style={styles.profileImage}
          source={{uri: 'https://via.placeholder.com/100'}}
        />
        <Text style={styles.profileName}>Bhavesh Kapoor</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Info</Text>
        <Pressable style={styles.sectionItem}>
          <Icon name="person" size={24} color="#fff" />
          <Text style={styles.sectionItemText}>Profile</Text>
          <Icon name="chevron-right" size={24} color="#fff" />
        </Pressable>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Pressable style={styles.sectionItem}>
          <Icon name="security" size={24} color="#fff" />
          <Text style={styles.sectionItemText}>Legal and Policies</Text>
          <Icon name="chevron-right" size={24} color="#fff" />
        </Pressable>
        <Pressable style={styles.sectionItem}>
          <Icon name="help-outline" size={24} color="#fff" />
          <Text style={styles.sectionItemText}>Help & Support</Text>
          <Icon name="chevron-right" size={24} color="#fff" />
        </Pressable>
      </View>
      <Pressable style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1C1C1E',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
  },
  moreButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionItemText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 32,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#1C1C1E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#1C1C1E',
  },
  footerButton: {
    alignItems: 'center',
  },
});

export default Profile;
