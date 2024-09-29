import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import VenueCard from '../components/VenueCard';

const BookScreen = () => {
  const venues = [
    {
      id: '0',
      name: "DDSA - St.Joseph's Boys' High School (European)",
      address: 'Ashok Nagar',
      newImage:
        'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800',
      image:
        'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800',
      location:
        'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
      rating: 3.6,
      timings: '5.30 AM - 9:00 PM',
      sportsAvailable: [
        {
          id: '10',
          name: 'Badminton',
          icon: 'badminton',
          price: 500,
          courts: [
            {
              id: '10',
              name: 'Standard synthetic court 1',
            },
            {
              id: '11',
              name: 'Standard synthetic court 2',
            },
            {
              id: '12',
              name: 'Standard synthetic court 3',
            },
          ],
        },
        {
          id: '11',
          name: 'Cricket',
          icon: 'cricket',
          price: 1100,
          courts: [
            {
              id: '10',
              name: 'Full Pitch 1',
            },
            {
              id: '11',
              name: 'Full Pitch 2',
            },
          ],
        },
        {
          id: '12',
          name: 'Tennis',
          icon: 'tennis',
          price: 900,
          courts: [
            {
              id: '10',
              name: 'Court 1',
            },
            {
              id: '11',
              name: 'Court 2',
            },
          ],
        },
      ],
    },
    {
      id: '1',
      image:
        'https://playo.gumlet.io/PANCHAJANYABADMINTONFITNESSACADEMY/panchajanyabadmintonfitnessacademy1597334767773.jpeg?mode=crop&crop=smart&h=200&width=450&q=40&format=webp',
      name: 'Panchajanya Badminton & Fitness Academy',
      address: 'Kittur Rani Chennamma Stadium',
      location:
        'Gate 01, Kittur Rani Chennamma Stadium, Sports Complex, Jayanagar, Jayanagar East, Byrasandra, Jayanagar, Bengaluru, Karnataka - 560011',
      rating: 4.0,
      newImage:
        'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800',
      timings: '5 AM - 10 PM',
      sportsAvailable: [
        {
          id: '10',
          name: 'Badminton',
          icon: 'badminton',
          price: 500,
          courts: [
            {
              id: '10',
              name: 'Standard synthetic court 1',
            },
            {
              id: '11',
              name: 'Standard synthetic court 2',
            },
            {
              id: '12',
              name: 'Standard synthetic court 3',
            },
          ],
        },
        {
          id: '11',
          name: 'Cricket',
          icon: 'cricket',
          price: 1100,
          courts: [
            {
              id: '10',
              name: 'Full Pitch 1',
            },
            {
              id: '11',
              name: 'Full Pitch 2',
            },
          ],
        },
        {
          id: '12',
          name: 'Tennis',
          icon: 'tennis',
          price: 900,
          courts: [
            {
              id: '10',
              name: 'Court 1',
            },
            {
              id: '11',
              name: 'Court 2',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Sportexx',
      image:
        'https://playo.gumlet.io/SPORTEXX20220319100016960702/sportexx1647683524186.jpg?mode=crop&crop=smart&h=200&width=450&q=40&format=webp',
      address: 'Hebbal Kempapura',
      location: '#43/2, 3rd Cross, Sonnappa Layout, Bhuvaneshwari Nagar',
      rating: 4.1,
      newImage:
        'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800',
      timings: '5.30 AM - 9:00 PM',
      sportsAvailable: [
        {
          id: '10',
          name: 'Badminton',
          icon: 'badminton',
          price: 500,
          courts: [
            {
              id: '10',
              name: 'Standard synthetic court 1',
            },
            {
              id: '11',
              name: 'Standard synthetic court 2',
            },
            {
              id: '12',
              name: 'Standard synthetic court 3',
            },
          ],
        },
        {
          id: '11',
          name: 'Cricket',
          icon: 'cricket',
          price: 1100,
          courts: [
            {
              id: '10',
              name: 'Full Pitch 1',
            },
            {
              id: '11',
              name: 'Full Pitch 2',
            },
          ],
        },
      ],
    },
  ];
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 12,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
            Can Gündüz
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Ionicons name="chatbox-outline" size={24} color="black" />
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/ogw/AF2bZygt1JucrWn0fCbOOWjGjCOa_3Q88Fw4DT0zyVurZmbzxwc=s32-c-mo',
            }}
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
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 25,
        }}>
        <TextInput placeholder="Search" />
        <Ionicons name="search" size={24} color="black" />
      </View>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 13,
        }}>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            borderColor: '#E0E0E0',
            borderWidth: 1,
          }}>
          <Text>Event</Text>
        </View>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            borderColor: '#E0E0E0',
            borderWidth: 1,
          }}>
          <Text>Favorites</Text>
        </View>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            borderColor: '#E0E0E0',
            borderWidth: 1,
          }}>
          <Text>Offers</Text>
        </View>
      </Pressable>
      <FlatList
        data={venues}
        renderItem={({item}) => <VenueCard item={item} />}
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default BookScreen;

const styles = StyleSheet.create({});
