import React, {useState, useContext, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import UpComingEvent from '../components/UpComingEvent';
import FilterModal from '../components/FilterModal';

const EventScreen = () => {
  const {userId, user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const categories = ['All', 'Sports', 'Music', 'Football'];

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://biletixai.onrender.com/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = filters => {
    setPriceRange(filters.priceRange);
    setSelectedCategory(filters.selectedCategory || 'All');
    setFilterModalVisible(false);
  };

  const filteredEvents = events.filter(
    event =>
      (selectedCategory === 'All' ||
        event.eventType === selectedCategory.toLowerCase()) &&
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      event.price >= priceRange[0] &&
      event.price <= priceRange[1],
  );

  const renderHeader = () => (
    <View style={{padding: 12, backgroundColor: '#7b61ff'}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
          {user?.firstName || 'Guest'}
        </Text>
        <Ionicons name="notifications-outline" size={24} color="white" />
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
          placeholder="Search"
          style={{flex: 1, marginLeft: 10}}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <Pressable onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="options-outline" size={24} color="#7b61ff" />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{marginTop: 15, flexDirection: 'row'}}>
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
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#07bc0c" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        ListHeaderComponent={
          <>
            {renderHeader()}
            <FilterModal
              visible={filterModalVisible}
              onClose={() => setFilterModalVisible(false)}
              onApply={applyFilters}
            />
          </>
        }
        data={filteredEvents}
        renderItem={({item}) => <UpComingEvent item={item} />}
        keyExtractor={item => item._id}
      />
    </>
  );
};

export default EventScreen;
