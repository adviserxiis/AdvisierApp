import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';

const TagSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedTags = '', onTagsSelected } = route.params || {}; // Safely destructure params
  
  const [tags, setTags] = useState(() => {
    if (Array.isArray(selectedTags)) {
      return selectedTags;  // If it's already an array, use it directly
    }
    if (typeof selectedTags === 'string') {
      return selectedTags.split(', ');  // Split string by ', ' if it's a string
    }
    return [];  // Default to an empty array if neither
  });
  
  
  useEffect(() => {
    navigation.setOptions({
      title: 'Select Tags Topics', // Title of the screen
      headerTintColor: 'white', // Title and button color
      headerStyle: {
        backgroundColor: '#17191A', // Header background color
      },
      headerTitleStyle: {
        fontFamily: 'Poppins-Regular', // Set the font family for the title text
      },
      headerShadowVisible: false, // Disable shadow
    });
  }, [navigation]);

  const availableTags = [
    'Design', 'Art', 'Music', 'Coding', 'Writing', 
    'Photography', 'Dance', 'Gaming', 'Drawing', 'Programming',
    'Crafting', 'Illustration', 'Sculpting', 'Animation', 'UI/UX',
    'Storytelling', 'Painting', 'Filmmaking', 'Editing', 'Videography',
    'Songwriting', 'Composing', 'Podcasting', 'Digital Art', 'Creative Writing',
    'Web Development', 'Graphic Design', 'Fashion Design', 'Calligraphy', 'Typography',
    'App Development', '3D Modeling', 'Character Design', 'Content Creation', 'Blogging',
    'Machine Learning', 'AI Art', 'Game Development', 'Photography Editing', 'Photo Manipulation',
    'Cinematography', 'Theater', 'Poetry', 'Screenwriting', 'DIY Projects',
    'Interior Design', 'Sound Design', 'Performance', 'Creative Coding', 'Mixed Media'
  ];
  

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      // If tag is already selected, remove it
      setTags((prev) => prev.filter((t) => t !== tag));
    } else {
      // If adding a new tag, check limit
      if (tags.length < 5) {
        setTags((prev) => [...prev, tag]);
      } else {
        Alert.alert('Limit Reached', 'You can only select up to 5 tags.');
      }
    }
  };

  const handleSave = () => {
    if (onTagsSelected) {
      onTagsSelected(tags.join(', ')); // Pass back selected tags
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.tagContainer}>
        {availableTags.map((tag) => (
          <LinearGradient
          key={tag}
          colors={tags.includes(tag) ? ['#3184FE', '#003582'] : ['#333', '#333']} // Apply gradient to selected tag
          style={[
            styles.tag,
            tags.includes(tag) ? styles.selectedTag : styles.unselectedTag,
          ]}
        >
          <TouchableOpacity onPress={() => toggleTag(tag)}>
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        </LinearGradient>
        ))}
      </ScrollView>
      {/* <Text style={styles.helperText}>{`Selected: ${tags.length}/5`}</Text> */}
      <LinearGradient
        colors={tags.length === 0 ? ['#555', '#555'] : ['#3184FE', '#003582']} // Use gradient or gray if disabled
        style={[styles.saveButton, tags.length === 0 && styles.disabledButton]} // Apply disabled style
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSave}
          disabled={tags.length === 0} // Disable button if no tags selected
          style={styles.buttonTouchable}
        >
          <Text style={styles.saveButtonText}>Done</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default TagSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
    // padding: 20,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,  // Optional: add some padding at the bottom
  },
  disabledButton: {
    backgroundColor: '#444', // Dim the button if disabled
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 5,
  },
  selectedTag: {
    backgroundColor: '#3184FE',
  },
  unselectedTag: {
    backgroundColor: '#444',
  },
  tagText: {
    color: '#fff',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Regular',
  },
  helperText: {
    marginTop: 10,
    color: 'gray',
    fontSize: 12,
    fontFamily: 'Poppins-Light',
  },
  saveButton: {
    marginVertical: 15,
    marginHorizontal:16,
    paddingVertical:10,
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontFamily: 'Poppins-Regular',
  },
});
