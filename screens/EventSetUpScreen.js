import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const {width} = Dimensions.get('window');

const EventSetUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userId} = useContext(AuthContext);
  const event = route?.params?.item || {};
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('About');
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchOrganizer();
    checkIfFavorited();
  }, []);

  const fetchOrganizer = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/event/${event._id}/organizer`,
      );
      setOrganizer(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch organizer details.');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorited = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/favorites/${userId}`,
      );
      const favorites = response.data.map(fav => fav._id);
      setIsFavorited(favorites.includes(event._id));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch favorites.');
    }
  };

  const toggleFavorite = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:8000/favorites', {
        userId,
        eventId: event._id,
      });
      setIsFavorited(response.data.isFavorited);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite.');
    }
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <Image
          source={{uri: event.images?.[0] || 'https://via.placeholder.com/300'}}
          style={{width: '100%', height: 300, resizeMode: 'cover'}}
        />
        {/* Back and Favorite Buttons */}
        <View style={{position: 'absolute', top: 20, left: 20}}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={{position: 'absolute', top: 20, right: 20}}>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorited ? 'red' : '#fff'}
            />
          </TouchableOpacity>
        </View>

        {/* Event Details Section */}
        <View style={{padding: 16}}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>{event.title}</Text>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <MaterialIcons name="location-on" size={24} color="#5c6bc0" />
            <Text style={{marginLeft: 10}}>{event.location}</Text>
          </View>

          {/* Organizer Information */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Image
              source={{
                uri: organizer?.image || 'https://via.placeholder.com/150',
              }}
              style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
            />
            <View>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {`${organizer?.firstName} ${organizer?.lastName}`}
              </Text>
              <Text style={{color: 'gray'}}>Organizer</Text>
            </View>
          </View>

          {/* About/Review Tabs */}
          <View style={{flexDirection: 'row', marginVertical: 20}}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 10,
                borderBottomWidth: selectedTab === 'About' ? 2 : 0,
                borderBottomColor: 'black',
              }}
              onPress={() => setSelectedTab('About')}>
              <Text
                style={{
                  fontWeight: selectedTab === 'About' ? 'bold' : 'normal',
                }}>
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 10,
                borderBottomWidth: selectedTab === 'Review' ? 2 : 0,
                borderBottomColor: 'black',
              }}
              onPress={() => setSelectedTab('Review')}>
              <Text
                style={{
                  fontWeight: selectedTab === 'Review' ? 'bold' : 'normal',
                }}>
                Review
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'About' ? (
            <Text style={{color: '#666', marginTop: 10}}>
              {event.description}
            </Text>
          ) : (
            <View>
              <TextInput
                placeholder="Write a review..."
                style={{
                  height: 100,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: 'green',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
                onPress={() =>
                  Alert.alert('Review Submitted', 'Thanks for your feedback!')
                }>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Submit Review
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{
          backgroundColor: 'black',
          padding: 15,
          margin: 20,
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={() => Alert.alert('Booking', 'You have booked the event!')}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Book Schedule</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EventSetUpScreen;
