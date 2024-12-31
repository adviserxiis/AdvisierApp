import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-virtualized-view';
import Icon from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';

const data = [
  {
    id: '1',
    title: 'Fitness',
    image: require('../../assets/images/fitness.jpg'),
  },
  {id: '2', title: 'Food', image: require('../../assets/images/food.png')},
  {id: '3', title: 'Design', image: require('../../assets/images/design.png')},
  {id: '4', title: 'Sports', image: require('../../assets/images/sports.png')},
  {id: '5', title: 'Art', image: require('../../assets/images/art.png')},
];

const Search = () => {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const [list, setList] = useState([]);

  const handlePress = useCallback((item) => {
    setSelectedId(item.id);
    navigation.navigate('SearchText', { selectedCategory: item.title });
  }, [navigation]);

  // useEffect(() => {
  //   const getVideoList = async () => {
  //     try {
  //       const response = await fetch(
  //         'https://adviserxiis-backend-three.vercel.app/post/getallpostswithadviserdetails',
  //         {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         },
  //       );
  //       const jsonResponse = await response.json();
  //       // console.log(jsonResponse);
  //       setList(jsonResponse);
  //     } catch (error) {
  //       console.error('Error fetching video list:', error);
  //     }
  //   };
  //   getVideoList();
  // }, []);

  const RenderCategory = memo(({ item, isSelected, onPress }) => (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[
        styles.categoryContainer,
        isSelected && styles.selectedCategory,
      ]}
    >
      {item.image && <Image source={item.image} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={styles.text}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  ));
  
  const renderReels = useCallback(({ item }) => <RenderReel item={item} />, []);

  // const RenderReel = memo(({ item}) => (
  //   <TouchableOpacity style={styles.reelContainer}>
  //     <Video
  //       source={{ uri: item?.data?.post_file }}
  //       style={styles.video}
  //       controls={false}
  //       muted={true}
  //       resizeMode='contain'
  //     />
  //   </TouchableOpacity>
  // ));


  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust for iOS
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainerWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchText')}
            style={styles.searchContainer}>
            <Icon
              name="search"
              size={18}
              color="#B0B3B8"
              style={styles.searchIcon}
            />
            <Text style={styles.searchText}>Search by name or category</Text>
          </TouchableOpacity>
        </View>

        {/* <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.categoriesWrapper}>
            <Text style={styles.categoriesTitle}>Categories</Text>
            <FlatList
            horizontal
            data={data}
            renderItem={({ item }) => ( */}
              {/* <RenderCategory
                item={item}
                isSelected={selectedId === item.id}
                onPress={handlePress}
              />
            )}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
          />
          </View> */}

          {/* <View style={styles.reelsWrapper}>
            <FlatList
              data={list}
              renderItem={renderReels}
              keyExtractor={item => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
          </View> */}
        {/* </ScrollView> */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  searchContainerWrapper: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3B3C',
    marginTop: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 44,
  },
  searchIcon: {
    marginRight: 3,
  },
  searchText: {
    fontSize: 14,
    paddingLeft: 3,
    color: '#FFF',
  },
  categoriesWrapper: {
    marginTop: 10,
  },
  categoriesTitle: {
    fontFamily: 'Poppins-Medium',
    paddingLeft: 16,
    color:'white'
  },
  categoryContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    marginTop: 7,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedCategory: {
    borderColor: 'white',
  },
  image: {
    width: 100,
    height: 100,
    opacity: 0.5,
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  reelContainer: {
    flex: 1,
    margin:5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    height:270,
    width:'100%',
    backgroundColor: 'black',
  },
  reelsWrapper: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
});
