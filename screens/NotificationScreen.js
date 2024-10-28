import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {AuthContext} from '../AuthContext';
import axios from 'axios';
import moment from 'moment';

const NotificationScreen = () => {
  const {userId} = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `https://biletixai.onrender.com/user/${userId}/notifications`,
        );
        if (response.status === 200 && response.data.notifications) {
          setNotifications(response.data.notifications);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleAccept = async notificationId => {
    try {
      await axios.post(
        `https://biletixai.onrender.com/notifications/${notificationId}/accept`,
      );
      setNotifications(prev =>
        prev.filter(notification => notification._id !== notificationId),
      );
    } catch (error) {
      console.error('Error accepting notification:', error);
    }
  };

  const handleReject = async notificationId => {
    try {
      await axios.post(
        `https://biletixai.onrender.com/notifications/${notificationId}/reject`,
      );
      setNotifications(prev =>
        prev.filter(notification => notification._id !== notificationId),
      );
    } catch (error) {
      console.error('Error rejecting notification:', error);
    }
  };

  const renderNotification = ({item}) => (
    <View style={styles.notificationContainer}>
      <Image source={{uri: item.from.image}} style={styles.profileImage} />
      <View style={{flex: 1, marginLeft: 10}}>
        <Text style={styles.userName}>
          {item.from.firstName} {item.from.lastName}
        </Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.timeAgo}>{moment(item.createdAt).fromNow()}</Text>
      </View>
      {item.type === 'invite' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleReject(item._id)}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAccept(item._id)}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No notifications yet!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#007bff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});
