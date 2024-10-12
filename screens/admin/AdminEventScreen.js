import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../../AuthContext';
import UpComingEvent from '../../components/UpComingEvent';

const AdminEventScreen = () => {
  const [events, setEvents] = useState([]);
  const {userId, role} = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    console.log('AuthContext userId:', userId); 
    console.log('AuthContext role:', role); 

    if (userId && role === 'organizer') {
      fetchOrganizerEvents();
    }
  }, [userId, role]);

  const fetchOrganizerEvents = async () => {
    try {
      console.log('userId:', userId, 'role:', role); 

      const response = await axios.get(`http://10.0.2.2:8000/events`, {
        params: {userId, role},
      });

      console.log('Response Data:', response.data);
      setEvents(response.data);
    } catch (error) {
      console.log('Error fetching organizer events:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f0f0f5'}}>
      <ScrollView>
        <Pressable
          onPress={() => navigation.navigate('AdminCreate')}
          style={{
            backgroundColor: '#07bc0c',
            padding: 12,
            margin: 10,
            borderRadius: 4,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 15,
              fontWeight: '500',
            }}>
            Create Event
          </Text>
        </Pressable>
        <View style={{padding: 12}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, fontWeight: '700', color: '#333'}}>
              My Events
            </Text>
            <Pressable>
              <Text style={{color: '#ff6b6b', fontWeight: '600'}}>See All</Text>
            </Pressable>
          </View>
          <FlatList
            horizontal
            data={events}
            renderItem={({item}) => <UpComingEvent item={item} />}
            keyExtractor={item => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingVertical: 10}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminEventScreen;
