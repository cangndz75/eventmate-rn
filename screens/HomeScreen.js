import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {AuthContext} from '../AuthContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {favorites, setFavorites} = useContext(AuthContext);
  const [eventList, setEventList] = useState([]);
  const [popularEvent, setPopularEvent] = useState(null);
  const [popularOrganizers, setPopularOrganizers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://10.0.2.2:8000/events', {
          headers: {Authorization: `Bearer ${token}`},
        });

        setEventList(response.data);
        if (response.data.length > 0) {
          setPopularEvent(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const eventListResponse = await axios.get('http://10.0.2.2:8000/events', {
        headers: {Authorization: `Bearer ${token}`},
      });

      const events = eventListResponse.data;
      setEventList(events);

      if (events.length > 0) {
        setPopularEvent(events[0]);
      }

      calculatePopularOrganizers(events);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    } finally {
      setIsLoading(false);
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

      const updatedFavorites = isFavorite
        ? favoritesArray.filter(id => id !== eventId)
        : [...favoritesArray, eventId];

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#5c6bc0" />
        <Text>Loading events...</Text>
      </View>
    );
  }

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
                    favorites && favorites.includes(popularEvent._id)
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
              onPress={() => navigation.navigate('EventSetUp', {item})}
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
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(item._id)}
                style={{position: 'absolute', top: 10, right: 10}}>
                <Ionicons
                  name={
                    favorites && favorites.includes(item._id)
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={24}
                  color={
                    favorites && favorites.includes(item._id) ? 'red' : 'gray'
                  }
                />
              </TouchableOpacity>
            </Pressable>
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
