import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
} from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../AuthContext';
import axios from 'axios';
import {Modal, ModalContent, ModalFooter, ModalButton} from 'react-native-modals';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {userId, setToken, setUserId} = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View>
          <Text style={{marginLeft: 15, color: 'black'}}>Can Gündüz</Text>
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

  const popularEvent = {
    image:
      'https://images.pexels.com/photos/2247678/pexels-photo-2247678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'La Rosalía',
    date: 'Mon, Apr 18 - 21:00 PM',
    location: 'Palau Sant Jordi, Barcelona',
  };

  const eventList = [
    {
      id: '1',
      image:
        'https://images.pexels.com/photos/2247678/pexels-photo-2247678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'The Kooks',
      date: 'Thu, Apr 19 - 20:00 PM',
      location: 'Razzmatazz',
      isNew: true,
    },
    {
      id: '2',
      image:
        'https://images.pexels.com/photos/2247678/pexels-photo-2247678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'The Wombats',
      date: 'Fri, Apr 22 - 21:00 PM',
      location: 'Sala Apolo',
      isNew: false,
    },
    {
      id: '3',
      image:
        'https://images.pexels.com/photos/2247678/pexels-photo-2247678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Foster The People',
      date: 'Mon, Apr 25 - 17:30 PM',
      location: 'La Monumental',
      isNew: false,
    },
  ];

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

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    const response = await axios.get(`http://10.0.2.2:8000/user/${userId}`);
    setUser(response.data);
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#F8F8F8', padding: 10}}>
      {/* Popular in Barcelona section */}
      <View style={{padding: 13}}>
        <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 10}}>
          Popular in Barcelona
        </Text>
        <View
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
            source={{uri: popularEvent.image}}
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              paddingHorizontal: 5,
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
            }}>
            <Pressable>
              <Ionicons name="heart-outline" size={24} color="black" />
            </Pressable>
            <Pressable>
              <Ionicons name="share-outline" size={24} color="black" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Event List */}
      <View style={{padding: 13}}>
        {eventList.map((item) => (
          <View
            key={item.id}
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
              source={{uri: item.image}}
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
            </View>
            <Pressable style={{marginLeft: 'auto'}}>
              <Ionicons name="heart-outline" size={24} color="black" />
            </Pressable>
            <Pressable style={{marginLeft: 10}}>
              <Ionicons name="share-outline" size={24} color="black" />
            </Pressable>
          </View>
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
