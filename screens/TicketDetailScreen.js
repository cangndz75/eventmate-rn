import React from 'react';
import {View, Text, ScrollView, Image, useWindowDimensions} from 'react-native';
import {useRoute} from '@react-navigation/native';

const TicketDetailScreen = () => {
  const route = useRoute();
  const {event, user} = route.params; // Parametreleri buradan alıyoruz
  const {width} = useWindowDimensions();

  console.log('Image URL:', event?.image); // Kontrol için log ekledik

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
      }}>
      <Image
        source={{uri: event?.image || 'https://via.placeholder.com/400x200'}}
        style={{
          width: width * 0.9,
          height: 200,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onError={e => console.log('Image load error:', e.nativeEvent.error)}
      />

      <View
        style={{
          width: width * 0.9,
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 16,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#333'}}>
          Event
        </Text>
        <Text style={{fontSize: 14, color: '#555', marginTop: 5}}>
          {event?.title || 'No Title'}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 10,
          }}>
          Date
        </Text>
        <Text style={{fontSize: 14, color: '#555', marginTop: 5}}>
          {event?.date || 'No Date'}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 10,
          }}>
          Time
        </Text>
        <Text style={{fontSize: 14, color: '#555', marginTop: 5}}>
          {event?.time || 'No Time'}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 10,
          }}>
          Venue
        </Text>
        <Text style={{fontSize: 14, color: '#555', marginTop: 5}}>
          {event?.location || 'No Location'}
        </Text>
      </View>

      <View
        style={{
          width: width * 0.9,
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 16,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#333'}}>
          Name
        </Text>
        <Text style={{fontSize: 14, color: '#555', marginTop: 5}}>
          {user?.name || 'No Name'}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 10,
          }}>
          Order Number
        </Text>
        <Text style={{fontSize: 14, color: '#555', marginTop: 5}}>
          {user?.orderNumber || 'No Order'}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 10,
          }}>
          Phone
        </Text>
        <Text style={{fontSize: 14, color: '#555', marginTop: 5}}>
          {user?.phone || 'No Phone'}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 10,
          }}>
          Email
        </Text>
        <Text style={{fontSize: 14, color: '#555', marginTop: 5}}>
          {user?.email || 'No Email'}
        </Text>
      </View>
    </ScrollView>
  );
};

export default TicketDetailScreen;
