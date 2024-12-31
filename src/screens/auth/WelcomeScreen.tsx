import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  ListRenderItem,
} from 'react-native';
import slide from '../../utils/slide'; // Ensure slide is properly typed
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

type SlideItem = {
  id: string;
  image: number | {uri: string};
  title: string;
  description: string;
};

const WelcomeScreen: React.FC = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<SlideItem>>(null);
  const navigation = useNavigation();

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{index?: number}>;
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== undefined) {
      setPageIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};

  const handleNext = () => {
    if (pageIndex < slide.length - 1) {
      flatListRef.current?.scrollToIndex({index: pageIndex + 1});
      setPageIndex(pageIndex + 1);
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  const handleSkip = () => {
    setPageIndex(2);
    flatListRef.current?.scrollToIndex({index: 2, animated: true}); // Scroll to index 2
  };

  const renderItem: ListRenderItem<SlideItem> = ({item}) => (
    <View style={styles.page}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {pageIndex !== 2 && (
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* FlatList for Onboarding Pages */}
      <FlatList
        ref={flatListRef}
        data={slide}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Page Indicators */}
      <View style={styles.indicatorContainer}>
        {slide.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, pageIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {pageIndex === slide.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  page: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: '80%',
    height: '60%',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: 'black',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: 'gray',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#388DEB',
  },
  nextButton: {
    backgroundColor: '#388DEB',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
