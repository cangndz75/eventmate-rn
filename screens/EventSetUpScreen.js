import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  FlatList,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import {BottomModal, ModalContent, SlideAnimation} from 'react-native-modals';
import axios from 'axios';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventSetUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userId} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState('none');
  const [comment, setComment] = useState('');
  const {item} = route.params;
  const eventId = item?._id;

  useEffect(() => {
    const fetchUserAndEventDetails = async () => {
      try {
        const userResponse = await axios.get(
          `https://eventmate-rn.onrender.com//user/${userId}`,
        );
        console.log('User data:', userResponse.data);

        if (item) {
          await fetchEventDetails();
        } else {
          Alert.alert('Error', 'No event data found.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching user or event details:', error);
      }
    };

    fetchUserAndEventDetails().finally(() => setLoading(false));
  }, [item]);

  const fetchEventDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Fetched token:', token);

      if (!token) throw new Error('Authentication token is missing');

      const response = await axios.get(
        `https://eventmate-rn.onrender.com//events/${eventId}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );

      console.log('Event data:', response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      const errorMessage =
        error.response?.data?.message === 'Internal server error'
          ? 'Server encountered an issue. Please try again later.'
          : error.response?.data?.message || 'Error fetching event details.';
      Alert.alert('Error', errorMessage);
    }
  };

  const checkRequestStatus = async () => {
    try {
      const response = await axios.get(
        `https://eventmate-rn.onrender.com//events/${eventId}/requests`,
      );
      const userRequest = response.data.find(req => req.userId === userId);
      setRequestStatus(userRequest ? userRequest.status : 'none');
    } catch (error) {
      console.error(
        'Error fetching requests:',
        error.response ? error.response.data : error.message,
      );
      ToastAndroid.show('Failed to check request status.', ToastAndroid.SHORT);
    }
  };

  const renderOrganizerName = () => {
    const organizer = item.organizer;
    return organizer
      ? `${organizer.firstName || ''} ${organizer.lastName || ''}`.trim()
      : 'Unknown Organizer';
  };

  const sendJoinRequest = async () => {
    try {
      await axios.post(`http://10.0.2.2:8000/events/${eventId}/request`, {
        userId,
        comment,
      });
      setRequestStatus('pending');
      setModalVisible(false);
      Alert.alert('Request Sent', 'Your join request is pending approval.');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send request.',
      );
    }
  };
  const cancelJoinRequest = async () => {
    try {
      await axios.post(
        `http://10.0.2.2:8000/events/${eventId}/cancel-request`,
        {userId},
      );
      setRequestStatus('none');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel request.');
    }
  };

  const renderGoingSection = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EventAttendees', {eventId})}>
      <FlatList
        horizontal
        data={item.attendees}
        keyExtractor={(attendee, index) => attendee._id + index}
        renderItem={({item: attendee}) => (
          <Image
            source={{uri: attendee.image || 'https://via.placeholder.com/50'}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginHorizontal: 5,
            }}
          />
        )}
        contentContainerStyle={{marginVertical: 10}}
      />
    </TouchableOpacity>
  );

  

  const renderActionButton = () => {
    switch (requestStatus) {
      case 'none':
        return (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              backgroundColor: 'green',
              padding: 15,
              margin: 10,
              borderRadius: 4,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 15,
                fontWeight: '500',
              }}>
              Join Event
            </Text>
          </TouchableOpacity>
        );
      case 'pending':
        return (
          <View style={{flexDirection: 'row', margin: 10}}>
            <TouchableOpacity
              style={{
                backgroundColor: 'gray',
                padding: 15,
                flex: 1,
                marginRight: 5,
                borderRadius: 4,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: '500',
                }}>
                Pending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancelJoinRequest}
              style={{
                backgroundColor: 'red',
                padding: 15,
                flex: 1,
                marginLeft: 5,
                borderRadius: 4,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: '500',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 'accepted':
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate('ViewTicket', {eventId})}
            style={{
              backgroundColor: 'blue',
              padding: 15,
              margin: 10,
              borderRadius: 4,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 15,
                fontWeight: '500',
              }}>
              View Ticket
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Event...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <View style={{position: 'relative'}}>
          <Image
            source={{
              uri: item?.images?.[0] || 'https://via.placeholder.com/600x300',
            }}
            style={{width: '100%', height: 300, resizeMode: 'cover'}}
          />
          <Text
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              padding: 5,
              borderRadius: 5,
            }}>
            {item.time}
          </Text>
        </View>
        <View style={{position: 'absolute', top: 20, left: 20}}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
            onPress={() => navigation.goBack()}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Ionicons
            name="heart-outline"
            size={24}
            color="#fff"
            onPress={() => ToastAndroid.show('Favorited!', ToastAndroid.SHORT)}
          />
          <Ionicons
            name="search"
            size={24}
            color="#fff"
            onPress={() =>
              ToastAndroid.show('Search clicked!', ToastAndroid.SHORT)
            }
          />
        </View>

        <View style={{padding: 16}}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>
            {item?.title || 'Event Title'}
          </Text>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <MaterialIcons name="location-on" size={24} color="#5c6bc0" />
            <Text style={{marginLeft: 10}}>
              {item?.location || 'Event Location'}
            </Text>
          </View>

          <Text style={styles.organizerText}>
            Hosted by: {renderOrganizerName()}
          </Text>
          {renderGoingSection()}

          <Text style={{marginVertical: 10}}>
            {item?.description || 'Event Description'}
          </Text>




          {renderActionButton()}

          <BottomModal
            onBackdropPress={() => setModalVisible(false)}
            swipeDirection={['up', 'down']}
            swipeThreshold={200}
            modalAnimation={new SlideAnimation({slideFrom: 'bottom'})}
            visible={modalVisible}
            onTouchOutside={() => setModalVisible(false)}>
            <ModalContent
              style={{width: '100%', height: 400, backgroundColor: 'white'}}>
              <View>
                <Text style={{fontSize: 15, fontWeight: '500', color: 'gray'}}>
                  Join Event
                </Text>
                <Text style={{marginTop: 25, color: 'gray'}}>
                  Please enter a message to send with your join request.
                </Text>
                <View
                  style={{
                    borderColor: '#E0E0E0',
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10,
                    height: 200,
                    marginTop: 20,
                  }}>
                  <TextInput
                    value={comment}
                    onChangeText={text => setComment(text)}
                    placeholder="Send a message to the host along with your request!"
                    style={{height: 100, textAlignVertical: 'top'}}
                  />
                  <Pressable
                    onPress={sendJoinRequest}
                    style={{
                      marginTop: 'auto',
                      backgroundColor: 'green',
                      borderRadius: 5,
                      justifyContent: 'center',
                      padding: 10,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 15,
                        fontWeight: '500',
                      }}>
                      Send Request
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ModalContent>
          </BottomModal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventSetUpScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
});
