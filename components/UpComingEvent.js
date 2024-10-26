import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
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
        `https://biletixai.onrender.com/events/${item?._id}`,
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
        navigation.navigate('EventSetUp', {
          item: eventData,
          eventId:eventData._id,
        })
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
