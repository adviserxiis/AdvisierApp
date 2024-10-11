import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon1 from 'react-native-vector-icons/FontAwesome5'
const PreviewScreen = () => {
  const route = useRoute();
  const {service} = route.params;
  const navigation = useNavigation();

  console.log('SJjsnd', service);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Service',
      headerTitleStyle: {
        fontFamily: 'Poppins-Medium',
      },
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 16,
          }}
          onPress={() => {
            navigation.navigate('EditServices', {service});
          }}>
          <Icon1 name="pen" color="white" size={16} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#17191A',
      },
      headerShadowVisible: false,
      headerTintColor: 'white',
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{service?.service_name}</Text>
      <Text style={styles.duration}>
        Duration -{' '}
        <Text style={styles.regularText}>{service?.duration} Min</Text>
      </Text>
      {/* Handle the multiline description properly */}
      <Text style={styles.description}>{service?.about_service}</Text>
    </View>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'column',
    gap: 20,
  },
  title: {
    fontSize: 22,
    color: 'white',
    letterSpacing: 0.2,
    fontFamily: 'Poppins-Medium',
  },
  duration: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  regularText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
  },
  description: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    lineHeight: 22, // Add this for better readability
    whiteSpace: 'pre-wrap', // Ensures that newlines are respected
  },
});
