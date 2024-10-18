import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import UpComingEvent from '../components/UpComingEvent';

const EventScreen = () => {
  const {userId, role, user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  const categories = ['All', 'Sports', 'Music', 'Football'];

  useEffect(() => {
    fetchEvents();
  }, [userId, role]);

  const fetchEvents = async () => {
    try {
      let url = 'http://10.0.2.2:8000/events';
      if (role === 'organizer') {
        url += `?organizerId=${userId}&role=organizer`;
      }
      const response = await axios.get(url);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(
    event =>
      (selectedCategory === 'All' ||
        event.eventType === selectedCategory.toLowerCase()) &&
      event.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#07bc0c" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f0f0f5'}}>
      <ScrollView>
        <View style={{padding: 12, backgroundColor: '#7b61ff'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                {user?.firstName || 'User'}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="white"
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="chatbox-outline" size={24} color="white" />
              <Ionicons name="notifications-outline" size={24} color="white" />
            </View>
          </View>

          <View
            style={{
              marginTop: 15,
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}>
            <Ionicons name="search-outline" size={20} color="gray" />
            <TextInput
              placeholder="Search events"
              style={{flex: 1, marginLeft: 10, fontSize: 16}}
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
            />
          </View>

          <View style={{marginVertical: 15, flexDirection: 'row'}}>
            {categories.map((category, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedCategory(category)}
                style={{
                  backgroundColor:
                    selectedCategory === category ? '#ff6b6b' : '#ddd',
                  borderRadius: 20,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  marginRight: 10,
                }}>
                <Text
                  style={{
                    color: selectedCategory === category ? 'white' : '#000',
                  }}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{padding: 12}}>
          <Text style={{fontSize: 16, fontWeight: '700', color: '#333'}}>
            {role === 'organizer' ? 'My Events' : 'All Events'}
          </Text>

          {filteredEvents.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 50,
              }}>
              <Ionicons name="calendar-outline" size={48} color="#888" />
              <Text style={{fontSize: 18, color: '#888', marginTop: 8}}>
                No Events
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredEvents}
              renderItem={({item}) => <UpComingEvent item={item} />}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingVertical: 10}}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventScreen;
