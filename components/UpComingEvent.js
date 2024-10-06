import { Image, Pressable, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const UpComingEvent = ({ item }) => {
  const navigation = useNavigation();

  if (!item) {
    return null;
  }

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('Event', {
          item: item,
        })
      }
      style={{
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      }}>
      {/* Event Date */}
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: '#FF6347',
          marginBottom: 6,
        }}>
        {item?.date}
      </Text>

      {/* Event Image and Info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image
          style={{ width: 80, height: 80, borderRadius: 10 }}
          source={{ uri: item?.organizerUrl }}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#333',
            }}>
            {item?.title}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: '#777',
              marginVertical: 4,
            }}>
            {item?.location}
          </Text>

          <Text style={{ fontSize: 12, color: '#888' }}>
            Hosted by {item?.organizerName}
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#FF6347' }}>
            {item?.attendees?.length}
          </Text>
          <Text style={{ fontSize: 12, color: '#FF6347' }}>Going</Text>
        </View>
      </View>

      {/* Event Action Area */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
        }}>
        {item?.isBooked ? (
          <View
            style={{
              backgroundColor: '#56cc79',
              paddingVertical: 5,
              paddingHorizontal: 15,
              borderRadius: 8,
            }}>
            <Text style={{ color: 'white', fontWeight: '500' }}>Booked</Text>
          </View>
        ) : (
          <Text style={{ fontWeight: '500', color: '#888' }}>{item?.time}</Text>
        )}

        <Pressable
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: '#FF6347',
            borderRadius: 8,
          }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Join</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default UpComingEvent;
