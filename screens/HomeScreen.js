import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, ScrollView, Image, Pressable, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import {Modal, ModalContent, ModalFooter, ModalButton} from 'react-native-modals';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {userId, setToken, setUserId} = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventList, setEventList] = useState([]); // Tüm etkinlik listesi
  const [popularEvent, setPopularEvent] = useState(null); // Popüler etkinlik (liste başı)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="person-circle-outline" size={24} color="black" />
          <Text style={{marginLeft: 10, color: 'black'}}>Can Gündüz</Text>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginRight: 15,
          }}>
          <Ionicons name="chatbox-outline" size={24} color="black" />
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              style={{width: 30, height: 30, borderRadius: 15}}
              source={{
                uri: user?.user?.image || 'https://via.placeholder.com/150',
              }}
            />
          </Pressable>
        </View>
      ),
    });
  }, [user]);

  // Veritabanından kullanıcı bilgilerini çek
  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/user/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Veritabanından tüm etkinlik verisini çek
  const fetchEvents = async () => {
    try {
      const eventListResponse = await axios.get('http://10.0.2.2:8000/events');
      const events = eventListResponse.data;
      setEventList(events); // Tüm etkinlik listesini sakla

      // İlk etkinliği popüler etkinlik olarak ayarla
      if (events.length > 0) {
        setPopularEvent(events[0]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchEvents();  // Etkinlikleri çek
    }
  }, [userId]);

  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken('');
      setUserId('');
      navigation.replace('Start');
    } catch (error) {
      console.log('Error clearing auth token:', error);
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#F8F8F8', padding: 10}}>
      {/* Popüler etkinlik kısmı */}
      {popularEvent && (
        <View style={{padding: 13}}>
          <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 10}}>
            Popular in Barcelona
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Event', {item: popularEvent})} // Navigate to Event screen
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 3,
              padding: 10,
            }}>
            <ImageBackground
              source={{uri: popularEvent.organizerUrl}}
              style={{height: 200, borderRadius: 15, overflow: 'hidden'}}
              imageStyle={{borderRadius: 10}}>
              <View style={{padding: 10}}>
                <Text
                  style={{
                    color: 'white',
                    backgroundColor: 'green',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 5,
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    fontSize: 12,
                  }}>
                  New
                </Text>
              </View>
            </ImageBackground>
            <View style={{paddingVertical: 10}}>
              <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>
                {popularEvent.title}
              </Text>
              <Text style={{fontSize: 14, color: 'gray'}}>{popularEvent.date}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                <Ionicons name="location-outline" size={16} color="gray" />
                <Text style={{marginLeft: 4, color: 'gray', fontSize: 12}}>
                  {popularEvent.location}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
              <Image
                source={{uri: popularEvent.organizerUrl}}
                style={{width: 30, height: 30, borderRadius: 15}}
              />
              <Text style={{marginLeft: 10, color: 'gray'}}>
                {popularEvent.attendees?.length} Going
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      {/* Etkinlik Listesi */}
      <View style={{padding: 13}}>
        {eventList.slice(1).map((item) => (
          <Pressable
            key={item._id}
            onPress={() => navigation.navigate('Event', {item})} // Navigate to Event screen
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              marginBottom: 10,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 3,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: item.organizerUrl}}
              style={{width: 60, height: 60, borderRadius: 12}}
            />
            <View style={{flex: 1, marginLeft: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>
                  {item.title}
                </Text>
                {item.isNew && (
                  <Text
                    style={{
                      color: 'white',
                      backgroundColor: 'green',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 5,
                      fontSize: 10,
                      marginLeft: 5,
                    }}>
                    New
                  </Text>
                )}
              </View>
              <Text style={{fontSize: 14, color: 'gray'}}>{item.date}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                <Ionicons name="location-outline" size={16} color="gray" />
                <Text style={{marginLeft: 4, color: 'gray', fontSize: 12}}>
                  {item.location}
                </Text>
              </View>
              {/* Going section */}
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                {item?.attendees?.slice(0, 3).map((attendee) => (
                  <Image
                    key={attendee?._id}
                    source={{uri: attendee?.imageUrl}}
                    style={{width: 30, height: 30, borderRadius: 15, marginLeft: -7}}
                  />
                ))}
                <Text style={{marginLeft: 10, color: 'gray'}}>
                  {item.attendees?.length} Going
                </Text>
              </View>
            </View>
            <Pressable style={{marginLeft: 'auto'}}>
              <Ionicons name="heart-outline" size={24} color="black" />
            </Pressable>
            <Pressable style={{marginLeft: 10}}>
              <Ionicons name="share-outline" size={24} color="black" />
            </Pressable>
          </Pressable>
        ))}
      </View>

      <Modal
        visible={isModalVisible}
        onTouchOutside={() => setModalVisible(false)}
        footer={
          <ModalFooter>
            <ModalButton text="Cancel" onPress={() => setModalVisible(false)} />
            <ModalButton
              text="Logout"
              onPress={() => {
                clearAuthToken();
                setModalVisible(false);
              }}
            />
          </ModalFooter>
        }>
        <ModalContent>
          <Text>Are you sure you want to log out?</Text>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
};

export default HomeScreen;
