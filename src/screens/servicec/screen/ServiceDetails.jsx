import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Image } from 'react-native';
const ServiceDetails = () => {
    const route = useRoute();
    const {details}= route.params;

    console.log(details);

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
          headerRight:()=>(
            <TouchableOpacity style={{
                marginRight:16,
            }}>
                <Icon name='share-2' size={18} color='white'/>
            </TouchableOpacity>
          )
        });
      }, [navigation]);
  return (
    <View style={{
        flex:1,
        backgroundColor:'#17191A'
    }}>
      <View style={{
        paddingHorizontal:16,
      }}>
        <Image source={require('../../../assets/images/profiles.png')}/>
      </View>
    </View>
  )
}

export default ServiceDetails;

const styles = StyleSheet.create({})