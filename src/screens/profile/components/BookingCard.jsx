import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import moment, { duration } from 'moment';

const BookingCard = ({booking}) => {
  const navigation=useNavigation();
  console.log("Adviser Details",booking?.adviserDetails)
  console.log("Service Details",booking?.serviceDetails)

  function formatDate(dateString) {
    const date = new Date(dateString); // Convert string to Date object
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(date.getDate()).padStart(2, '0'); // Pad with 0 if single digit
    
    return `${year}-${month}-${day}`; // Format YYYY-MM-DD
  }

  console.log(booking?.meetingid)

  // const isJoinButtonActive = () => {
  //   const currentDateTime = moment(); // Current date and time
  //   const bookingDateTime = moment(
  //     `${booking?.scheduled_date} ${booking?.scheduled_time}`,
  //     'YYYY-MM-DD HH:mm'
  //   ); // Scheduled date and time

  //   return currentDateTime.isAfter(bookingDateTime); // Check if current time is after the scheduled time
  // };

  const calculateDuration = (scheduledTime) => {
    // Split the input time string to extract start and end times
    const [startTime, endTime] = scheduledTime.split(' - ');
  
    // Parse the start and end times into moment objects
    const start = moment(startTime, 'h:mm A');
    const end = moment(endTime, 'h:mm A');
  
    // Calculate the duration in minutes
    const duration = end.diff(start, 'minutes');
    // console.log(duration);
  
    return duration; // Return the duration in minutes
  };


  const isJoinButtonActive = () => {
    const currentDateTime = moment(); // Current date and time
  
    // Parse the scheduled start time
    const bookingStartTime = moment(
      `${booking?.scheduled_date} ${booking?.scheduled_time.split(' - ')[0]}`,
      'YYYY-MM-DD h:mm A'
    );
    console.log('Booking Start Time:', bookingStartTime);
  
    // Calculate the meeting end time
    const meetingDurationInMinutes = calculateDuration(booking?.scheduled_time);
    const meetingEndTime = bookingStartTime.clone().add(meetingDurationInMinutes, 'minutes');
    console.log('Meeting Duration in Minutes:', meetingDurationInMinutes);
    console.log('Meeting End Time:', meetingEndTime);
  
    // Check if the current date is the same as the booking date
    const isSameDay = currentDateTime.isSame(bookingStartTime, 'day');
    console.log('Is Same Day:', isSameDay);
  
    // Check if the booking is for tomorrow
    const isNextDay = currentDateTime.isSame(bookingStartTime.clone().add(1, 'day'), 'day');
    console.log('Is Next Day:', isNextDay);
  
    // Check if the current time is within the range (5 minutes before the start and the meeting end)
    const isWithinRange = currentDateTime.isBetween(
      bookingStartTime.clone().subtract(5, 'minutes'), // 5 minutes before the start
      meetingEndTime
    );
    console.log('Is Within Range:', isWithinRange);
  
    // Button is active if it's the same day or the next day and the current time is within the meeting time range
    return (isSameDay || isNextDay) && isWithinRange;
  };


  console.log(booking?.scheduled_time);
  console.log(booking?.scheduled_date);
  // console.log(booking);
  // // Handle button click
  const handleJoinButtonClick = () => {
    const currentDateTime = moment(); // Current date and time
    const bookingDateTime = moment(
        `${booking?.scheduled_date} ${booking?.scheduled_time.split(' - ')[0]}`, // Use only the start time
        'YYYY-MM-DD h:mm A'
    ); // Scheduled start date and time

    // Check if the user is trying to join too early (before the allowed time range)
    if (currentDateTime.isBefore(bookingDateTime.clone().subtract(5, 'minutes'))) {
        alert(`The meeting will start at ${bookingDateTime.format('hh:mm A')} on ${bookingDateTime.format('MMMM D, YYYY')}`); // Display alert message
    } else if (isJoinButtonActive()) {
        // Navigate to CallScreen if conditions are met
        // navigation.navigate('CallScreen', { meetingid: booking?.meetingid });
        navigation.navigate('CallScreen',{ meetingid: booking?.meetingid , adviserid: booking?.adviserid, userid: booking?.userid });
    } else {
        alert("Meeting time has ended."); // Handle case where the meeting is over
    }
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
              color: '#9C9C9C',
            }}>
            {' '}
            {booking?.adviserDetails?.name}
          </Text>
        </View>
        <TouchableOpacity onPress={handleJoinButtonClick}  style={{
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
