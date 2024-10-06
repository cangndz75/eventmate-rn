import {
  SafeAreaView,
  View,
  Image,
  Pressable,
  Text,
} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

const AttendeesScreen = () => {
  const route = useRoute();
  const attendees = route?.params?.attendees || []; // Katılımcıları route üzerinden al

  return (
    <SafeAreaView>
      <View
        style={{
          padding: 10,
          backgroundColor: '#294461',
          paddingBottom: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Entypo name="share" size={24} color="white" />
            <Entypo name="dots-three-vertical" size={24} color="white" />
          </View>
        </View>

        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 19, fontWeight: '500', color: 'white'}}>
            Attendees ({attendees.length})
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Ionicons name="earth" size={24} color="white" />
            <Text style={{color: 'white'}}>Public</Text>
          </View>
        </View>
      </View>

      <View style={{padding: 12}}>
        {attendees.length === 0 ? (
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 6,
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '500', fontSize: 16}}>
              No attendees
            </Text>
          </View>
        ) : (
          attendees.map((item, index) => (
            <Pressable
              key={index}
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <View>
                <Image
                  style={{width: 60, height: 60, borderRadius: 30}}
                  source={{uri: item?.image}}
                />
              </View>
              <View>
                <Text>
                  {item?.firstName} {item?.lastName}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginTop: 10,
                    borderRadius: 20,
                    borderColor: 'orange',
                    borderWidth: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <Text style={{fontSize: 13, fontWeight: '400'}}>
                    INTERMEDIATE
                  </Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </SafeAreaView>
  );
};

export default AttendeesScreen;
