import {useRoute} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const VenueInfoScreen = () => {
  const route = useRoute();
  const {venueId, role, userId} = route.params;
  const [venue, setVenue] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenueAndEvents = async () => {
      try {
        const venueResponse = await axios.get(
          `http://10.0.2.2:8000/venues/${venueId}`,
        );

        console.log('API Yanıtı:', venueResponse.data);
        setVenue(venueResponse.data);

        await fetchEvents();
      } catch (error) {
        console.error('Error fetching venue and events:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        let url = `http://10.0.2.2:8000/events?venueId=${venueId}`;
    
        if (role === 'organizer') {
          console.log(`Fetching events for organizer with ID: ${userId}`);
          url += `&organizerId=${userId}&role=organizer`;
        }
    
        const response = await axios.get(url);
        console.log('Fetched events:', response.data); // Kontrol edin
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error.message);
      }
    };
    

    if (venueId) fetchVenueAndEvents();
  }, [venueId, role, userId]);

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

  const renderEventItem = ({item}) => {
    console.log('Event Item:', item); // Kontrol edin

    return (
      <View
        style={{
          marginVertical: 10,
          padding: 15,
          backgroundColor: 'white',
          borderRadius: 10,
          elevation: 3,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          {item.title || 'Untitled Event'}
        </Text>
        <Text style={{fontSize: 14, color: '#555', marginVertical: 5}}>
          {item.eventType || 'Event Type'} | ${item.price || 'TBA'}
        </Text>
        <Text style={{fontSize: 12, color: '#777'}}>
          Available at: {item.location || 'TBA'} on {item.date || 'TBA'} at{' '}
          {item.time || 'TBA'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <FlatList
        ListHeaderComponent={() => (
          <>
            <Image
              style={{width: '100%', height: 250, resizeMode: 'cover'}}
              source={{uri: venue.image}}
            />
            <View
              style={{
                padding: 16,
                backgroundColor: '#fff',
                marginTop: -20,
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 24, fontWeight: 'bold'}}>
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
                <Text style={{marginLeft: 8}}>{venue.timings || 'TBD'}</Text>
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
                <Text style={{marginLeft: 8}}>{venue.location}</Text>
              </View>
            </View>
          </>
        )}
        data={events}
        keyExtractor={item => item._id}
        renderItem={renderEventItem}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginVertical: 20}}>
            No events available.
          </Text>
        }
      />
      <Pressable
        style={{
          backgroundColor: 'green',
          padding: 15,
          margin: 20,
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Book Now</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default VenueInfoScreen;
