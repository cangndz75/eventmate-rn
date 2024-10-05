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
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <>
            <View>
              <Image
                style={{width: '100%', height: 200, resizeMode: 'cover'}}
                source={{
                  uri: 'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800',
                }}
              />
            </View>
            <View style={{padding: 10}}>
              <Text style={{color: 'black'}}>{route?.params?.name}</Text>
              <View style={{marginTop: 5, flexDirection: 'row', gap: 5}}>
                <Ionicons name="time-outline" size={24} color="black" />
                <Text
                  style={{
                    color: 'green',
                    fontSize: 15,
                    fontWeight: '500',
                    color: 'black',
                  }}>
                  21:00
                </Text>
              </View>
              <View style={{flexDirection: 'row', gap: 5, marginVertical: 8}}>
                <Ionicons name="location-outline" size={24} color="black" />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontWeight: '500',
                    width: '80%',
                    color: 'black',
                  }}>
                  {route?.params?.location}
                </Text>
              </View>
            </View>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <View>
                <View style={{flexDirection: 'row'}}>
                  {[0, 0, 0, 0, 0].map((en, i) => (
                    <FontAwesome
                      style={{paddingHorizontal: 3}}
                      name={
                        i < Math.floor(route.params.rating) ? 'star' : 'star-o'
                      }
                      size={15}
                      color="#FFD700"
                    />
                  ))}
                  <Text style={{color: 'black'}}>
                    {route.params.rating} (9 Ratings){' '}
                  </Text>
                </View>
                <Pressable
                  style={{
                    marginTop: 6,
                    width: 160,
                    borderColor: '#686868',
                    borderWidth: 1,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text style={{color: 'black'}}>Rate Venue</Text>
                </Pressable>
              </View>

              <View>
                <View>
                  <Text style={{color: 'black'}}>100 Total Activites</Text>
                </View>
                <Pressable
                  style={{
                    marginTop: 6,
                    width: 160,
                    borderColor: '#686868',
                    borderWidth: 1,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text style={{color: 'black'}}>1 Upcoming</Text>
                </Pressable>
              </View>
            </View>

            <Text style={{color: 'black'}}>Events Available</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {route?.params?.eventsAvailable && Array.isArray(route.params.eventsAvailable) ? (
                route.params.eventsAvailable.map((item, index) => (
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
                    }}>
                    <MaterialCommunityIcons
                      style={{textAlign: 'center'}}
                      name={item.icon}
                      size={24}
                      color="gray"
                    />
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: 10,
                      }}>
                      {item?.name}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{color: 'black'}}>No events available</Text>
              )}
            </ScrollView>
            <Amenities />
            <View style={{marginHorizontal: 10}}>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>
                Activites
              </Text>
              <Pressable
                style={{
                  borderColor: '#787878',
                  marginTop: 10,
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  borderRadius: 5,
                }}>
                <AntDesign name="plus" size={24} color="black" />
                <Text>Create Activity</Text>
              </Pressable>
            </View>
          </>
        </ScrollView>
      </SafeAreaView>

      <Pressable
        style={{
          backgroundColor: 'green',
          padding: 8,
          marginBottom: 30,
          borderRadius: 3,
          marginHorizontal: 15,
          marginTop:10,
        }}>
        <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'white'}}>
          Book Now
        </Text>
      </Pressable>
    </>
  );
};

export default VenueInfoScreen;

const styles = StyleSheet.create({});
