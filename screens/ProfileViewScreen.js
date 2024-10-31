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
import {useRoute} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';

const ProfileViewScreen = () => {
  const route = useRoute();
  const {userId} = route.params; // Profile being viewed
  const {userId: loggedInUserId} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('About');

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `https://biletixai.onrender.com/user/${userId}`,
      );
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleFollowRequest = async () => {
    if (!userData) {
      Alert.alert('Error', 'User data not loaded yet.');
      return;
    }

    try {
      const response = await axios.post(
        `https://biletixai.onrender.com/user/followRequest`,
        {
          fromUserId: loggedInUserId,
          toUserId: userId,
          fromFirstName: userData.firstName,
          fromLastName: userData.lastName,
          fromImage: userData.image,
        },
      );

      if (response.status === 200) {
        Alert.alert('Request Sent', 'Follow request sent successfully!');
      }
    } catch (error) {
      console.error('Error sending follow request:', error);
      Alert.alert('Error', 'Failed to send follow request.');
    }
  };

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

      {userId !== loggedInUserId && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.followButton}
            onPress={handleFollowRequest}>
            <Text style={styles.followButtonText}>+ Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageButtonText}>Messages</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={selectedTab === 'About' ? styles.activeTab : styles.tab}
          onPress={() => setSelectedTab('About')}>
          <Text style={styles.tabText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedTab === 'Event' ? styles.activeTab : styles.tab}
          onPress={() => setSelectedTab('Event')}>
          <Text style={styles.tabText}>Event</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'About' ? (
        <View style={styles.aboutSection}>
          <Text>{userData.aboutMe || 'No information provided'}</Text>
        </View>
      ) : (
        <View style={styles.eventSection}>
          {userData.events && userData.events.length > 0 ? (
            userData.events.map(event => (
              <View key={event._id} style={styles.eventItem}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
              </View>
            ))
          ) : (
            <Text>No events to display.</Text>
          )}
        </View>
      )}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileViewScreen;
