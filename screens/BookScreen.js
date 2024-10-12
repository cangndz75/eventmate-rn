import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import VenueCard from '../components/VenueCard'; // Ensure this component is correctly defined

const BookScreen = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch venues from the backend
  const fetchVenues = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/venues'); // Replace with your backend address
      setVenues(response.data); // Set fetched venues in state
    } catch (error) {
      console.error('Error fetching venues:', error.message);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  useEffect(() => {
    fetchVenues(); // Fetch venues on component mount
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Venues...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <Text style={styles.headerText}>Can Gündüz</Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Ionicons name="chatbox-outline" size={24} color="black" />
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/ogw/AF2bZygt1JucrWn0fCbOOWjGjCOa_3Q88Fw4DT0zyVurZmbzxwc=s32-c-mo',
            }}
            style={styles.profileImage}
          />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput placeholder="Search" style={{flex: 1}} />
        <Ionicons name="search" size={24} color="black" />
      </View>

      <Pressable style={styles.filterContainer}>
        {['Event', 'Favorites', 'Offers'].map((filter, index) => (
          <View key={index} style={styles.filterButton}>
            <Text>{filter}</Text>
          </View>
        ))}
      </Pressable>

      <FlatList
        data={venues}
        renderItem={({item}) => <VenueCard item={item} />}
        keyExtractor={item => item._id.toString()} 
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  searchContainer: {
    marginHorizontal: 12,
    backgroundColor: '#E8E8E8',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 25,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 13,
  },
  filterButton: {
    padding: 10,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
});

export default BookScreen;
