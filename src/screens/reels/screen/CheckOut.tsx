import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
// import { useSelector } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import {RAZERPAY_KEY_ID} from '@env';
import {useSelector} from 'react-redux';
import ZegoExpressEngine from 'zego-express-engine-reactnative';
const CheckOut = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {service, serviceid, adviser,  scheduleTime, scheduleDate} = route.params;
  console.log('User Service', service);
  console.log('User Sevricd', serviceid);
  console.log('User Adsn', adviser);
  console.log('User time', scheduleTime?.slot);
  console.log('User date', scheduleDate?.dateISO);

  useEffect(() => {
    navigation.setOptions({
      title: 'Checkout',

      headerShown: true,
      headerStyle: {
        backgroundColor: '#17191A',
      },
      headerTitleStyle: {
        fontFamily: 'Poppins-Medium',
      },
      headerTintColor: 'white',
      headerTitle: 'Checkout',
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Payment Cancel',
              'Are you sure you want to exist?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => navigation.goBack(), // Go back if 'Yes' is pressed
                },
              ],
              {cancelable: false}, // Make sure the alert is not dismissible by tapping outside
            );
          }}>
          <Icon
            name="arrow-back-sharp"
            style={{color: 'white', paddingHorizontal: 16}}
            size={23}
            color="white"
          />
          {/* <Text style={{color: 'white', paddingHorizontal: 15}}>Back</Text> */}
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function convertMinutesToHours(minutes) {
    if (minutes < 60) {
      return `${minutes} Minutes`;
    }

    const hours = Math.floor(minutes / 60); // Get the number of full hours
    const remainingMinutes = minutes % 60; // Get the remaining minutes

    // If no remaining minutes, just return hours, otherwise append minutes
    if (remainingMinutes === 0) {
      return `${hours} Hour${hours > 1 ? '' : ''}`; // Pluralize 'Hr' if needed
    } else {
      return `${hours} Hour${hours > 1 ? '' : ''} ${remainingMinutes} Min`;
    }
  }

  const [serviceData, setServiceData] = useState(null);

  const getServiceDetails = async () => {
    const serviceids = service?.serviceid || serviceid;
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/service/getservicedetails/${serviceids} `,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const jsonresponse = await response.json();
    setServiceData(jsonresponse);
    console.log(
      'Avdijs',
      jsonresponse?.serviceDetails?.adviserDetails?.username,
    );
    console.log('sevrice Details', jsonresponse);
  };

  useEffect(() => {
    getServiceDetails();
  }, [service]);

  function convertDate(dateString) {
    // Split the input string into parts
    const parts = dateString.split(', ');

    // Extract the day and month from the parts
    const dayMonth = parts[1].trim(); // "19 Oct"
    const [day, month] = dayMonth.split(' ');

    // Return the formatted date string
    return `${day} ${month} 2024`;
  }

  const user = useSelector((state: any) => state.user);

  const handlePayment = async () => {
    console.log('Schedule Date:', scheduleDate);
    console.log('Schedule Time:', scheduleTime);
    console.log(service?.serviceid);
    console.log(user?.userid);
    console.log(service?.adviserid);

    // Check if scheduleDate and scheduleTime are selected
    if (!scheduleDate || !scheduleTime) {
      Alert.alert('Error', 'Please select a date and time before proceeding.');
      return;
    }

    // setShowModal(false); // Close modal

    try {
      // Step 1: Create an order by calling the backend API
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: service?.price * 100, // Convert to paise (e.g., 100 INR = 10000 paise)
          }),
        },
      );

      const orderData = await response.json();

      // Step 2: Razorpay Checkout Options
      const options = {
        key: RAZERPAY_KEY_ID, // Replace with your Razorpay key_id
        amount: orderData.amount, // Amount in smallest currency unit
        currency: 'INR',
        name: user?.name,
        description: 'Payment for Service',
        order_id: orderData.id, // Razorpay order ID
        theme: {color: '#17191A'},
      };

      // Step 3: Trigger Razorpay Checkout
      RazorpayCheckout.open(options)
        .then(async data => {
          // Success handler
          Alert.alert(
            'Payment Successful', // Title of the alert
            '', // Message can be empty if not needed
            [
              {
                text: 'Yes', // Yes button
                onPress: () => navigation.goBack(), // Action to go back when 'Yes' is pressed
              },
            ],
            {cancelable: false}, // Makes the alert not dismissible without pressing a button
          );

          const paymentID = data.razorpay_payment_id;
          console.log('Payment', paymentID);

          // Step 4: After successful payment, initialize ZegoExpressEngine
          try {
            // Create the engine only if it doesn't already exist
            // const zegoEngine = ZegoExpressEngine.instance();

            // if (!zegoEngine) {
            //   await ZegoExpressEngine.createEngineWithProfile({
            //     appID: 1262356013, // Replace with your ZEGOCLOUD app ID
            //     appSign: '99b777ea4289d9f9e818bd822e2584f1043d8b43615004702a3e34d2255b2610', // Replace with your ZEGOCLOUD app Sign
            //     scenario: 0, // Live streaming scenario
            //     // enablePlatformView: enablePlatformView,
            //   });
            //   console.log('ZegoExpressEngine created successfully');
            // }

            // Ensure the engine instance is available
            // const engine = ZegoExpressEngine.instance();

            // Now create or join a room to get the `meetingid`
            const meetingid = `room_${Date.now()}`; // Generate a room ID
            // await engine.loginRoom(meetingid, {
            //   userID: user?.userid,
            //   userName: user?.userInfo?.name,
            // });
            // const meetingid = UUID.v4();

            console.log('Successfully logged into the room:', meetingid);

            // Step 5: After successful room creation, save the payment info
            const paymentResponse = await fetch(
              'https://adviserxiis-backend-three.vercel.app/service/bookorder',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  serviceid: service?.serviceid,
                  userid: user?.userid,
                  adviserid: service?.adviserid,
                  scheduled_date: scheduleDate?.dateISO,
                  scheduled_time: scheduleTime?.slot,
                  meetingid: meetingid,
                  paymentId: paymentID,
                }),
              },
            );

            const paymentData = await paymentResponse.json();
            console.log('Payment saved:', paymentData);

            // const payload = {
            //   userid: user.userid,
            //   adviserid: service?.adviserid,
            //   serviceid: service?.serviceid,
            //   paymentid: paymentID,
            // };

            // Sending confirmation email

            try {
              const emailResponse = await fetch(
                'https://adviserxiis-backend-three.vercel.app/sendconfirmationemail',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userid: user.userid,
                    adviserid: service?.adviserid,
                    serviceid: service?.serviceid,
                    paymentid: paymentID,
                  }),
                },
              );

              const textResponse = await emailResponse.text(); // Get the response as text
              console.log('Raw response:', textResponse); // Log the raw response

              // Check if the response is valid JSON
              let emailData;
              try {
                emailData = JSON.parse(textResponse);
                console.log('Email sent:', emailData);
              } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError);
                // Additional handling for non-JSON responses
                console.error('Response is not JSON:', textResponse);
              }
            } catch (error) {
              console.error('Error in sending emails', error);
            }
          } catch (error) {
            console.error('Error initializing ZegoExpressEngine:', error);
            // Alert.alert('Error', 'Failed to initialize video engine.');
          }
        })
        .catch((error: any) => {
          // Failure handler
          Alert.alert('Payment Failed');
          // console.error("Payment failed:", error);
        });
    } catch (error) {
      Alert.alert('Error', `Error creating order: ${error.message}`);
    }
  };

  function getStartTime(timing) {
    // Check if timing is a valid string
    if (typeof timing !== 'string') {
      throw new Error('Input must be a string');
    }

    // Split the timing string by the hyphen
    const parts = timing.split('-');

    // Trim and return the first part (start time)
    return parts[0].trim();
  }

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#17191A',
          paddingHorizontal: 16,
        }}>
        <View
          style={{
            backgroundColor: '#3c3c3c',
            // paddingHorizontal:16,
            // paddingVertical:16,
            padding: 16,
            marginVertical: 10,
            borderRadius: 15,
            flexDirection: 'column',
            gap: 16,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: 'white',
              fontFamily: 'Poppins-Medium',
              letterSpacing: 0.2,
            }}>
            {serviceData?.serviceDetails?.service_name}
          </Text>
          <View
            style={{
              flexDirection: 'column',
              gap: 13,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  opacity: 0.6,
                  fontFamily: 'Poppins-Regular',
                }}>
                Booking Date
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  // opacity:0.6,
                  fontFamily: 'Poppins-Medium',
                }}>
                {convertDate(scheduleDate?.dateFormatted)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  opacity: 0.6,
                  fontFamily: 'Poppins-Regular',
                }}>
                Time
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  // opacity:0.6,
                  fontFamily: 'Poppins-Medium',
                }}>
                {getStartTime(scheduleTime?.slot)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  opacity: 0.6,
                  fontFamily: 'Poppins-Regular',
                }}>
                Duration
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  // opacity:0.6,
                  fontFamily: 'Poppins-Medium',
                }}>
                {convertMinutesToHours(service?.duration)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  opacity: 0.6,
                  fontFamily: 'Poppins-Regular',
                }}>
                Offered By
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  // opacity:0.6,
                  fontFamily: 'Poppins-Medium',
                }}>
                {serviceData?.serviceDetails?.adviserDetails?.username}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#3c3c3c',
            // paddingHorizontal:16,
            // paddingVertical:16,
            padding: 16,
            marginVertical: 10,
            borderRadius: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: 'white',
              opacity: 0.6,
              fontFamily: 'Poppins-Regular',
            }}>
            Payable Amount
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: 'white',
              // opacity:0.6,
              fontFamily: 'Poppins-Medium',
            }}>
            ₹{service?.price}
          </Text>
        </View>
      </SafeAreaView>
      <View
        style={{
          //   flexDirection: 'row',
          //   justifyContent: 'space-between',
          //   alignItems: 'flex-end',
          paddingHorizontal: 16,
          backgroundColor: '#17191A',
          paddingVertical: 16,
          //   gap: 10,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#0069B4',
            // alignItems:'center',
            width: '100%',
            paddingHorizontal: 90,
            // flex: 1,
            // marginRight:10,
            borderRadius: 15,
            padding: 15,
          }}
          onPress={handlePayment}>
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              fontSize: 17,
              fontFamily: 'Poppins-Regular',
            }}>
            Pay
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CheckOut;

const styles = StyleSheet.create({});
