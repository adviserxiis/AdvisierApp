import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

// Define the types for props
interface DateBoxProps {
  item: {
    dateISO: string;
    dateFormatted: string; 
    timing: string; // Adjust the type of 'timing' as needed
  };
  selectedDate: {
    dateISO: string;
  } | null; // selectedDate can be null if no date is selected
  fetchSlots: (dateISO: string, timing: string, item: any) => void; // function to fetch available slots
  // formatDate: (dateISO: string) => string; // function to format the first date string
  // formatDate1: (dateISO: string) => string; // function to format the second date string
}

const DateBox: React.FC<DateBoxProps> = ({
  item,
  selectedDate,
  fetchSlots,
  // formatDate,
  // formatDate1,
}) => {
  const isSelected = selectedDate?.dateISO === item.dateISO;

  const [day, date] = item?.dateFormatted.split(',') || [];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => fetchSlots(item?.dateISO, item?.timing, item)}
      style={[
        styles.container,
        !isSelected && styles.unselectedBorder, // Add border for unselected items
      ]}>
      {isSelected ? (
        // Apply LinearGradient for selected items
        <LinearGradient
          colors={['#3184FE', '#003582']} // Gradient colors
          style={styles.gradient}>
          {/* <Text style={[styles.text, styles.selectedText]}>
            {formatDate(item?.dateISO)}
          </Text> */}
          <Text style={[styles.text, styles.selectedText]}>
            {day} {/* Display day on one line */}
          </Text>
          <Text style={[styles.text, styles.selectedText]}>
            {date} {/* Display date on the next line */}
          </Text>
        </LinearGradient>
      ) : (
        // Default style for unselected items
        <>
          {/* <Text style={styles.text}>{formatDate(item?.dateISO)}</Text> */}
          <Text style={[styles.text, styles.selectedText]}>
            {day} {/* Display day on one line */}
          </Text>
          <Text style={[styles.text, styles.selectedText]}>
            {date} {/* Display date on the next line */}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  unselectedBorder: {
    borderWidth: 1, // Add border width
    borderColor: 'rgba(255, 255, 255, 0.3)', // Border color (light gray)
    borderRadius: 4, // Match the border radius of the gradient
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  gradient: {
    borderRadius: 4, // To match the button's border radius
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Light',
    color: 'white',
  },
  selectedText: {
    fontFamily: 'Poppins-Regular', // Apply different font weight for selected text
  },
  marginText: {
    marginTop: -3, // Margin for the second line of text
  },
});

export default DateBox;
