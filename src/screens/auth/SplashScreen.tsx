import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  // useEffect(()=>{
  //   setTimeout(()=>{
  //     navigation.navigate('Login');
  //   },3000)
  // },[navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Image
        source={require('../../assets/images/Luink.png')}
        resizeMode="contain"
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.textL}>L</Text>
        <Text style={styles.textU}>u</Text>
        <Text style={styles.textInk}>ink</Text>
        <Text style={styles.textAi}>.ai</Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 127,
    height: 132,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -5,
  },
  textL: {
    fontSize: 38,
    color: '#000',
  },
  textU: {
    fontSize: 38,
    color: '#000',
    opacity: 0.1,
  },
  textInk: {
    fontSize: 38,
    color: '#000',
  },
  textAi: {
    fontSize: 38,
    color: 'blue',
  },
});
