import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const ProfileViewScreen = () => {

  const {userId} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/user/${userId}`);
      setUserData(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#07bc0c" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loader}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{uri: userData.image || 'https://via.placeholder.com/100'}}
        style={styles.profileImage}
      />
      <Text
        style={
          styles.name
        }>{`${userData.firstName} ${userData.lastName}`}</Text>
      <Text style={styles.username}>@{userData.username}</Text>

      <View style={styles.stats}>
        <Text style={styles.statText}>
          {userData.following ? userData.following.length : 0} Following
        </Text>
        <Text style={styles.statText}>
          {userData.followers ? userData.followers.length : 0} Followers
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>+ Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>Messages</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <Text style={[styles.tab, styles.activeTab]}>About</Text>
        <Text style={styles.tab}>Event</Text>
        <Text style={styles.tab}>Reviews</Text>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutText}>
          Enjoy your favorite dish and a lovely time with your friends and
          family. Food from local food trucks will be available for purchase.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  followButton: {
    backgroundColor: '#4C9EEB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageButton: {
    borderColor: '#4C9EEB',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  messageButtonText: {
    color: '#4C9EEB',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  tab: {
    fontSize: 16,
    color: '#888',
  },
  activeTab: {
    color: '#4C9EEB',
    borderBottomWidth: 2,
    borderBottomColor: '#4C9EEB',
  },
  aboutSection: {
    width: '100%',
    paddingHorizontal: 20,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileViewScreen;
