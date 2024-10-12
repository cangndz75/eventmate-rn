import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import VenueCard from '../components/VenueCard';

const BookScreen = ({navigation}) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVenues = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/venues');
      setVenues(response.data);
    } catch (error) {
      console.error('Error fetching venues:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Venues...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 12,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Can Gündüz</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Ionicons name="chatbox-outline" size={24} color="black" />
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Image
            source={{uri: 'https://lh3.googleusercontent.com/ogw/...'}}
            style={{width: 30, height: 30, borderRadius: 15}}
          />
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 12,
          backgroundColor: '#E8E8E8',
          padding: 12,
          flexDirection: 'row',
          borderRadius: 25,
        }}>
        <TextInput placeholder="Search" style={{flex: 1}} />
        <Ionicons name="search" size={24} color="black" />
      </View>

      <FlatList
        data={venues}
        renderItem={({item}) => (
          <VenueCard
            item={item}
            onPress={() =>
              navigation.navigate('VenueInfo', {venueId: item._id})
            }
          />
        )}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </SafeAreaView>
  );
};

export default BookScreen;
