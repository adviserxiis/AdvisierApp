import React, { FC } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Example icon library, you can use any icon library

interface InputFieldProps {
  label: string;
  placeholder: string;
  maxLength: number;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  error?: string;
  helperText?: string; // Optional helper text like "0/10"
}

const InputField: FC<InputFieldProps> = ({
  label,
  placeholder,
  maxLength,
  value,
  onChangeText,
  multiline = false,
  error = '',
  helperText = '',
}) => {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {helperText && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
      <View style={[styles.inputContainer, error && styles.errorBorder]}>
        <TextInput
          style={[styles.textInput, multiline && styles.textArea]}
          placeholder={placeholder}
          placeholderTextColor={error ? 'red' : 'gray'} // Dynamically set placeholder color
          maxLength={maxLength}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
        />
        {error && (
          <Icon
            name="error" // Icon name (change to whatever icon you prefer)
            size={20}
            color="red"
            style={styles.icon}
          />
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
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
  helperText: {
    color: 'gray',
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Light',
  },
  errorBorder: {
    borderColor: 'red', // Red border when there's an error
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    // backgroundColor: '#17191A',
    borderRadius: 8,
  },
  icon: {
    marginRight: 10, // Space between the icon and TextInput
  },
  textInput: {
    flex: 1,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(14),
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Regular',
    marginTop: 1,
  },
});
