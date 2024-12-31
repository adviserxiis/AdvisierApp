import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

type CheckOutButtonProps = {
  isDisabled: boolean;
  CheckOuts: () => void;
};

const CheckOutButton: React.FC<CheckOutButtonProps> = ({ isDisabled, CheckOuts }) => {
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={CheckOuts}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={isDisabled ? ['#d3d3d3', '#d3d3d3'] : ['#3184FE', '#003582']}
        style={[styles.gradient, isDisabled && styles.disabledGradient]}
      >
        <Text
          style={[
            styles.text,
            {
              color: isDisabled ? 'grey' : 'white',
            },
          ]}
        >
          Proceed
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 180,
    borderRadius: 8,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width:'100%',
    paddingHorizontal: 20,
  },
  disabledGradient: {
    backgroundColor: '#d3d3d3', // Gray background when disabled
  },
  text: {
    marginTop: 1,
    letterSpacing: 0.1,
    fontSize: RFValue(14),
    fontFamily: 'Poppins-Regular',
  },
});

export default CheckOutButton;
