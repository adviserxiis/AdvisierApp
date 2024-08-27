import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Modal,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {storeData} from '../../utils/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from '@react-native-firebase/storage';
const interestsList = [
  'Actor',
  'Artist',
  'Athlete',
  'Author',
  'Blogger',
  'Chef',
  'Coach',
  'Comedian',
  'Content Creator',
  'Dancer',
  'Designer ',
  'Digital Creator',
  'Director',
  'Educator',
  'Entrepreneur',
  'Fitness Trainer',
  'Gamer',
  'Graphic Designer',
  'Influencer',
  'Makeup Artist',
  'Model',
  'Musician/Band',
  'Photographer',
  'Public Figure',
  'Speaker',
  'Stylist',
  'Tattoo Artist',
  'Travel Blogger',
  'Videographer',
  'Writer',
];

const linkLogos = {
  Instagram: require('../../../assets/images/instagram.png'),
  Spotify: require('../../../assets/images/spotify.png'),
};

const UpdateProfile = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [interests, setInterests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState([]);
  const [linkInput, setLinkInput] = useState('');
  const [modalLinkVisible, setModalLinkVisible] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userid = useSelector(state => state.user.userid);

  const convertToSocialLinks = (linksArray:any) => {
    console.log('linksArray:', linksArray);
  
    // Check if linksArray is actually an array
    if (!Array.isArray(linksArray)) {
      console.error('Expected an array but received:', typeof linksArray);
      return {};
    }
  
    return linksArray.reduce((acc, link) => {
      if (
        link &&
        typeof link.type === 'string' &&
        typeof link.url === 'string'
      ) {
        acc[link.type.toLowerCase()] = link.url;
      } else {
        console.warn('Invalid link object:', link);
      }
      return acc;
    }, {});
  };

  // const uploadSingleImage = async (file) => {
  //   // const storage = getStorage();
    
  //   // Generate a unique filename using timestamp and a random number
  //   const uniqueFilename = `images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  //   const imageRef = sRef(storage, uniqueFilename);
  
  //   try {
  //     // Upload the image to Firebase Storage
  //     const snapshot = await uploadBytes(imageRef, file);
      
  //     // Get the download URL for the uploaded image
  //     const downloadURL = await getDownloadURL(snapshot.ref);
  //     console.log('Image URL:', downloadURL);
  
  //     // Return the download URL
  //     return downloadURL;
  //   } catch (error) {
  //     console.error('Error uploading image:', error.message || error);
  //     throw error;
  //   }
  // };


  

  // const linksArray = [
  //   { type: 'Facebook', url: 'https://facebook.com/user' },
  //   { type: 'Twitter', url: 'https://twitter.com/user' }
  // ];
  
  // console.log('Input data:', linksArray);
  

  const loadProfileData = async () => {
    try {
      console.log("shsjd")
      console.log(userid)
      const storedProfileData = await AsyncStorage.getItem('user');
      if (storedProfileData) {
        console.log("hie",storedProfileData);
        const profileData = JSON.parse(storedProfileData);
        console.log("hfd",profileData.name)
        setName(profileData.name || '');
        setTitle(profileData.professional_title || '');
        setDescription(profileData.discription || '');
        setInterests(profileData.interests || []);
        setLinks(profileData.social_links || []);
        setProfileImage(profileData.profile_photo || null);
        setBannerImage(profileData.profile_background || null);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  };
  useEffect(() => {

    loadProfileData();
  }, []);

  // console.log('Current user ID:', userid);

  const handleSaveDetails = async () => {
    setIsLoading(true);
    const formData = new FormData();
    console.log('Links:', links);
  
    let social;
  
    // Check if links is an array or an object
    if (Array.isArray(links)) {
      social = convertToSocialLinks(links);
    } else if (typeof links === 'object' && links !== null) {
      social = links;
    } else {
      console.error('Unexpected type for links:', typeof links);
      social = {};
    }
  
    console.log('Social:', social);
  
    // Validation check
    if (!name || !title || !description || !interests) {
      Alert.alert('Validation Error', 'Please fill all the fields');
      setIsLoading(false);
      return; // Stop execution if validation fails
    }
  
    // Append images to formData if they exist
    if (profileImage) {
      // const profileImageUrl = uploadSingleImage(profileImage)
      // console.log("Profile IMage Url",profileImageUrl)
      formData.append('profile_photo', {
        uri: Platform.OS === 'android' ? `file://${profileImage}` : profileImage,
        name: 'profile_photo.jpg',
        type: 'image/jpeg',
      });
    }
  
    if (bannerImage) {
      // const bannerImageUrl = uploadSingleImage(bannerImage);
      // console.log("Profile IMage Url",bannerImageUrl);
      formData.append('profile_background', {
        uri: Platform.OS === 'android' ? `file://${bannerImage}` : bannerImage,
        name: 'profile_background.jpg',
        type: 'image/jpeg',
      });
    }
  
    // Append other form fields
    formData.append('userid', userid);
    formData.append('data', JSON.stringify({
      name,
      professional_title: title,
      discription: description,
      interests,
      social_links: social,
    }));
  
    try {
      console.log('FormData:', formData);
  
      const response = await fetch(
        'https://adviserxiis-backend.onrender.com/creator/savedetails',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const jsonResponse = await response.json();
      console.log('Response:', jsonResponse);
  
      if (response.ok) {
        // Save user details to AsyncStorage
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({
            name,
            professional_title: title,
            discription: description,
            interests,
            social_links: social,
            profile_photo: profileImage,
            profile_background: bannerImage,
            userid: userid,
          })
        );
        loadProfileData();
        navigation.navigate('profile');
        // navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        Alert.alert('Error', jsonResponse.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      Alert.alert('Error', 'Failed to save details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 420,
      height: 165,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        setBannerImage(image.path);
        console.log(image.path);
      })
      .catch(error => {
        if (error.message !== 'User cancelled image selection') {
          console.log('ImagePicker Error: ', error.message);
        }
      });
  };

  const pickProfileImage = () => {
    ImagePicker.openPicker({
      width: 90,
      height: 90,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        setProfileImage(image.path);
        console.log('Profile Image Path:', image.path);
      })
      .catch(error => {
        if (error.message !== 'User cancelled image selection') {
          console.log('ImagePicker Error: ', error.message);
        }
      });
  };

  const toggleInterest = interest => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(item => item !== interest));
    } else if (interests.length < 5) {
      setInterests([...interests, interest]);
    }
  };

  const saveInterests = () => {
    setModalVisible(false);
  };
  const addLink = () => {
    if (selectedLink && linkInput[selectedLink]?.trim()) {
      const updatedLinks = Array.isArray(links)
        ? links.map(link =>
            link.type === selectedLink
              ? {type: selectedLink, url: linkInput[selectedLink].trim()}
              : link,
          )
        : [];

      // Ensure `links` is an array before spreading it
      const newLinks =
        Array.isArray(updatedLinks) &&
        updatedLinks.some(link => link.type === selectedLink)
          ? updatedLinks
          : [
              ...(Array.isArray(links) ? links : []),
              {type: selectedLink, url: linkInput[selectedLink].trim()},
            ];

      setLinks(newLinks);
      setLinkInput(prevState => ({
        ...prevState,
        [selectedLink]: '',
      }));
      setSelectedLink(null);
      setModalLinkVisible(false);
    }
  };

  const saveLink = () => {
    addLink();
    setModalLinkVisible(false);
  };

  const editLink = link => {
    setSelectedLink(link.type);
    setLinkInput(link.url);
    setModalLinkVisible(true);
  };

  const removeLink = link => {
    setLinks(links.filter(item => item !== link));
  };

  return (
    <>
      <Modal visible={isLoading} transparent={true}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </Modal>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor="#17191A" />
        <View style={styles.bannerContainer}>
          {bannerImage && (
            <Image
              source={{uri: bannerImage}}
              style={styles.bannerImage}
              resizeMode="contain"
            />
          )}
          {bannerImage && (
            <Pressable
              onPress={pickImage}
              style={styles.bannerEditIconContainer}>
              <Image
                source={require('../../../assets/images/pen.png')}
                style={styles.editIcon}
              />
            </Pressable>
          )}
          {!bannerImage && (
            <Pressable onPress={pickImage} style={styles.uploadButton}>
              <Text style={styles.uploadText}>Upload banner</Text>
            </Pressable>
          )}
        </View>

        <View
          style={{
            height: 90,
            width: 90,
            backgroundColor: 'white',
            position: 'absolute',
            top: 110,
            borderWidth: 3,
            borderRadius: 50,
            borderColor: '#17191A',
            left: '50%',
            marginLeft: -45,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {profileImage && (
            <Image
              source={{uri: profileImage}}
              style={styles.profileImage}
              resizeMode="cover"
            />
          )}
          <Pressable
            onPress={pickProfileImage}
            style={{
              padding: 5,
              backgroundColor: 'black',
              borderRadius: 50,
              position: 'absolute',
              right: 0,
              top: 55,
              borderColor: 'white',
              borderWidth: 1,
            }}>
            <Image
              source={require('../../../assets/images/pen.png')}
              alt="upload"
              style={{
                height: 10,
                width: 10,
              }}
            />
          </Pressable>
        </View>

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            marginTop: 100,
            flexDirection: 'column',
            gap: 20,
          }}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={{
              height: 44,
              backgroundColor: '#3A3B3C',
              color: 'white',
              paddingLeft: 10,
              borderRadius: 10,
            }}
          />
          <TextInput
            placeholder="Ex. Software Developer"
            value={title}
            onChangeText={setTitle}
            style={{
              height: 44,
              backgroundColor: '#3A3B3C',
              color: 'white',
              paddingLeft: 10,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              marginTop: -10,
            }}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-Regular',
                color: 'white',
                opacity: 0.5,
                textAlign: 'right',
              }}>
              {description.length}/60
            </Text>
            <TextInput
              placeholder="Description"
              // multiline={true}
              // numberOfLines={4}
              maxLength={60}
              value={description}
              onChangeText={setDescription}
              style={{
                height: 44,
                backgroundColor: '#3A3B3C',
                color: 'white',
                paddingLeft: 10,
                borderRadius: 10,
              }}
            />
          </View>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={{
              marginTop: -10,
            }}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-Regular',
                color: 'white',
                opacity: 0.5,
                textAlign: 'right',
              }}>
              max 5
            </Text>
            <TextInput
              placeholder="Choose your interested in"
              editable={false}
              multiline={false}
              numberOfLines={4}
              value={interests.join(', ').substring(0, 44)}
              style={{
                height: 44,
                backgroundColor: '#3A3B3C',
                color: 'white',
                paddingLeft: 10,
                borderRadius: 10,
                textAlignVertical: 'top',
                fontSize: 14,
              }}
            />
            <Image
              source={require('../../../assets/images/arrow.png')}
              style={{
                width: 12,
                height: 12,
                resizeMode: 'contain',
                position: 'absolute',
                right: 15,
                top: 33,
              }}
            />
          </Pressable>
          <Pressable onPress={() => setModalLinkVisible(true)}>
            <TextInput
              placeholder="Add your important links"
              editable={false}
              multiline={false}
              numberOfLines={4}
              value={
                Array.isArray(links)
                  ? links.map(link => link.type).join(', ')
                  : ''
              }
              style={{
                height: 44,
                backgroundColor: '#3A3B3C',
                color: 'white',
                paddingLeft: 10,
                borderRadius: 10,
                textAlignVertical: 'top',
                fontSize: 14,
              }}
            />
            <Image
              source={require('../../../assets/images/arrow.png')}
              style={{
                width: 12,
                height: 12,
                resizeMode: 'contain',
                position: 'absolute',
                right: 15,
                top: 15,
              }}
            />
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              paddingHorizontal: 5,
              marginTop: 30,
            }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Back</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSaveDetails}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  fontFamily: 'Poppins-Bold',
                }}>
                Select any 5
              </Text>
              <FlatList
                data={interestsList}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.interestItem,
                      interests.includes(item) && styles.selectedInterestItem,
                    ]}
                    onPress={() => toggleInterest(item)}>
                    <Text style={styles.interestText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
                paddingHorizontal: 23,
                marginTop: 10,
              }}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Back</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={saveInterests}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalLinkVisible}
          onRequestClose={() => {
            setModalLinkVisible(false);
            setSelectedLink(null);
            setLinkInput({});
          }}>
          <View style={styles.modalContainers}>
            <View
              style={{
                marginTop: 20,
                width: '90%',
              }}>
              <FlatList
                data={Object.keys(linkLogos)}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.linkTypeButton,
                      selectedLink === item && styles.selectedLinkLogoItem,
                    ]}
                    onPress={() => {
                      setSelectedLink(item);
                      setLinkInput(prevState => ({
                        ...prevState,
                        [item]: linkInput[item] || '',
                      }));
                    }}>
                    <Image
                      source={linkLogos[item]}
                      style={{
                        width: 40,
                        height: 40,
                        alignSelf: 'center',
                      }}
                    />
                    <View
                      style={{
                        marginLeft: 10,
                        flex: 1,
                      }}>
                      <Text style={styles.linkTypeText}>{item}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}>
                        <TextInput
                          placeholder="www.example.com"
                          placeholderTextColor="#3A3B3C"
                          value={linkInput[item] || ''}
                          onChangeText={text =>
                            setLinkInput(prevState => ({
                              ...prevState,
                              [item]: text,
                            }))
                          }
                          style={{
                            flex: 1,
                            backgroundColor: '#F5F5F5',
                            height: 35,
                            fontSize: 12,
                            color: 'black',
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            marginRight: 10,
                            textTransform: 'lowercase',
                          }}
                        />
                        <Pressable
                          style={{
                            padding: 5,
                            backgroundColor: 'black',
                            borderRadius: 50,
                            borderWidth: 1,
                            borderColor: 'white',
                          }}>
                          <Image
                            source={require('../../../assets/images/pen.png')}
                            style={{
                              width: 10,
                              height: 10,
                            }}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                flex: 1,
                paddingHorizontal: 23,
                marginBottom: 50,
              }}>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setModalLinkVisible(false);
                  setSelectedLink(null);
                  setLinkInput({});
                }}>
                <Text style={styles.closeButtonText}>Back</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={saveLink}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  bannerContainer: {
    height: 140,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  uploadText: {
    fontFamily: 'Poppins-Regular',
    textDecorationLine: 'underline',
    fontSize: 12,
    color: '#0069B4',
    marginBottom: 10,
    position: 'absolute',
    right: 15,
    bottom: 0,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  linkInputContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  linkInput: {
    height: 44,
    backgroundColor: '#3A3B3C',
    color: 'white',
    paddingLeft: 10,
    borderRadius: 10,
    fontSize: 14,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  linkLogo: {
    width: 30,
    height: 30,
  },
  bannerEditIconContainer: {
    position: 'absolute',
    right: 15,
    bottom: 10,
    padding: 5,
    backgroundColor: 'black',
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 1,
  },

  uploadButton: {
    position: 'absolute',
    right: 15,
  },
  editIcon: {
    height: 10,
    width: 10,
  },
  linkLogoItem: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#27282A',
    marginHorizontal: 5,
  },
  selectedLinkLogoItem: {
    backgroundColor: '#1B74E4',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainers: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#17191A',
    opacity: 0.9,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#3A3B3C',
    borderRadius: 10,
    height: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  interestItem: {
    paddingVertical: 2,
  },
  selectedInterestItem: {
    backgroundColor: '#0069B4',
    borderRadius: 10,
    padding: 10,
  },
  interestText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  closeButton: {
    padding: 10,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
    borderColor: '#0069B4',
    borderWidth: 1,
  },
  closeButtonText: {
    color: '#0069B4',
    fontFamily: 'Poppins-Regular',
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  saveButton: {
    backgroundColor: '#0069B4',
    padding: 10,
    alignItems: 'center',
    width: '50%',
    borderRadius: 10,
  },
  linkTypeButton: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#3A3B3C',
    alignContent: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    borderRadius: 10,
  },
  linkTypeText: {
    color: 'white',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
});
