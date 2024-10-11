import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const BookingCard = ({booking}) => {
  const navigation=useNavigation();
  return (
    <View
      style={{
        padding: 15,
        marginHorizontal: 16,
        marginTop: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#6C6C72B4',
        flexDirection: 'column',
        gap: 3,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontFamily: 'Poppins-Medium',
          }}>
          {booking.title}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: '#0069B4',
            lineHeight: 28,
            fontFamily: 'Poppins-Medium',
          }}>
          ₹{booking?.price}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          color: '#9C9C9C',
          fontFamily: 'Poppins-Medium',
        }}>
        Purchase date:{' '}
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
          }}>
          {booking?.date}
        </Text>
      </Text>

      <Text
        style={{
          color: '#9C9C9C',
          fontFamily: 'Poppins-Medium',
          fontSize: 14,
        }}>
        Booking date:{' '}
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
          }}>
          {' '}
          {booking?.by}
        </Text>
      </Text>
      <Text
        style={{
          color: '#9C9C9C',
          fontFamily: 'Poppins-Medium',
          fontSize: 14,
        }}>
        Time:{' '}
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
          }}>
          {' '}
          {booking?.time} - {booking?.from}
        </Text>
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#9C9C9C',
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
            }}>
            Booked By:{' '}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
            }}>
            {' '}
            {booking?.by}
          </Text>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('CallScreen')} style={{
          paddingVertical:2,
          backgroundColor:'#0069B4',
          paddingHorizontal:29,
          alignItems:'center',
          borderRadius:5,
        }}>
          <Text style={{
            color:'#FFFFFF',
            fontFamily:'Poppins-Regular',
            marginTop:1,
          }}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({});
