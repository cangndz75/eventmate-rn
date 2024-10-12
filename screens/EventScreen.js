import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import UpComingEvent from '../components/UpComingEvent';

const EventScreen = () => {
  const {userId, role, user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchEvents();
  }, [userId, role]);

  const fetchEvents = async () => {
    try {
      let url = 'http://10.0.2.2:8000/events';
      if (role === 'organizer') {
        url += `?organizerId=${userId}&role=organizer`;
      }
      const response = await axios.get(url);
      setEvents(response.data);
    } catch (error) {
      console.log('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#07bc0c" />
      </View>
    );
  }

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
                {user?.firstName || 'User'}
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

        <View style={{padding: 12}}>
          <Text style={{fontSize: 16, fontWeight: '700', color: '#333'}}>
            {role === 'organizer' ? 'My Events' : 'All Events'}
          </Text>

          <FlatList
            data={events}
            renderItem={({item}) => <UpComingEvent item={item} />}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingVertical: 10}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventScreen;
