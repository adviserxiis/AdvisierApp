import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native'; // Import navigation hook
import Fontisto from 'react-native-vector-icons/Fontisto';

interface TagSelectorProps {
  label: string;
  placeholder: string;
  maxLength: number;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  error?:string;
  helperText?: string; // Optional helper text like "0/10"
  navigateTo?: string; // Optional prop for the navigation target
}

const TagSelector: FC<TagSelectorProps> = ({
  label,
  placeholder,
  maxLength,
  value,
  onChangeText,
  helperText = '',
  error='',
  navigateTo, // Pass the navigation screen name
}) => {
  const navigation = useNavigation(); // Get navigation instance

  const selectedTags = value.split(', ').filter(Boolean); // Convert value into an array of tags

  const handleNavigation = () => {
    if (navigateTo) {
      navigation.navigate(navigateTo, {
        selectedTags: value || '', // Pass current tags as a string
        onTagsSelected: (tags: string) => onChangeText(tags),
      });
    }
  };

  const handleTagRemove = (tag: string) => {
    const updatedTags = selectedTags.filter(t => t !== tag); // Remove tag from array
    onChangeText(updatedTags.join(', ')); // Update the parent component
  };

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {helperText && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
      <TouchableWithoutFeedback onPress={handleNavigation}>
        <View style={styles.selectedTagsContainer}>
          {/* Display selected tags */}
          {selectedTags.length > 0 ? (
            selectedTags.map(tag => (
              <View key={tag} style={styles.selectedTagItem}>
                <Text style={styles.selectedTagText}>{tag}</Text>
                <TouchableOpacity
                  onPress={() => handleTagRemove(tag)}
                  style={styles.removeTagButton}>
                  <Fontisto name="close" size={RFValue(13)} color="black" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text
              style={[
                styles.placeholderText,
                { color: error ? 'red' : 'gray' }, // Dynamically set the color
              ]}
            >
              {placeholder}
            </Text>
          )}
        </View>
      </TouchableWithoutFeedback>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default TagSelector;

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
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  selectedTagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: {
    color: 'black',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Regular',
  },
  removeTagButton: {
    borderRadius: 12,
  },
  removeTagText: {
    color: '#fff',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Bold',
  },
  placeholderText: {
    color: 'gray',
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(14),
    paddingVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Regular',
    marginTop: 1,
  },
});
