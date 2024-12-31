import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

interface DateTextInputProps {
    error?:string,
  label: string; // Label for the input
  value?: string; // The current selected duration, if any (as a string)
  setDuration?: (duration: string) => void; // Callback function to update the selected duration
}

const DateTextInput: React.FC<DateTextInputProps> = ({ label, value = '', setDuration, error='' }) => {
  const [selectedDuration, setSelectedDuration] = useState<string>(value); // Tracks selected duration as text

  const durations = [
    { label: '30 min', value: '30' },
    { label: '60 min', value: '60' },
    { label: '90 min', value: '90' },
    { label: '120 min', value: '120' },
  ];

  const handleDurationSelect = (durationValue: string) => {
    setSelectedDuration(durationValue); // Update local state with value
    if (setDuration) {
      console.log(durationValue);
      setDuration(durationValue); // Pass the selected value to the parent component
    }
  };

  return (
    <>
    <View style={styles.fieldContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.durationContainer}>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration.value}
            style={[
              styles.durationButton,
              selectedDuration === duration.value && styles.selectedButton, // Apply selected style
            ]}
            onPress={() => handleDurationSelect(duration.value)} // Use value for selection
          >
            <Text
              style={[
                styles.durationText,
                selectedDuration === duration.value && styles.selectedText, // Apply selected text style
              ]}
            >
              {duration.label} {/* Display label for UI */}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
    </>
  );
};

export default DateTextInput;

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#fff',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Regular',
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 10,
     borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    // marginVertical: 10,
    paddingVertical:10,
  },
  durationButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#808080', // Default background color
  },
  selectedButton: {
    backgroundColor: '#FFFFFF', // Background color for selected option
  },
  durationText: {
    color: '#fffafa',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Regular',
  },
  selectedText: {
    color: 'black', // Text color for selected option
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Regular',
  },
  errorText: {
    color: 'red', // Error text color
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Regular',
    marginTop: 1,
  },
});
