import { useDispatch, useSelector } from 'react-redux';
import Auth from './Auth';
import Main from './Main';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../features/user/userSlice';
import SplashScreen from '../screens/auth/SplashScreen';

const Navigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          dispatch(setUser(parsedUser));
        }
        console.log(userData);
      } catch (error) {
        console.log('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [dispatch]);

  if (isLoading) {
    // Render a loading screen or splash screen while checking user data
    return <SplashScreen />;
  }

  return user.userid ? (user.profileCompleted ? <Main /> : <Auth />) : <Auth />;
  // return user.userid ?  <Main /> : <Auth />
};

export default Navigator;
