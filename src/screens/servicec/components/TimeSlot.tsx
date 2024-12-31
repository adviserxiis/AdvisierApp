import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

interface TimeSlotProps {
  item: { slot: string };
  isSelected: boolean;
  isDisabled: boolean;
  setSelectedTime: (time: any) => void;
  setScheduleTime: (time: any) => void;
  getStartTime: (slot: string) => string;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  item,
  isSelected,
  isDisabled,
  setSelectedTime,
  setScheduleTime,
  getStartTime,
}) => {
  return (
    <Pressable
      style={[
        styles.container,
        isDisabled && styles.disabledBox, // Apply disabled style
        !isSelected && styles.unselectedBorder, // Apply unselected style if not selected
      ]}
      disabled={isDisabled}
      onPress={() => {
        if (!isDisabled) {
          setSelectedTime(item); // Set the selected time
          setScheduleTime(item?.slot); // Update the scheduled time
        }
      }}
    >
      {isSelected ? (
        <LinearGradient colors={['#3184FE', '#003582']} style={styles.gradient}>
          <Text style={[styles.text, styles.selectedText]}>
            {getStartTime(item?.slot)}
          </Text>
        </LinearGradient>
      ) : (
        <Text
          style={[
            styles.text,
            { color: isDisabled ? 'gray' : 'white' }, // Adjust text color for disabled state
          ]}
        >
          {getStartTime(item?.slot)}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    marginRight: 8,
    borderRadius: 4,
  },
  unselectedBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Border color (light gray)
  },
  disabledBox: {
    backgroundColor: '#D3D3D3', // Disabled background color
  },
  gradient: {
    borderRadius: 4, // Match the button's border radius
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Light',
    color: 'white',
  },
  selectedText: {
    fontFamily: 'Poppins-Regular', // Apply different font weight for selected text
  },
});

export default TimeSlot;
