import React from 'react';
import {Dimensions, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeletonLoading = () => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={{flex: 1, backgroundColor: '#17191A'}}>
      <SkeletonPlaceholder backgroundColor="#3A3B3C" highlightColor="#484646FF">
        {/* Top Section */}
        <SkeletonPlaceholder.Item
          width={screenWidth}
          height={130}
          borderRadius={0}
        />

        {/* Profile Section */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          paddingHorizontal={20}
        >
          {/* Profile Image */}
          <SkeletonPlaceholder.Item
            width={screenWidth * 0.25}
            height={screenWidth * 0.25}
            borderRadius={50}
            marginTop={-50}
            borderWidth={2}
            borderColor={'black'}
          />

          {/* Name and Title */}
          <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-between"
            marginLeft={14}
            marginTop={10}
          >
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={140}
                height={15}
                borderRadius={15}
              />
              <SkeletonPlaceholder.Item
                width={100}
                height={10}
                borderRadius={5}
                marginTop={10}
              />
            </SkeletonPlaceholder.Item>

            {/* Button */}
            <SkeletonPlaceholder.Item
              width={50}
              height={10}
              marginLeft={20}
              borderRadius={15}
              marginTop={10}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        {/* Bio Section */}
        <SkeletonPlaceholder.Item paddingHorizontal={20} marginTop={15}>
          <SkeletonPlaceholder.Item
            width={140}
            height={15}
            borderRadius={15}
          />
          <SkeletonPlaceholder.Item
            width={100}
            height={10}
            borderRadius={5}
            marginTop={10}
          />
        </SkeletonPlaceholder.Item>

        {/* Stats Section */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          marginVertical={30}
        >
          {['Followers', 'Reels', 'Views'].map((_, index) => (
            <SkeletonPlaceholder.Item
              alignItems="center"
              key={index}
            >
              <SkeletonPlaceholder.Item
                width={70}
                height={10}
                borderRadius={5}
              />
              <SkeletonPlaceholder.Item
                width={50}
                height={10}
                borderRadius={10}
                marginTop={5}
              />
            </SkeletonPlaceholder.Item>
          ))}
        </SkeletonPlaceholder.Item>

        {/* Posts Section */}
        <SkeletonPlaceholder.Item
          marginHorizontal={20}
          height={90}
          width={screenWidth - 32}
          borderRadius={25}
        />

        {/* Tabs */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-around"
          marginTop={20}
          marginHorizontal={20}
        >
          {['posts', 'reels', 'services', 'booking'].map((_, index) => (
            <SkeletonPlaceholder.Item
              key={index}
              width={(screenWidth - 40) / 4}
              height={15}
              borderRadius={15}
            />
          ))}
        </SkeletonPlaceholder.Item>

        {/* User Post Section */}
        <SkeletonPlaceholder.Item
          flexDirection="column"
          marginTop={20}
          marginHorizontal={20}
        >
          {/* Profile and Name */}
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            gap={10}
          >
            <SkeletonPlaceholder.Item
              width={52}
              height={52}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={80}
                height={10}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item
                width={30}
                height={10}
                marginTop={10}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>

          {/* Post Image */}
          <SkeletonPlaceholder.Item
            marginTop={10}
            width={screenWidth - 32}
            height={200}
            borderRadius={10}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default SkeletonLoading;
