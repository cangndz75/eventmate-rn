import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Event from '../components/Event';
import { AuthContext } from '../AuthContext';
import UpComingEvent from '../components/UpComingEvent';

const EventScreen = () => {
  const [option, setOption] = useState(isOrganizer ? 'My Events' : 'Calendar');
  const [event, setEvent] = useState('Concert');
  const { userId, isOrganizer, user } = useContext(AuthContext);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f5' }}>
      <ScrollView>
        {/* Header */}
        <View style={{ padding: 12, backgroundColor: '#7b61ff' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                Can Gündüz
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="chatbox-outline" size={24} color="white" />
              <Ionicons name="notifications-outline" size={24} color="white" />
              <Image
                style={{ width: 30, height: 30, borderRadius: 15 }}
                source={{
                  uri: user?.user?.image || 'https://via.placeholder.com/150',
                }}
              />
            </View>
          </View>

          {/* Search and Filters */}
          <View style={{ marginTop: 15 }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 10,
                alignItems: 'center',
              }}>
              <Ionicons name="search-outline" size={20} color="gray" />
              <Text style={{ color: 'gray', marginLeft: 10, fontSize: 16 }}>
                Search events
              </Text>
            </View>
          </View>

          {/* Filters */}
          <View style={{ flexDirection: 'row', marginVertical: 20 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Pressable
                style={{
                  backgroundColor: '#ff6b6b',
                  borderRadius: 20,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  marginRight: 10,
                }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Sports</Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: '#ffb86b',
                  borderRadius: 20,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  marginRight: 10,
                }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Music</Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: '#4cd137',
                  borderRadius: 20,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  marginRight: 10,
                }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Food</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
        {isOrganizer && (
        <Pressable
          onPress={() => navigation.navigate('Create')}
          style={{
            backgroundColor: '#07bc0c',
            marginTop: 'auto',
            marginBottom: 30,
            padding: 12,
            marginHorizontal: 10,
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
      )}

        {/* Event List */}
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>
              Upcoming Events
            </Text>
            <Pressable>
              <Text style={{ color: '#ff6b6b', fontWeight: '600' }}>See All</Text>
            </Pressable>
          </View>

          <FlatList
            horizontal
            data={upcomingEvents}
            renderItem={({ item }) => (
              <UpComingEvent item={item} />
            )}
            keyExtractor={item => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        </View>

        {/* Event Card Section */}
        <View
          style={{
            marginHorizontal: 15,
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            elevation: 5,
            marginBottom: 20, // Spacer for "Invite Friends" section
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: '600', fontSize: 16 }}>24 participants</Text>
            <Ionicons name="heart-outline" size={24} color="red" />
          </View>
          <Image
            style={{ width: '100%', height: 150, borderRadius: 10, marginVertical: 10 }}
            source={{
              uri: 'https://via.placeholder.com/300',
            }}
          />
          <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 5 }}>Artistics Museum 2022</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ width: 30, height: 30, borderRadius: 15 }}
                source={{
                  uri: 'https://via.placeholder.com/50',
                }}
              />
              <Text style={{ marginLeft: 8 }}>Wonderwood</Text>
            </View>
            <Text style={{ color: 'gray' }}>Feb 12 2022</Text>
          </View>
        </View>

        <View
          style={{
            margin: 15,
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
            Invite your friends
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2938/2938178.png',
              }}
            />
            <View style={{ marginLeft: 15 }}>
              <Text style={{ fontSize: 14, color: '#777' }}>
                Get $20 for every friend you invite
              </Text>
            </View>
          </View>
          <Pressable
            style={{
              marginTop: 10,
              backgroundColor: '#7b61ff',
              borderRadius: 8,
              padding: 10,
              alignItems: 'center',
            }}>
            <Text style={{ color: 'white', fontWeight: '600' }}>Invite</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventScreen;
