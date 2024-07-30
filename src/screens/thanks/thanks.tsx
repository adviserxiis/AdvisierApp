import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const Thanks = () => {
    const navigation = useNavigation();
    // useEffect(()=>{
    //     setTimeout(() => {
    //         navigation.navigate('Login');
    //     }, 2000);
    // },[navigation])
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.bgImage}
      />
      <Text style={styles.heading}>Thank you for downloading our app</Text>
      <Text style={styles.para}>
        You're on our waitlist, we'll keep you updated regarding our app
        updates.
      </Text>
    </View>
  );
};

export default Thanks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161616',
    paddingHorizontal:15,
    gap: 5,
  },
  bgImage: {
    width: 125,
    height: 60,
    objectFit: 'contain',
    marginBottom:10,
  },
  heading: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  para: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Poppins-ThinItalic',
    width:'100%',
  },
});
