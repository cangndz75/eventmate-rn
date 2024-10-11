import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../../AuthContext';
import UpComingEvent from '../../components/UpComingEvent';

const AdminEventScreen = () => {
  const [option, setOption] = useState('My Events');
  const {userId, user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/events');
      setEvents(response.data);
    } catch (error) {
      console.log('Error fetching events:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUpcomingEvents();
    }
  }, [userId]);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/upcoming?userId=${userId}`,
      );
      setUpcomingEvents(response.data);
    } catch (error) {
      console.log('Error fetching upcoming events:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f0f0f5'}}>
      <ScrollView>
        <View style={{padding: 12, backgroundColor: '#7b61ff'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                Can Gündüz
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="white"
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="chatbox-outline" size={24} color="white" />
              <Ionicons name="notifications-outline" size={24} color="white" />
              <Image
                style={{width: 30, height: 30, borderRadius: 15}}
                source={{uri: user?.image || 'https://via.placeholder.com/150'}}
              />
            </View>
          </View>
          <View style={{marginTop: 15}}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 10,
                alignItems: 'center',
              }}>
              <Ionicons name="search-outline" size={20} color="gray" />
              <Text style={{color: 'gray', marginLeft: 10, fontSize: 16}}>
                Search events
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginVertical: 20}}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Sports', 'Music', 'Food'].map((category, index) => (
                <Pressable
                  key={index}
                  style={{
                    backgroundColor: '#ff6b6b',
                    borderRadius: 20,
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    marginRight: 10,
                  }}>
                  <Text style={{color: 'white', fontWeight: '600'}}>
                    {category}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Create')}
          style={{
            backgroundColor: '#07bc0c',
            padding: 12,
            margin: 10,
            borderRadius: 4,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 15,
              fontWeight: '500',
            }}>
            Create Event
          </Text>
        </Pressable>
        <View style={{padding: 12}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, fontWeight: '700', color: '#333'}}>
              Upcoming Events
            </Text>
            <Pressable>
              <Text style={{color: '#ff6b6b', fontWeight: '600'}}>See All</Text>
            </Pressable>
          </View>
          <FlatList
            horizontal
            data={upcomingEvents}
            renderItem={({item}) => <UpComingEvent item={item} />}
            keyExtractor={item => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingVertical: 10}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminEventScreen;
