import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';

const Event = ({item}) => {
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);

  return (
    <Pressable
      style={{
        marginVertical: 10,
        marginHorizontal: 14,
        padding: 14,
        backgroundColor: 'white',
        borderRadius: 10,
      }}
      onPress={() => navigation.navigate('Event', {item, user})}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{color: 'black', fontSize: 15, fontWeight: '500'}}>
          {item?.title}
        </Text>
        <Feather name="bookmark" size={24} color="black" />
      </View>
      <View style={{marginTop: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{width: 56, height: 56, borderRadius: 26}}
              source={{
                uri: item?.organizerUrl,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: -7,
              }}>
              {item?.attendees
                ?.filter(c => c?.name !== item?.organizerName)
                ?.map(attendee => (
                  <Image
                    key={attendee?._id}
                    source={{uri: attendee?.imageUrl}}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      marginLeft: -7,
                    }}
                  />
                ))}
            </View>
          </View>
          <View style={{marginLeft: 10, flex: 1}}>
            <Text style={{color: 'black'}}>
              · {item?.attendees?.length}/{item?.totalParticipants} going
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: '#fffbde',
              borderRadius: 8,
              borderColor: '#eedc82',
              borderWidth: 1,
            }}>
            <Text style={{color: 'gray', fontWeight: '500'}}>
              Only {item?.totalParticipants - item?.attendees?.length} spots
              left
            </Text>
          </View>
        </View>
        <View>
          <View>
            <Text style={{marginTop: 10, colo: 'gray', fontSize: 15}}>
              Organizasyon : {item?.organizerName}
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 14,
                color: 'black',
                fontWeight: '500',
              }}>
              {item?.date}, {item?.time}
            </Text>
          </View>
        </View>
        {item?.isFull && (
          <Image
            style={{width: 100, height: 70, resizeMode: 'contain'}}
            source={{
              uri: 'https://playo.co/img/logos/logo-green-1.svg',
            }}
          />
        )}
      </View>
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
        }}>
        <SimpleLineIcons name="location-pin" size={24} color="black" />
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{fontSize: 15, flex: 1, color: 'black'}}>
          {item?.location}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: '#E0E0E0',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 5,
            marginTop: 12,
            alignSelf: 'flex-start',
          }}>
          <Text style={{fontSize: 13, fontWeight: '400', color: 'black'}}>
            Intermediate to Advanced
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Event;

const styles = StyleSheet.create({});
