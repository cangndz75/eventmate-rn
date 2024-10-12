import {Image, Pressable, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../AuthContext'; 

const UpComingEvent = ({item}) => {
  const navigation = useNavigation();
  const {role} = useContext(AuthContext); 

  if (!item) return null;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(
          role === 'organizer' ? 'AdminEventSetUp' : 'EventSetup',
          {item},
        )
      }
      style={{
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
      }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: '#FF6347',
          marginBottom: 8,
        }}>
        {new Date(item?.date).toDateString()}
      </Text>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{width: 80, height: 80, borderRadius: 12, marginRight: 12}}
          source={{uri: item?.organizerUrl}}
        />

        <View style={{flex: 1}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#333'}}>
            {item?.title}
          </Text>
          <Text style={{fontSize: 14, color: '#777', marginVertical: 4}}>
            {item?.location}
          </Text>
          <Text style={{fontSize: 14, color: '#999'}}>
            Hosted by {item?.organizerName}
          </Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FF6347'}}>
            {item?.attendees?.length}
          </Text>
          <Text style={{fontSize: 12, color: '#FF6347'}}>Going</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        }}>
        <Text style={{fontSize: 14, fontWeight: '500', color: '#888'}}>
          {item?.time}
        </Text>

        <Pressable
          style={{
            backgroundColor: item?.isBooked ? '#56cc79' : '#FF6347',
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 10,
          }}>
          <Text style={{color: 'white', fontWeight: '600'}}>
            {item?.isBooked ? 'Booked' : 'Join'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default UpComingEvent;
