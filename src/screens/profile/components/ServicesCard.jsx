import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const ServicesCard = ({service,servicelist}) => {
  const navigation = useNavigation();
  // console.log(service);

  function convertMinutesToHours(minutes) {
    if (minutes < 60) {
      return `${minutes} Min`;
    }
  
    const hours = Math.floor(minutes / 60); // Get the number of full hours
    const remainingMinutes = minutes % 60;  // Get the remaining minutes
  
    // If no remaining minutes, just return hours, otherwise append minutes
    if (remainingMinutes === 0) {
      return `${hours} Hr${hours > 1 ? '' : ''}`; // Pluralize 'Hr' if needed
    } else {
      return `${hours} Hr${hours > 1 ? '' : ''} ${remainingMinutes} Min`;
    }
  }

  

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'column',
          // justifyContent:'space-between',
          gap: 12,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Medium',
              color: 'white',
            }}>
            {service?.service_name}
          </Text>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 28,
              color: '#0069B4',
              fontFamily: 'Poppins-Medium',
            }}>
            ₹{service?.price}
          </Text>
        </View>
        {/* <View> */}
        <Text
          numberOfLines={3}
          style={{
            fontSize: 12,
            color: '#9C9C9C',
            fontFamily: 'Poppins-Regular',
          }}>
          {service?.about_service}
        </Text>
        {/* </View> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: '#9C9C9C',
              fontFamily: 'Poppins-Medium',
            }}>
            Duration:{' '}
            <Text
              style={{
                fontSize: 14,
                color: '#9C9C9C',
                fontFamily: 'Poppins-Regular',
              }}>
              {convertMinutesToHours(service?.duration)}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            // flex:1,
          }}>
          <Pressable
            style={{
              // backgroundColor:'#0069B4',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 4,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#9C9C9C',
              flex:1,
            }}
            onPress={() => navigation.navigate('EditServices', {service, servicelist})}>
            <Text
              style={{
                color: '#9C9C9C',
                fontSize: 12,
                fontFamily: 'Poppins-Medium',
                marginTop: 2,
              }}>
              Edit
            </Text>
          </Pressable>
          {/* <TouchableOpacity
            style={{
              backgroundColor: '#0069B4',
              paddingHorizontal: 16,
              paddingVertical: 4,
              borderRadius: 4,
              alignItems: 'center',
              // borderWidth:1,
              flex:1,
              // borderColor:'#0069B4'
            }}
            onPress={() => navigation.navigate('PreviewScreen', {service})}>
            <Text
              style={{
                color: 'white',
                fontSize: 12,
                fontFamily: 'Poppins-Medium',
                marginTop: 2,
              }}>
              Preview
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

export default ServicesCard;

const styles = StyleSheet.create({
  card: {
    padding: 15,
    // margin: 10,
    marginHorizontal: 16,
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#6C6C72B4',
  },
  cardContent: {
    marginBottom: 10,
  },
});
