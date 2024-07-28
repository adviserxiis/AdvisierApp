import {View, Text, ScrollView} from 'react-native';
import VideoPlayer from './components/VideoPlayer';
import Reels from 'react-native-instagram-reels';
import {useEffect, useState} from 'react';
import {videoList} from '../../api/home';

const Home = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    async function getVideoList() {
      const res = await videoList();

      setList(res);
    }
    getVideoList();
  }, []);
  return (
    <ScrollView>
      {list.map((item, idx) => (
        <VideoPlayer video={item} key={idx} />
      ))}
    </ScrollView>
  );
};
export default Home;
