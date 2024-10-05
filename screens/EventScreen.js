import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Event from '../components/Event';
import { AuthContext } from '../AuthContext';
import UpComingEvent from '../components/UpComingEvent';

const EventScreen = () => {
  const [option, setOption] = useState('My Events');
  const [event, setEvent] = useState('Concert');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const {userId} = useContext(AuthContext);
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
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
    if(userId){
      fetchUpcomingEvents();
    }
  }, [userId]);
  const fetchUpcomingEvents = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/upcoming?userId=${userId}`);
      setUpcomingEvents(response.data);
    } catch (error) {
      console.log('Error fetching upcoming events:', error);
    }
  }
  console.log('Events', upcomingEvents);
  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{padding: 12, backgroundColor: '#223536'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
              Can Gündüz
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Ionicons name="chatbox-outline" size={24} color="white" />
            <Ionicons name="notifications-outline" size={24} color="white" />
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/ogw/AF2bZygt1JucrWn0fCbOOWjGjCOa_3Q88Fw4DT0zyVurZmbzxwc=s32-c-mo',
              }}
              style={{width: 30, height: 30, borderRadius: 15}}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginVertical: 13,
          }}>
          <Pressable onPress={() => setOption('Calendar')}>
            <Text
              style={{
                color: option == 'Calendar' ? '#12e04c' : 'white',
                fontWeight: '500',
                fontSize: 15,
              }}>
              Calendar
            </Text>
          </Pressable>
          <Pressable onPress={() => setOption('My Events')}>
            <Text
              style={{
                color: option == 'My Events' ? '#12e04c' : 'white',
                fontWeight: '500',
                fontSize: 15,
              }}>
              My Events
            </Text>
          </Pressable>
          <Pressable onPress={() => setOption('Other Sports')}>
            <Text
              style={{
                color: option == 'Other Sports' ? '#12e04c' : 'white',
                fontWeight: '500',
                fontSize: 15,
              }}>
              Other Events
            </Text>
          </Pressable>
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable
              onPress={() => setEvent('Concert')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderColor: 'white',
                marginRight: 10,
                borderRadius: 8,
                borderWidth: event == 'Concert' ? 0 : 1,
                backgroundColor: event == 'Concert' ? '#1dbf22' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Concert
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setEvent('Football')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                padding: 10,
                borderColor: 'white',
                marginRight: 10,
                borderRadius: 8,
                borderWidth: event == 'Football' ? 0 : 1,
                backgroundColor:
                  event == 'Football' ? '#1dbf22' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Football
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setEvent('Theater')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                padding: 10,
                borderColor: 'white',
                marginRight: 10,
                borderRadius: 8,
                borderWidth: event == 'Theater' ? 0 : 1,
                backgroundColor: event == 'Theater' ? '#1dbf22' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Theater
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setEvent('Dance')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderColor: 'white',
                marginRight: 10,
                borderRadius: 8,
                borderWidth: event == 'Dance' ? 0 : 1,
                backgroundColor: event == 'Dance' ? '#1dbf22' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Dance
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          backgroundColor: 'white',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Pressable onPress={() => navigation.navigate('Create')}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>Create Event</Text>
        </Pressable>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Pressable>
            <Text style={{fontWeight: 'bold', color: 'black'}}>Filter</Text>
          </Pressable>
          <Pressable>
            <Text style={{fontWeight: 'bold', color: 'black'}}>Sort</Text>
          </Pressable>
        </View>
      </View>
      {option == 'My Events' && (
        <FlatList
          data={events}
          renderItem={({item}) => <Event item={item} />}
          keyExtractor={item => item._id}
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}

      {option == 'Calendar' && (
        <FlatList
          data={upcomingEvents}
          renderItem={({item}) => <UpComingEvent item={item} />}
          keyExtractor={item => item._id}
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}
    </SafeAreaView>
  );
};

export default EventScreen;
