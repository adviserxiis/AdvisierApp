import React from 'react';
import {View, FlatList, StyleSheet, Pressable} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'; // Importing the library

const ServiceSkeleton = () => {
  // Sample data to represent your list of services (replace with actual data)
  const data = [1, 1, 1, 1];

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => (
        <Pressable style={styles.container}>
          <SkeletonPlaceholder
           backgroundColor="#3A3B3C" highlightColor="#484646FF">
            <View style={styles.header}>
              <View style={styles.skeletonServiceName}></View>
            </View>
            <View
              style={{
                height: 10,
                width: 60,
                borderRadius: 10,
                marginTop: 5,
              }}
            />
            <View style={styles.providerRow}>
              <View style={styles.providerImageSkeleton}></View>
              <View style={styles.providerInfoSkeleton}>
                <View style={styles.skeletonAdviserName}></View>
                <View style={styles.skeletonFollowers}></View>
                <View style={styles.skeletonTitle}></View>
              </View>
            </View>
            <View style={styles.detailsRow} />
          </SkeletonPlaceholder>
        </Pressable>
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // paddingHorizontal:16,
    marginHorizontal: 16,

    borderWidth: 1,
    borderColor: '#FFFFFF27',
    borderRadius: 16,
    backgroundColor: '#252525',
    flexDirection: 'column',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonServiceName: {
    width: '90%',
    height: 16,
    backgroundColor: '#7e7e7e',
    borderRadius: 10,
  },
  skeletonOfferedBy: {
    width: '30%',
    height: 12,
    backgroundColor: '#7e7e7e',
    borderRadius: 4,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 5,
  },
  providerImageSkeleton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7e7e7e',
    marginRight: 12,
  },
  providerInfoSkeleton: {
    flex: 1,
    marginLeft: 10,
  },
  skeletonAdviserName: {
    width: '50%',
    height: 8,
    backgroundColor: '#7e7e7e',
    borderRadius: 4,
  },
  skeletonFollowers: {
    width: '40%',
    height: 8,
    backgroundColor: '#7e7e7e',
    borderRadius: 4,
    marginTop: 5,
  },
  skeletonTitle: {
    width: '80%',
    height: 10,
    backgroundColor: '#7e7e7e',
    borderRadius: 4,
    marginTop: 8,
  },
  detailsRow: {
    height: 20,
    width: '100%',
    // paddingHorizontal: 15,
    // paddingVertical: 10,
    backgroundColor: '#7e7e7e',
    borderRadius: 25,
    // borderWidth:1,
  },
  skeletonSessions: {
    width: '40%',
    height: 12,
    backgroundColor: '#7e7e7e',
    borderRadius: 4,
  },
  detailsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  list: {
    gap: 16,
    marginTop:10,
  },
  skeletonPrice: {
    width: '50%',
    height: 16,
    backgroundColor: '#7e7e7e',
    borderRadius: 4,
  },
});

export default ServiceSkeleton;
