import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
  TouchableOpacity,
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
  const [popularOrganizers, setPopularOrganizers] = useState([]);

  const fetchEvents = async () => {
    try {
      const eventListResponse = await axios.get('http://10.0.2.2:8000/events');
      const events = eventListResponse.data;
      setEventList(events);
      if (events.length > 0) {
        setPopularEvent(events[0]);
      }
      calculatePopularOrganizers(events);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  const calculatePopularOrganizers = events => {
    const organizerMap = {};
    events.forEach(event => {
      if (organizerMap[event.organizerId]) {
        organizerMap[event.organizerId].count += 1;
      } else {
        organizerMap[event.organizerId] = {
          name: event.organizerName,
          profileImage: event.organizerUrl,
          count: 1,
        };
      }
    });
    const sortedOrganizers = Object.values(organizerMap).sort(
      (a, b) => b.count - a.count,
    );
    setPopularOrganizers(sortedOrganizers.slice(0, 3));
  };

  const toggleFavorite = async eventId => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];
      const isFavorite = favoritesArray.includes(eventId);
      let updatedFavorites = isFavorite
        ? favoritesArray.filter(id => id !== eventId)
        : [...favoritesArray, eventId];
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
    <ScrollView style={{flex: 1, backgroundColor: '#FFFFFF', padding: 16}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
        <Text style={{fontSize: 24, fontWeight: '700'}}>Hello, Can 👋</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={{marginBottom: 20}}>
        <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 10}}>
          Categories
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Music Festival', 'Sport Events', 'Fashion Shows', 'Book Fair'].map(
            (category, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#F5F5F5',
                  borderRadius: 10,
                  padding: 20,
                  marginRight: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 120,
                  height: 100,
                }}>
                <Text style={{fontSize: 14, fontWeight: '600'}}>
                  {category}
                </Text>
              </View>
            ),
          )}
        </ScrollView>
      </View>

      <View style={{marginBottom: 20}}>
        <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 10}}>
          Featured
        </Text>
        {popularEvent && (
          <Pressable
            onPress={() => navigation.navigate('Event', {item: popularEvent})}
            style={{
              backgroundColor: '#FFF',
              borderRadius: 15,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 4,
              marginBottom: 20,
              overflow: 'hidden',
            }}>
            <ImageBackground
              source={{uri: popularEvent.organizerUrl}}
              style={{height: 200, justifyContent: 'flex-end', padding: 10}}>
              <View
                style={{
                  backgroundColor: '#333',
                  opacity: 0.5,
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Text style={{color: '#fff', fontSize: 18, fontWeight: '700'}}>
                  {popularEvent.title}
                </Text>
                <Text style={{color: '#fff', marginTop: 5}}>
                  {popularEvent.date}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Ionicons name="location-outline" size={16} color="#fff" />
                  <Text style={{color: '#fff', marginLeft: 5}}>
                    {popularEvent.location}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(popularEvent._id)}
                style={{position: 'absolute', top: 10, right: 10}}>
                <Ionicons
                  name={
                    favorites.includes(popularEvent._id)
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={28}
                  color="#FFF"
                />
              </TouchableOpacity>
            </ImageBackground>
          </Pressable>
        )}
      </View>

      <View style={{marginBottom: 20}}>
        <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 10}}>
          Popular Events 🔥
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {eventList.map(item => (
            <Pressable
              key={item._id}
              onPress={() => navigation.navigate('Event', {item})}
              style={{
                width: 180,
                marginRight: 16,
                backgroundColor: '#FFF',
                borderRadius: 15,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 5,
              }}>
              <Image
                source={{uri: item.organizerUrl}}
                style={{width: '100%', height: 100, borderRadius: 15}}
              />
              <View style={{padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: '700', color: '#333'}}>
                  {item.title}
                </Text>
                <Text style={{fontSize: 12, color: '#777', marginTop: 4}}>
                  {item.date}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 4,
                  }}>
                  <Ionicons name="location-outline" size={14} color="#777" />
                  <Text style={{marginLeft: 5, fontSize: 12, color: '#777'}}>
                    {item.location}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                  }}>
                  {item.attendees.slice(0, 3).map((attendee, index) => (
                    <Image
                      key={index}
                      source={{uri: attendee.imageUrl}}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        marginLeft: index === 0 ? 0 : -8,
                        borderWidth: 2,
                        borderColor: '#fff',
                      }}
                    />
                  ))}
                  <Text style={{marginLeft: 10, color: '#777', fontSize: 12}}>
                    +{item.attendees.length} Going
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(item._id)}
                style={{position: 'absolute', top: 10, right: 10}}>
                <Ionicons
                  name={
                    favorites.includes(item._id) ? 'heart' : 'heart-outline'
                  }
                  size={24}
                  color={favorites.includes(item._id) ? 'red' : 'gray'}
                />
              </TouchableOpacity>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={{marginBottom: 20}}>
        <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 10}}>
          Popular Organizers 🎤
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularOrganizers.map((organizer, index) => (
            <View
              key={index}
              style={{
                width: 180,
                marginRight: 16,
                backgroundColor: '#FFFFFF',
                borderRadius: 15,
                padding: 10,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 5,
              }}>
              <Image
                source={{uri: organizer.profileImage}}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginVertical: 5,
                }}>
                {organizer.name}
              </Text>
              <Text style={{textAlign: 'center', color: '#777', fontSize: 12}}>
                {organizer.count} Events
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{paddingVertical: 20, alignItems: 'center'}}>
        <Text style={{fontSize: 14, color: '#777'}}>EventMate © 2024</Text>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
