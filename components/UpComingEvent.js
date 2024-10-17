import {Image, Pressable, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../AuthContext';

const UpComingEvent = ({item}) => {
  const navigation = useNavigation();
  const {role} = useContext(AuthContext);
  const [eventData, setEventData] = useState(item || null);
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (!item) {
      fetchEventData(); // Fetch event details if not provided as a prop
    } else {
      setEventData(item);
      setIsBooked(item?.isBooked || false);
      setLoading(false); // Set loading to false once data is set
    }
  }, [item]);

  const fetchEventData = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/events/${item?._id}`,
      );
      setEventData(response.data);
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; // Show loading text while data is being fetched
  }

  if (!eventData) return null; // Handle case where event data is still not available

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(
          role === 'organizer' ? 'AdminEventSetUp' : 'EventSetup',
          {item: eventData},
        )
      }
      style={{
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
      }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: '#FF6347',
          marginBottom: 8,
        }}>
        {new Date(eventData?.date).toDateString()}
      </Text>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{width: 80, height: 80, borderRadius: 12, marginRight: 12}}
          source={{
            uri: eventData?.organizerUrl || 'https://www.placecage.com/100/100',
          }}
        />

        <View style={{flex: 1}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#333'}}>
            {eventData?.title}
          </Text>
          <Text style={{fontSize: 14, color: '#777', marginVertical: 4}}>
            {eventData?.location}
          </Text>
          <Text style={{fontSize: 14, color: '#999'}}>
            Hosted by {eventData?.organizerName}
          </Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FF6347'}}>
            {eventData?.attendees?.length || 0}
          </Text>
          <Text style={{fontSize: 12, color: '#FF6347'}}>Going</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        }}>
        <Text style={{fontSize: 14, fontWeight: '500', color: '#888'}}>
          {eventData?.time}
        </Text>

        {role === 'organizer' ? (
          <Pressable
            onPress={() =>
              navigation.navigate('AdminEventSetUp', {item: eventData})
            }
            style={{
              backgroundColor: '#56cc79',
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}>
            <Text style={{color: 'white', fontWeight: '600'}}>Manage</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setIsBooked(prev => !prev)}
            style={{
              backgroundColor: isBooked ? '#56cc79' : '#FF6347',
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}>
            <Text style={{color: 'white', fontWeight: '600'}}>
              {isBooked ? 'Booked' : 'Join'}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default UpComingEvent;
