import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import ServiceComponent from './components/ServiceComponent';
import ServiceSkeleton from './components/ServiceSkeleton';

// Define types for the service data
type ServiceData = {
  id: string;
  service_name: string;
  about_service: string;
  price: string;
  duration: string;
  provider: string;
  followers: string[];
  role: string;
  avatar: any; // Use any for images as the type may vary
};

const Services = () => {
  const navigation = useNavigation();
  const [servicesData, setServicesData] = useState<ServiceData[]>([]);
  const [searchService, setSearchService] = useState<string>('');
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Services',
      headerStyle: {
        backgroundColor: '#17191A',
      },
      headerTintColor: 'white',
      headerShadowVisible: false,
    });
  }, [navigation]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/service/getallservices',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const jsonResponse = await response.json();
      setServicesData(jsonResponse);
      setFilteredServices(jsonResponse);
      console.log('Service Fetch', jsonResponse);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Hi');
    const timer = setTimeout(() => {
      fetchService();
    },100); // Delay the fetch by 2 seconds

    // Cleanup the timeout when the component is unmounted or when effect is re-triggered
    return () => clearTimeout(timer);
  }, []);

  const fetchSearchService = async () => {
    const response = await fetch(
      `https://adviserxiis-backend-three.vercel.app/service/searchservices/${searchService}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const jsonResponse = await response.json();
    setFilteredServices(jsonResponse);
    console.log('Service Searched', jsonResponse);
  };

  useEffect(() => {
    if (searchService.length > 0) {
      fetchSearchService(); // Fetch results when searchService changes
    } else {
      setFilteredServices(servicesData); // Reset to all services when search is cleared
    }
  }, [searchService, servicesData]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#17191A',
      }}>
      <View>
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="white" />
          <TextInput
            value={searchService}
            onChangeText={setSearchService}
            style={styles.searchInput}
            placeholder="Search by name of service"
            placeholderTextColor="#757676"
          />
        </View>
      </View>
      {loading ? (
        <View>

          <ServiceSkeleton />
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <ServiceComponent item={item} />}
          contentContainerStyle={{
            paddingBottom: 20,
            gap: 16,
            marginTop: 10,
            paddingHorizontal: 16,
          }}
        />
      )}
    </View>
  );
};

export default Services;

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#3a3b3c',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    height: 44,
    alignItems: 'center',
    gap: 3,
    flexDirection: 'row',
  },
  searchInput: {
    color: 'white',
    flex: 1,
    fontSize: 14,
  },
});
