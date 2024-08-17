import React, {useState, useEffect} from 'react';
import {View, StatusBar, Dimensions} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

import VideoPlayer from './components/VideoPlayer';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

const Home = () => {
  const [list, setList] = useState([]);
  const [visibleItem, setVisibleItem] = useState(null);
  const [mute, setMute] = useState(false);

  useEffect(() => {
    async function getVideoList() {
      try {
        const response = await fetch(
          'https://adviserxiis-backend-three.vercel.app/post/getallpostswithadviserdetails',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const jsonresponse = await response.json();
        console.log("Hie", jsonresponse[0].data);
        console.log('bye', response);
        setList(jsonresponse);
      } catch (error) {
        console.error('Error fetching video list:', error);
      }
    }
    getVideoList();
  }, []);

  const handleChangeIndex = ({index}) => {
    setVisibleItem(index);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#000',}}>
      <StatusBar hidden />
      <SwiperFlatList
        vertical={true}
        data={list}
        renderItem={({item, index}) => (
          <VideoPlayer 
            video={item} 
            isVisible={visibleItem === index}
            index={index}
            currentIndex={visibleItem}
            mute={mute}
            setMute={setMute} 
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        onChangeIndex={handleChangeIndex}
        showPagination={false}
      />
    </View>
  );
};

export default Home;
