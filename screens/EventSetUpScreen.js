import React, {useState, useContext, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Pressable,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Button, Avatar} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BottomModal, ModalContent, SlideAnimation} from 'react-native-modals';
import axios from 'axios';
import {AuthContext} from '../AuthContext';

const EventSetUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userId} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [organizer, setOrganizer] = useState(null);
  const eventId = route?.params?.item?._id;

  useEffect(() => {
    fetchAttendees();
    fetchOrganizer();
    checkRequestStatus();
  }, []);

  useEffect(() => {
    const checkRequestStatus = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:8000/events/${eventId}/requests`,
        );
        const requestExists = response.data.some(
          request => request.userId === userId,
        );
        setIsRequestPending(requestExists);
      } catch (error) {
        console.error('Warning: Error checking request status:', error);
        Alert.alert('Error', 'Failed to check request status. Please try again later.');
      }
    };

    checkRequestStatus();
  }, [eventId, userId]);

  useEffect(() => {
    console.log('Organizer state:', organizer);
  }, [organizer]);

  const fetchAttendees = async () => {
    if (!eventId) return;
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/event/${eventId}/attendees`,
      );
      setAttendees(response.data);
    } catch (error) {
      console.error('Warning: Failed to fetch attendees:', error);
      Alert.alert('Error', 'Failed to fetch attendees. Please try again later.');
    }
  };

  const fetchOrganizer = async () => {
    if (!eventId) return;
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/event/${eventId}/organizer`,
      );
      setOrganizer(response.data);
    } catch (error) {
      console.error('Warning: Failed to fetch organizer:', error);
      Alert.alert('Error', 'Failed to fetch organizer. Please try again later.');
    }
  };

  const checkRequestStatus = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/getrequests/${userId}`,
      );
      const requests = response.data;
      const pending = requests.some(
        req => req.eventId === eventId && req.status === 'pending',
      );
      setIsRequestPending(pending);
    } catch (error) {
      console.error('Error checking request status:', error);
      Alert.alert('Error', 'Failed to check request status. Please try again later.');
    }
  };

  const sendJoinRequest = async () => {
    try {
      if (!eventId || !userId) {
        Alert.alert('Error', 'Event or user ID is missing.');
        return;
      }

      const response = await axios.post(
        `http://10.0.2.2:8000/events/${eventId}/request`,
        {userId, comment},
      );

      if (response.status === 200) {
        Alert.alert('Request Sent', 'Please wait for the host to accept!', [
          {text: 'OK', onPress: () => setModalVisible(false)},
        ]);
        setIsRequestPending(true);
      }
    } catch (error) {
      console.error(
        'Warning: Failed to send request:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert('Error', 'Failed to send request. Please try again later.');
    }
  };

  const cancelJoinRequest = async eventId => {
    try {
      const response = await axios.post(
        `http://10.0.2.2:8000/events/${eventId}/cancel-request`,
        {userId},
      );

      if (response.status === 200) {
        Alert.alert(
          'Request Cancelled',
          'Your join request has been cancelled.',
          [{text: 'OK', onPress: () => setIsRequestPending(false)}],
        );
      }
    } catch (error) {
      console.error('Warning: Failed to cancel request:', error);
      Alert.alert('Error', 'Failed to cancel request. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <Image
          source={{
            uri:
              route?.params?.item?.image ||
              'https://via.placeholder.com/600x300',
          }}
          style={{width: '100%', height: 300}}
        />
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
            gap: 15,
          }}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
          <Entypo name="share" size={24} color="#fff" />
        </View>

        <View style={{padding: 16}}>
          <Text style={{fontSize: 24, fontWeight: 'bold', color: '#333'}}>
            {route?.params?.item?.title || 'National Music Festival'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Button
              title="Music"
              type="outline"
              buttonStyle={{
                borderColor: '#5c6bc0',
                borderRadius: 20,
                paddingHorizontal: 10,
              }}
              titleStyle={{color: '#5c6bc0'}}
            />
            <View
              style={{
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {attendees.slice(0, 4).map((attendee, index) => (
                <Avatar
                  key={index}
                  size={30}
                  rounded
                  source={{
                    uri: attendee.imageUrl || 'https://via.placeholder.com/150',
                  }}
                  containerStyle={{marginLeft: index === 0 ? 0 : -10}}
                />
              ))}
              <Text style={{marginLeft: 10, color: '#333'}}>
                {attendees.length}+ going
              </Text>
            </View>
          </View>

          <Button
            title="Add to My Calendar"
            buttonStyle={{backgroundColor: '#5c6bc0', borderRadius: 10}}
            containerStyle={{marginVertical: 10}}
          />

          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <MaterialIcons name="location-on" size={24} color="#5c6bc0" />
            <View style={{marginLeft: 10}}>
              <Text style={{fontWeight: 'bold', color: '#333'}}>
                {route?.params?.item?.location ||
                  'Grand Park, New York City, US'}
              </Text>
              <Text style={{color: '#666'}}>
                Grand City St. 100, New York, United States.
              </Text>
            </View>
          </View>

          <Button
            title="See Location on Maps"
            buttonStyle={{backgroundColor: '#5c6bc0', borderRadius: 10}}
            containerStyle={{marginBottom: 20}}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <MaterialIcons name="attach-money" size={24} color="#5c6bc0" />
            <Text style={{marginLeft: 10, fontWeight: 'bold', color: '#333'}}>
              $20.00 - $100.00
            </Text>
          </View>
          <Text style={{color: '#666', marginBottom: 20}}>
            Ticket price depends on package.
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar
              size={60}
              rounded
              source={{
                uri: organizer?.image || 'https://via.placeholder.com/150',
              }}
            />
            <View style={{marginLeft: 10}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {`${organizer?.firstName || ''} ${organizer?.lastName || ''}`}
              </Text>
              <Text style={{color: 'gray'}}>Organizer</Text>
            </View>
            <Button
              title="Follow"
              buttonStyle={{backgroundColor: '#5c6bc0', borderRadius: 10}}
              containerStyle={{marginLeft: 'auto'}}
            />
          </View>

          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>
            About Event
          </Text>
          <Text style={{color: '#666', marginTop: 10}}>
            {route?.params?.item?.description ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'}
          </Text>
          <Pressable>
            <Text style={{color: '#5c6bc0', marginTop: 5}}>Read more...</Text>
          </Pressable>

          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>
            Gallery (Pre-Event)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              'https://via.placeholder.com/150',
              'https://via.placeholder.com/150',
              'https://via.placeholder.com/150',
            ].map((img, index) => (
              <Image
                key={index}
                source={{uri: img}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  marginRight: 10,
                  marginTop: 10,
                }}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {isRequestPending ? (
        <TouchableOpacity
          onPress={() => cancelJoinRequest(eventId)}
          style={{
            backgroundColor: 'red',
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
            Cancel Request
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => sendJoinRequest(eventId, 'I want to join!')}
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
      )}

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
    </SafeAreaView>
  );
};

export default EventSetUpScreen;
