import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
// Define type for the navigation prop
type RootStackParamList = {
  KnowMore: {service: any; serviceid: string; adviser: any};
  ViewProfile: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'KnowMore'>;

// Define type for the item prop
interface ServiceComponentProps {
  item: {
    id: string;
    data: {
      service_name: string;
      price: number;
      about_service: string;
      duration: number;
      adviserid: string;
    };
    adviser: {
      profile_photo: string;
      username: string;
      professional_title: string;
      followers: string[];
    };
  };
}

const ServiceComponent: React.FC<ServiceComponentProps> = ({item}) => {
  const navigation = useNavigation<NavigationProp>();

  const convertMinutesToHours = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes === 0
      ? `${hours} hr`
      : `${hours} hr ${remainingMinutes} min`;
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('KnowMore', {
          service: item?.data,
          serviceid: item?.id,
          adviser: item?.adviser,
        })
      }
      style={styles.container}>
      <Text style={styles.serviceName} numberOfLines={1}>
        {item?.data?.service_name}
      </Text>
      <Text style={styles.offeredBy}>Offered by</Text>
      <View style={styles.providerRow}>
        <View
          style={{
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center',
          }}>
          <Pressable
            onPress={() =>
              navigation.navigate('PostView', item?.data?.adviserid)
            }>
            <Image
              source={{uri: item?.adviser?.profile_photo}}
              style={styles.profilePhoto}
            />
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              // marginTop:3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name="star" color="yellow" size={12} />
            <Text
              style={{
                fontSize: RFValue(10),
                fontFamily: 'Poppins-Regular',
                color: 'white',
                marginTop: 5,
                // lineHeight:20,
              }}>
              0
            </Text>
          </View>
        </View>
        <View style={styles.providerInfo}>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'flex-start',
              justifyContent: 'space-between',
            }}>
            <Pressable
              onPress={() =>
                navigation.navigate('PostView', item?.data?.adviserid)
              }>
              <Text style={styles.adviserName}>{item?.adviser?.username}</Text>
            </Pressable>
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                fontFamily: 'Poppins-SemiBold',
              }}>
              {item?.adviser?.followers?.length || 0}{' '}
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                }}>
                {' '}
                Followers
              </Text>
            </Text>
          </View>
          <Text numberOfLines={1} style={styles.professionalTitle}>
            {item?.adviser?.professional_title}
          </Text>
          <Text numberOfLines={2} style={styles.aboutService}>
            {item?.data?.about_service}
          </Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.sessions}>
          0{' '}
          <Text
            style={{
              color: 'white',
            }}>
            Sessions
          </Text>
        </Text>
        <View style={styles.detailsRight}>
          <Text style={styles.price}>
            <Text style={styles.duration}>
              {convertMinutesToHours(item?.data?.duration)}
            </Text>
            {'  •  '}
            <Text style={styles.price}>₹{item?.data?.price}</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ServiceComponent;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF27',
    borderRadius: 16,
    backgroundColor: '#252525',
    flexDirection: 'column',
    gap: 12,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  providerName: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: 'white',
  },
  providerFollowers: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  providerRole: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  providerDescription: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding:10,
    // marginTop: -5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#353434DE',
    // opacity:0.4,
    borderRadius: 25,
  },
  sessions: {
    fontSize: RFValue(12),
    color: '#cf6679',
    fontFamily: 'Poppins-Medium',
  },
  detailsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceName: {
    color: 'white',
    fontSize: RFValue(16),
    fontFamily: 'Poppins-Medium',
    maxWidth: '85%',
  },
  offeredBy: {
    fontSize: RFValue(12),
    color: '#32CD32',
    marginBottom: -2,
    fontFamily: 'Poppins-Regular',
  },
  price: {
    fontSize: RFValue(13),
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  aboutService: {
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(11),
    color: '#FFFFFFB8',
    // maxWidth: Dimensions.get('window').width,
  },
  duration: {
    fontSize: RFValue(13),
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  durationValue: {
    fontFamily: 'Poppins-Regular',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adviserContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    maxWidth: '70%',
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  adviserInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  adviserName: {
    fontFamily: 'Poppins-Medium',
    color: 'white',
    fontSize: RFValue(14),
    lineHeight: 20,
  },
  professionalTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(11),
    lineHeight: 17,
    color: '#FFFFFF59',
  },
  viewDetailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#0069B4',
    borderRadius: 5,
  },
  viewDetailsText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});
