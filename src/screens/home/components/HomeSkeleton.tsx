import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const HomeSkeleton = () => {
  // Sample data to represent your list (you can replace with actual data)
  const data = Array(10).fill(1);  // 10 items for demonstration

  return (
    <FlatList
      data={data}  // Replace with your actual data
      keyExtractor={(item, index) => index.toString()} // Key for each item
      showsVerticalScrollIndicator={false}
      renderItem={() => (
        <View style={styles.container}>
          <SkeletonPlaceholder backgroundColor="#3A3B3C" highlightColor="#484646FF">
            {/* Card Layout */}
            <View style={styles.cardContainer}>
              {/* Profile Image and Texts */}
              <View style={styles.profileContainer}>
                <View style={styles.profileImage} />
                <View style={styles.textContainer}>
                  <View style={styles.name} />
                  <View style={styles.handle} />
                </View>
              </View>

              {/* Post Image Placeholder */}
              <View style={styles.postImage} />

              {/* Caption and Likes */}
              <View style={styles.captionContainer}>
                <View style={styles.captionLine} />
                <View style={styles.captionLine1} />
              </View>
            </View>
          </SkeletonPlaceholder>
        </View>
      )}
      contentContainerStyle={{  }}  // Optional: For padding between skeletons
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 15,
  },
  cardContainer: {
    backgroundColor: '#2C2F33', // Dark background for the card
    // borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // For Android shadow
    marginBottom: 15, // Spacing between cards
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    gap: 5,
  },
  name: {
    width: 100,
    height: 10,
    borderRadius: 5,
  },
  handle: {
    width: 50,
    height: 10,
    borderRadius: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    // borderRadius: 12,
    marginVertical: 10,
  },
  captionContainer: {
    marginTop: 10,
    marginHorizontal:16,
  },
  captionLine1: {
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
    width: '50%',
  },
  captionLine: {
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
    width: '80%',
  },
});

export default HomeSkeleton;
