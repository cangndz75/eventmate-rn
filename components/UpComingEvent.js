import {
  Image,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useContext, useEffect, useState, useCallback} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UpComingEvent = ({item}) => {
  const navigation = useNavigation();
  const {role, userId} = useContext(AuthContext);
  const [eventData, setEventData] = useState(item || null);
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 

  useFocusEffect(
    useCallback(() => {
      fetchEventData();
    }, [item]),
  );

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/events/${item?._id}`,
      );
      setEventData(response.data);
      setIsBooked(response.data?.attendees?.some(att => att._id === userId));
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEventData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#07bc0c" />
      </View>
    );
  }

  if (!eventData) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Ionicons name="calendar-outline" size={48} color="#888" />
        <Text style={{fontSize: 18, color: '#888', marginTop: 8}}>
          No Events
        </Text>
      </View>
    );
  }

  const renderEventItem = () => (
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
            uri: eventData?.images?.[0] || 'https://via.placeholder.com/100',
          }}
          onError={e => console.log('Image loading failed', e.nativeEvent)}
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

  return (
    <FlatList
      data={[eventData]}
      renderItem={renderEventItem}
      keyExtractor={item => item._id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default UpComingEvent;
