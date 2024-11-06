import {
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

// const servicesData = [
//   // Add more data items here as needed
//   {
//     id: '1',
//     service_name: 'UI UX Career Counseling',
//     about_service:
//       'I will provide you personal guidance on how to become a UI/UX designer. What all tools you need to learn, and...',
//     price: '499',
//     duration: '130',
//     provider: 'Philips Paul',
//     role: 'UI UX Designer',
//     avatar: require('../../assets/images/profiles.png'),
//   },
//   {
//     id: '2',
//     service_name: 'UI UX Career Counseling',
//     about_service:
//       'I will provide you personal guidance on how to become a UI/UX designer. What all tools you need to learn, and...',
//     price: '499',
//     duration: '120',
//     provider: 'Philips Paul',
//     role: 'UI UX Designer',
//     avatar: require('../../assets/images/profiles.png'),
//   },
//   {
//     id: '3',
//     service_name: 'UI UX Career Counseling',
//     about_service:
//       'I will provide you personal guidance on how to become a UI/UX designer. What all tools you need to learn, and...',
//     price: '499',
//     duration: '122',
//     provider: 'Philips Paul',
//     role: 'UI UX Designer',
//     avatar: require('../../assets/images/profiles.png'),
//   },
//   {
//     id: '4',
//     service_name: 'UI UX Career Counseling',
//     about_service:
//       'I will provide you personal guidance on how to become a UI/UX designer. What all tools you need to learn, and...',
//     price: '499',
//     duration: '140',
//     provider: 'Philips Paul',
//     role: 'UI UX Designer',
//     avatar: require('../../assets/images/profiles.png'),
//   },
//   {
//     id: '5',
//     service_name: 'UI UX Career Counseling',
//     about_service:
//       'I will provide you personal guidance on how to become a UI/UX designer. What all tools you need to learn, and...',
//     price: '499',
//     duration: '150',
//     provider: 'Philips Paul',
//     role: 'UI UX Designer',
//     avatar: require('../../assets/images/profiles.png'),
//   },
// ];

const Services = () => {
  const navigation = useNavigation();
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

  const [servicesData, setServicesData] = useState([]);

  const [searchService, setSearchService] = useState('');

  const [filteredServices, setFilteredServices] = useState([]);

  const fetchService = async () => {
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
    console.log('Service Fet', jsonResponse);
  };

  useEffect(() => {
    fetchService();
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
    console.log("Service Searched", jsonResponse);
  };

  useEffect(() => {
    if (searchService.length > 0) {
      fetchSearchService(searchService); // Fetch results when searchService changes
    } else {
      setFilteredServices(servicesData); // Reset to all services when search is cleared
    }
  }, [searchService, servicesData]);

// useFocusEffect(
//     React.useCallback(() => {
//       const fetchService = async () => {
//         const response = await fetch(
//           'https://adviserxiis-backend-three.vercel.app/service/getallservices',
//           {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           },
//         );
//         const jsonResponse = await response.json();
//         setServicesData(jsonResponse);
//         setFilteredServices(jsonResponse); // Initialize filtered services
//         console.log('Service Fetch', jsonResponse);
//       };

//       fetchService(); // Fetch services when the screen is focused
//     }, [])
//   );

//   useEffect(() => {
//     const fetchSearchService = async (searchTerm) => {
//       const response = await fetch(
//         `https://adviserxiis-backend-three.vercel.app/service/searchservices/${searchTerm}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );
//       const jsonResponse = await response.json();
//       console.log("Service Searched", jsonResponse);
//       setFilteredServices(jsonResponse); // Update filtered services with search results
//     };

//     if (searchService.length > 0) {
//       fetchSearchService(searchService); // Fetch results when searchService changes
//     } else {
//       setFilteredServices(servicesData); // Reset to all services when search is cleared
//     }
//   }, [searchService, servicesData]);
  

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#17191A',
      }}>
      <View
        style={{
          paddingHorizontal: 16,
          //   marginTop: 10,
        }}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="#757676" />
          <TextInput
            value={searchService}
            onChangeText={setSearchService}
            style={styles.searchInput}
            placeholder="Search by name of service"
            placeholderTextColor="#757676"
          />
        </View>
        {/* <TextInput
          placeholder="Search by name of service"
          style={{
            backgroundColor: '#3A3B3C',
            fontFamily: 'Poppins-Regular',
          }}
        /> */}
        <FlatList
        //   data={servicesData}
        data={filteredServices}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <ServiceComponent item={item} />}
          contentContainerStyle={{
            // marginTop:10,
            paddingBottom: 60,
            gap: 10,
            marginTop: 10,
          }}
          //   columnWrapperStyle={{
          //     marginTop:10,
          //   }}
        />
      </View>
      <View
        style={{
          height: 100,
        }}
      />
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
    height: 40,
    // justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    flexDirection: 'row',
  },
  searchInput: {
    color: 'white',
    flex: 1,
    fontSize: 14,
    // marginTop:4,
    // fontFamily:'Poppins-Regular'
  },
});
