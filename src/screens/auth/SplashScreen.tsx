import React, {useEffect} from 'react';
import {
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
  NativeSyntheticEvent,
  LinkingEvent,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {extractTypeAndId} from '../../utils/dateUtils';

// Define the navigation types for your app
type RootStackParamList = {
  WelcomeScreen: undefined;
  Main: undefined;
  ViewProfile: {username: string};
};

const SplashScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'WelcomeScreen'}],
      });
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer if the component unmounts
  }, [navigation]);

  const getReelById = async (
    id: string,
    deepLinkType: string,
  ): Promise<void> => {
    console.log('Reel ID:', id, 'Deep Link Type:', deepLinkType);

    try {
      // Fetching reel by ID
      const response = await fetch(
        `https://adviserxiis-backend-three.vercel.app/share/reel/${id}`,
        {
          method: 'GET',
        },
      );

      // Check for non-200 HTTP status codes
      if (!response.ok) {
        throw new Error(`Failed to fetch reel. Status: ${response.status}`);
      }

      // Parse JSON response
      const data = await response.json();
      console.log('Fetched Reel Data:', data);

      // Handle deep link navigation
      if (deepLinkType !== 'RESUME') {
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      }

      // Navigate to 'ViewProfile' with the fetched data
      navigation.navigate('ViewProfile', {
        data: [data], // Use parsed data
        index: 0,
      });
    } catch (error:any) {
      console.error('Error fetching reel:', error.message);
    }
  };

  const handleDeepLink = async (
    event: NativeSyntheticEvent<LinkingEvent>,
    deepLinkType: string,
  ): Promise<void> => {
    const {url} = event.nativeEvent;
    if (!url) {
      handleNoUrlCase(deepLinkType);
      return;
    }

    const {type, id} = extractTypeAndId(url);
    switch (type) {
      case 'reel':
        await getReelById(id, deepLinkType);
        break;
      case 'user':
        await handleUserCase(id, deepLinkType);
        break;
      // Add more cases as needed
      default:
        handleDefaultCase(deepLinkType);
        break;
    }
  };

  const handleNoUrlCase = (deepLinkType: string): void => {
    if (deepLinkType !== 'RESUME') {
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    }
  };

  const handleUserCase = (deepLinkType: string, id: string): void => {
    if (deepLinkType !== 'RESUME') {
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    }

    navigation.navigate('ViewProfile', {username: id});
  };

  const handleDefaultCase = (deepLinkType: string): void => {
    if (deepLinkType !== 'RESUME') {
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    }
  };

  useEffect(() => {
    const handleInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        handleDeepLink(
          {nativeEvent: {url}} as NativeSyntheticEvent<LinkingEvent>,
          'CLOSE',
        );
      }
    };

    handleInitialURL();
    const listener = Linking.addEventListener('url', event =>
      handleDeepLink(event, 'RESUME'),
    );

    return () => listener.remove();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Image
        source={require('../../assets/images/Luink.png')}
        resizeMode="contain"
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.textL}>L</Text>
        <Text style={styles.textU}>u</Text>
        <Text style={styles.textInk}>ink</Text>
        <Text style={styles.textAi}>.ai</Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 127,
    height: 132,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -5,
  },
  textL: {
    fontSize: 38,
    color: '#000',
  },
  textU: {
    fontSize: 38,
    color: '#000',
    opacity: 0.1,
  },
  textInk: {
    fontSize: 38,
    color: '#000',
  },
  textAi: {
    fontSize: 38,
    color: 'blue',
  },
});
