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
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventSetUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userId} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [organizer, setOrganizer] = useState(null);
  const [requestStatus, setRequestStatus] = useState('none');
  const eventId = route?.params?.item?._id;

  useEffect(() => {
    fetchAttendees();
    fetchOrganizer();
    checkRequestStatus();
  }, []);

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
      Alert.alert(
        'Error',
        'Failed to fetch attendees. Please try again later.',
      );
    }
  };

  const saveRequestStatus = async (status) => {
    try {
      await AsyncStorage.setItem(`requestStatus-${eventId}`, status);
    } catch (error) {
      console.error('Failed to save request status:', error);
    }
  };
  
  const loadRequestStatus = async () => {
    try {
      const status = await AsyncStorage.getItem(`requestStatus-${eventId}`);
      if (status) {
        setRequestStatus(status);
      }
    } catch (error) {
      console.error('Failed to load request status:', error);
    }
  };
  
  const checkRequestStatus = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/events/${eventId}/requests`
      );
      const request = response.data.find(req => req.userId === userId);
  
      if (request) {
        setRequestStatus(request.status);
      }
    } catch (error) {
      console.error('Error checking request status:', error);
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
      Alert.alert(
        'Error',
        'Failed to fetch organizer. Please try again later.',
      );
    }
  };

  const sendJoinRequest = async () => {
    try {
      await axios.post(`http://10.0.2.2:8000/events/${eventId}/request`, {
        userId,
        comment,
      });
      setRequestStatus('pending');
      await saveRequestStatus('pending');  
      setModalVisible(false);
      Alert.alert('Request Sent', 'Your join request is pending approval.');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send request.'
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
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 15, fontWeight: '500' }}>
              Join Event
            </Text>
          </TouchableOpacity>
        );
      case 'pending':
        return (
          <View style={{ flexDirection: 'row', margin: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'gray',
                padding: 15,
                flex: 1,
                marginRight: 5,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 15, fontWeight: '500' }}>
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
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 15, fontWeight: '500' }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 'accepted':
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate('ViewTicket', { eventId })}
            style={{
              backgroundColor: 'blue',
              padding: 15,
              margin: 10,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 15, fontWeight: '500' }}>
              View Ticket
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
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
    </SafeAreaView>
  );
};

export default EventSetUpScreen;
