import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getAdviserDetail, getAdviserPostDetail} from '../../api/adviser';

const data = [
  {id: '1', views: '4742'},
  {id: '2', views: '2373'},
  {id: '3', views: '2373'},
  {id: '4', views: '2373'},
];

const User = () => {
  const [details, setDetails] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    async function getDetails() {
      const res = await getAdviserDetail(
        '6825f3c0-45f0-11ef-9968-9dbd2bf34b00',
      );
      setDetails(res);
    }
    getDetails();

    async function getPostDetails() {
      const posts = await getAdviserPostDetail(
        '6825f3c0-45f0-11ef-9968-9dbd2bf34b00',
      );
      setPosts(posts);
    }
    getPostDetails();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileSection}>
        <Image
          style={styles.profileImage}
          source={{uri: 'https://via.placeholder.com/100'}}
        />
        <Text style={styles.profileTitle}>{details?.professional_title}</Text>
        <Text style={styles.profileDescription}>
          {details?.professional_bio.substring(0, 100) + '....'}
        </Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{details?.followers.length}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{posts?.length}</Text>
            <Text style={styles.statLabel}>Post</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>2.8K</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>FOLLOW</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.castingTitle}>Casting</Text>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.castingItem}>
            <Image
              style={styles.castingImage}
              source={{uri: 'https://via.placeholder.com/150'}}
            />
            <View style={styles.castingOverlay}>
              <Text style={styles.castingViews}>
                <Icon name="visibility" size={16} /> {item.views} views
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1C1C1E',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
  },
  moreButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  followButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  castingTitle: {
    fontSize: 18,
    color: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  castingItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  castingImage: {
    width: '100%',
    height: 150,
  },
  castingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  castingViews: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#1C1C1E',
  },
  footerButton: {
    alignItems: 'center',
  },
});

export default User;
