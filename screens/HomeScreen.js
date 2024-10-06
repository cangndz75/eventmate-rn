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
import { Modal, ModalContent, ModalFooter, ModalButton } from 'react-native-modals';

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

  const data = [
    {
      id: '10',
      image:
        'https://images.pexels.com/photos/2247678/pexels-photo-2247678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      text: 'Test 1',
      description: 'Know more',
    },
    {
      id: '11',
      image:
        'https://images.pexels.com/photos/2247678/pexels-photo-2247678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      text: 'Test 2',
      description: 'Know more',
    },
    {
      id: '12',
      image:
        'https://images.pexels.com/photos/2247678/pexels-photo-2247678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      text: 'Test 3',
      description: 'Know more',
    },
  ];

  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken('');
      setUserId('');
      navigation.replace('Start');  // Login ekranına yönlendirme
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
      {/* Fit goal view */}
      <View
        style={{
          padding: 13,
          backgroundColor: 'white',
          margin: 15,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.25,
          shadowRadius: 2,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <Image
            style={{width: 40, height: 40, borderRadius: 25}}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/785/785116.png' || 'https://via.placeholder.com/150',
            }}
          />
        </View>
        <View>
          <View>
            <Text style={{color: 'black'}}>Set Your Weekly Fit Goal</Text>
            <Image
              style={{width: 20, height: 20, borderRadius: 10}}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/426/426833.png',
              }}
            />
          </View>
          <Text style={{marginTop: 8, color: 'gray'}}>Keep yourself fit</Text>
        </View>
      </View>

      {/* Calendar view */}
      <View
        style={{
          padding: 13,
          backgroundColor: 'white',
          marginVertical: 16,
          marginHorizontal: 13,
          borderRadius: 12,
        }}>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            backgroundColor: '#E0E0E0',
            borderRadius: 4,
            width: 200,
            marginVertical: 5,
          }}>
          <Text style={{color: '#484848', fontSize: 13}}>Deneme</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: '#484848', fontSize: 16}}>Deneme 2</Text>
          <Pressable
            style={{
              padding: 10,
              backgroundColor: 'white',
              borderRadius: 7,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              width: 80,
            }}>
            <Text style={{textAlign: 'center'}}>Deneme 3</Text>
          </Pressable>
        </View>
        <Text style={{marginTop: 4, color: 'gray'}}>
          You have no events today
        </Text>
        <Pressable
          style={{
            marginVertical: 15,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 5,
          }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              textDecorationLine: 'underline',
            }}>
            View My Calendar
          </Text>
        </Pressable>
      </View>

      {/* Spotlight section */}
      <View style={{padding: 13}}>
        <View style={{padding: 10, backgroundColor: 'white', borderRadius: 10}}>
          <Text style={{fontSize: 15, fontWeight: '500'}}>SpotLight</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data?.map((item) => (
              <ImageBackground
                key={item.id}
                imageStyle={{borderRadius: 10}}
                style={{
                  width: 220,
                  height: 280,
                  marginRight: 10,
                  marginVertical: 15,
                  resizeMode: 'contain',
                }}
                source={{uri: item?.image}} />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Logout Modal */}
      <Modal
        visible={isModalVisible}
        onTouchOutside={() => setModalVisible(false)}
        footer={
          <ModalFooter>
            <ModalButton
              text="Cancel"
              onPress={() => setModalVisible(false)}
            />
            <ModalButton
              text="Logout"
              onPress={() => {
                clearAuthToken();  // Logout işlemi
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
