import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import SimpleModal from 'react-native-simple-modal';
import moment from 'moment';

const SlotBooking = ({ visible, onClose, service }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slot, setSlot] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  // Fetch available days and times for the service
  const getAvailable = async () => {
    setLoading(true);
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/service/getavailabledays/${service?.adviserid}`,
      { method: 'GET' }
    );
    const data = await response.json();
    setSlot(data.availability);
    setLoading(false);
  };

  useEffect(() => {
    getAvailable();
  }, []);

  const fetchSlots = async (date, timing, item) => {
    const response = await fetch(
      'https://adviserxiis-backend-three.vercel.app/service/getavailabletimeslots',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: service?.duration,
          timing,
          scheduledDate: date,
          adviserid: service?.adviserid,
        }),
      }
    );
    const jsonresponse = await response.json();
    setSelectedDate(item);
    setSlot(jsonresponse?.availableSlots);
  };

  const CheckOuts = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Please select a date and time');
      return;
    }
    const scheduleTime = selectedTime;
    const scheduleDate = selectedDate;
    onClose();
    navigation.navigate('CheckOut', {
      service,
      scheduleDate,
      scheduleTime,
    });
  };

  return (
    <SimpleModal
      visible={visible}
      modalDidClose={onClose}
      containerStyle={styles.modalContainer}
      overlayStyle={styles.overlay}
    >
      <View style={styles.modalContent}>
        <Text style={styles.headerText}>Book Your Slot</Text>

        {/* Show availability slots */}
        <View>
          {slot.length > 0 ? (
            slot.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => fetchSlots(item.date, item.timing, item)}
                style={styles.slotItem}
              >
                <Text>{item.date}</Text>
                <Text>{item.timing}</Text>
              </Pressable>
            ))
          ) : (
            <Text>No slots available</Text>
          )}
        </View>

        {/* Date and Time selection */}
        {selectedDate && selectedTime && (
          <View>
            <Text>Selected Date: {selectedDate}</Text>
            <Text>Selected Time: {selectedTime}</Text>
          </View>
        )}

        {/* Checkout Button */}
        <Pressable onPress={CheckOuts} style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </Pressable>

        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </SimpleModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  slotItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  checkoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default SlotBooking;
