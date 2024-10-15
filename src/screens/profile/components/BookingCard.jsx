import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import moment from 'moment';

const BookingCard = ({booking}) => {
  const navigation=useNavigation();

  function formatDate(dateString) {
    const date = new Date(dateString); // Convert string to Date object
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(date.getDate()).padStart(2, '0'); // Pad with 0 if single digit
    
    return `${year}-${month}-${day}`; // Format YYYY-MM-DD
  }

  const isJoinButtonActive = () => {
    const currentDateTime = moment(); // Current date and time
    const bookingDateTime = moment(
      `${booking?.scheduled_date} ${booking?.scheduled_time}`,
      'YYYY-MM-DD HH:mm'
    ); // Scheduled date and time

    return currentDateTime.isAfter(bookingDateTime); // Check if current time is after the scheduled time
  };

  const user = useSelector((state)=>state.user);
  console.log(user);
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
          {booking?.serviceDetails?.service_name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: '#0069B4',
            lineHeight: 28,
            fontFamily: 'Poppins-Medium',
          }}>
          ₹{booking?.serviceDetails?.price}
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
          {formatDate(booking?.purchased_date)}
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
          {booking?.scheduled_date}
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
          {booking?.scheduled_time}
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
            Offer By:{' '}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
            }}>
            {' '}
            {booking?.adviserDetails?.name}
          </Text>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('CallScreen', {meetingid : booking?.meetingid})} disabled={!isJoinButtonActive()} style={{
          paddingVertical:2,
          backgroundColor: isJoinButtonActive() ? '#0069B4' : 'gray',
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
