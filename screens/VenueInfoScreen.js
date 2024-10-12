import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Amenities from '../components/Amenities';

const VenueInfoScreen = () => {
  const route = useRoute();
  const venue = route.params.venueData; 

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Image
          style={{width: '100%', height: 200, resizeMode: 'cover'}}
          source={{uri: venue.image}}
        />
        <View style={{padding: 10}}>
          <Text style={{color: 'black'}}>{venue.name}</Text>
          <View style={{marginTop: 5, flexDirection: 'row', gap: 5}}>
            <Ionicons name="time-outline" size={24} color="black" />
            <Text style={{color: 'black', fontSize: 15, fontWeight: '500'}}>
              {venue.timings}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 5, marginVertical: 8}}>
            <Ionicons name="location-outline" size={24} color="black" />
            <Text style={{color: 'black', fontSize: 14, fontWeight: '500', width: '80%'}}>
              {venue.location}
            </Text>
          </View>
        </View>

        <Text style={{color: 'black', marginLeft: 10}}>Events Available</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {venue.sportsAvailable.map((sport, index) => (
            <View
              key={index}
              style={{
                borderColor: '#686868',
                margin: 10,
                padding: 20,
                width: 130,
                height: 90,
                borderWidth: 1,
                borderRadius: 5,
              }}
            >
              <MaterialCommunityIcons name={sport.icon} size={24} color="gray" />
              <Text style={{color: 'black', fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>
                {sport.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      <Pressable
        style={{
          backgroundColor: 'green',
          padding: 8,
          margin: 15,
          borderRadius: 3,
        }}
      >
        <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'white'}}>
          Book Now
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default VenueInfoScreen;

const styles = StyleSheet.create({});
