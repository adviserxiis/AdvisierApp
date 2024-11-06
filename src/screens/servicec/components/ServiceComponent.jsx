import {Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const ServiceComponent = ({item}) => {
    const navigation = useNavigation();

    function convertMinutesToHours(minutes) {
        if (minutes < 60) {
          return `${minutes} Min`;
        }
    
        const hours = Math.floor(minutes / 60); // Get the number of full hours
        const remainingMinutes = minutes % 60; // Get the remaining minutes
    
        // If no remaining minutes, just return hours, otherwise append minutes
        if (remainingMinutes === 0) {
          return `${hours} Hr${hours > 1 ? '' : ''}`; // Pluralize 'Hr' if needed
        } else {
          return `${hours} Hr${hours > 1 ? '' : ''} ${remainingMinutes} Min`;
        }
      }

  return (
    <Pressable onPress={()=>navigation.navigate('KnowMore',{service:item?.data})}
      style={{
        padding: 12,
        borderWidth: 1,
        borderColor: '#3c3c3c',
        // opacity:0.2,
        borderRadius: 10,
        // marginVertical:5,
        flexDirection: 'column',
        gap: 8,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 15,
            fontFamily: 'Poppins-Medium',
            maxWidth: '85%',
          }}>
          {item?.data?.service_name}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Poppins-Medium',
            color: '#0069B4',
          }}>
          ₹{item?.data?.price}
        </Text>
      </View>
      <Text
        numberOfLines={2}
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 12,
        }}>
        {item?.data?.about_service}
      </Text>
      <Text
        style={{
          fontSize: 13,

          fontFamily: 'Poppins-Medium',
        }}>
        Duration:{' '}
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
          }}>
          {convertMinutesToHours(item?.data?.duration)}
        </Text>
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            maxWidth: '70%',
          }}>
          <Image
            source={{uri: item?.adviser?.profile_photo}}
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              gap: 4,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: 'white',
                fontSize: 12,
                lineHeight: 16,
              }}>
              {item?.adviser?.username}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 10,
                lineHeight: 14,
                // maxWidth: '86%',
              }}>
              {item?.adviser?.professional_title}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('KnowMore',{service: item?.data})}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 4,
            backgroundColor: '#0069B4',
            borderRadius: 5,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              fontFamily: 'Poppins-Regular',
            }}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default ServiceComponent;

const styles = StyleSheet.create({
  
});
