import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const VenueInfoScreen = () => {
  const route = useRoute();
  const {venueId} = route.params;
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:8000/venues/${venueId}`,
        );
        setVenue(response.data);
      } catch (error) {
        console.error('Error fetching venue:', error);
      } finally {
        setLoading(false);
      }
    };

    if (venueId) fetchVenue();
  }, [venueId]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Venue...</Text>
      </View>
    );
  }

  if (!venue) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No venue data found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <ScrollView>
        <Image
          style={{width: '100%', height: 250, resizeMode: 'cover'}}
          source={{uri: venue.image}}
        />
        <View
          style={{
            padding: 16,
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: -20,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 10,
            }}>
            {venue.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
            }}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color="#555"
            />
            <Text style={{marginLeft: 8, fontSize: 16, color: '#555'}}>
              {venue.timings || 'TBD'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
            }}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={24}
              color="#555"
            />
            <Text style={{marginLeft: 8, fontSize: 16, color: '#555'}}>
              {venue.location}
            </Text>
          </View>
        </View>
      </ScrollView>
      <Pressable
        style={{
          backgroundColor: 'green',
          padding: 15,
          margin: 20,
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
          Book Now
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default VenueInfoScreen;
