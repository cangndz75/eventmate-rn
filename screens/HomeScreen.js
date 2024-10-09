import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {AuthContext} from '../AuthContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {userId, favorites, setFavorites} = useContext(AuthContext);
  const [eventList, setEventList] = useState([]);
  const [popularEvent, setPopularEvent] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="person-circle-outline" size={24} color="black" />
          <Text style={{marginLeft: 10, color: 'black'}}>Can Gündüz</Text>
        </View>
      ),
    });
  }, []);

  const fetchEvents = async () => {
    try {
      const eventListResponse = await axios.get('http://10.0.2.2:8000/events');
      const events = eventListResponse.data;
      setEventList(events);
      if (events.length > 0) {
        setPopularEvent(events[0]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const toggleFavorite = async eventId => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];

      const isFavorite = favoritesArray.includes(eventId);
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = favoritesArray.filter(id => id !== eventId);
      } else {
        updatedFavorites = [...favoritesArray, eventId];
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      await axios.post('http://10.0.2.2:8000/favorites', {userId, eventId});
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#F8F8F8', padding: 10}}>
      {popularEvent && (
        <View style={{padding: 13}}>
          <Pressable
            onPress={() => navigation.navigate('Event', {item: popularEvent})}
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
              <Pressable onPress={() => toggleFavorite(popularEvent._id)}>
                <Ionicons
                  name={
                    favorites.includes(popularEvent._id)
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={24}
                  color={favorites.includes(popularEvent._id) ? 'red' : 'white'}
                  style={{position: 'absolute', top: 10, right: 10, zIndex: 10}}
                />
              </Pressable>
            </ImageBackground>
            <View style={{paddingVertical: 10}}>
              <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>
                {popularEvent.title}
              </Text>
              <Text style={{fontSize: 14, color: 'gray'}}>
                {popularEvent.date}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 4,
                }}>
                <Ionicons name="location-outline" size={16} color="gray" />
                <Text style={{marginLeft: 4, color: 'gray', fontSize: 12}}>
                  {popularEvent.location}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                {popularEvent.attendees.slice(0, 3).map((attendee, index) => (
                  <Image
                    key={index}
                    source={{uri: attendee.imageUrl}}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginLeft: index === 0 ? 0 : -10,
                    }}
                  />
                ))}
                <Text style={{marginLeft: 10, color: 'gray'}}>
                  {popularEvent.attendees.length} Going
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      )}

      <View style={{padding: 13}}>
        {eventList.slice(1).map(item => (
          <Pressable
            key={item._id}
            onPress={() => navigation.navigate('Event', {item})}
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
              <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>
                {item.title}
              </Text>
              <Text style={{fontSize: 14, color: 'gray'}}>{item.date}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 4,
                }}>
                <Ionicons name="location-outline" size={16} color="gray" />
                <Text style={{marginLeft: 4, color: 'gray', fontSize: 12}}>
                  {item.location}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                {item.attendees.slice(0, 3).map((attendee, index) => (
                  <Image
                    key={index}
                    source={{uri: attendee.imageUrl}}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginLeft: index === 0 ? 0 : -10,
                    }}
                  />
                ))}
                <Text style={{marginLeft: 10, color: 'gray'}}>
                  {item.attendees.length} Going
                </Text>
              </View>
            </View>
            <Pressable onPress={() => toggleFavorite(item._id)}>
              <Ionicons
                name={favorites.includes(item._id) ? 'heart' : 'heart-outline'}
                size={24}
                color={favorites.includes(item._id) ? 'red' : 'black'}
              />
            </Pressable>
          </Pressable>
        ))}
      </View>

      {/* Banner */}
      <View
        style={{
          marginTop: 20,
          padding: 20,
          backgroundColor: '#E0F7FA',
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 16, fontWeight: '600'}}>
          Invite your friends
        </Text>
        <Pressable
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: '#03A9F4',
            borderRadius: 8,
          }}>
          <Text style={{color: 'white'}}>Invite</Text>
        </Pressable>
      </View>

      {/* Special Deal Section */}
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 15}}>
          Special Deal
        </Text>
        {eventList.slice(1, 4).map((deal, index) => (
          <Pressable
            key={deal._id}
            onPress={() => navigation.navigate('Event', {item: deal})}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>
                {deal.title}
              </Text>
              <Text style={{fontSize: 14, color: 'gray'}}>{deal.date}</Text>
              <Text style={{fontSize: 14, color: '#00C853', fontWeight: '600'}}>
                ${deal.price}
              </Text>
            </View>
            <Image
              source={{uri: deal.organizerUrl}}
              style={{width: 60, height: 60, borderRadius: 10}}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
