import {Image, Pressable, SafeAreaView, Text, View} from 'react-native';
import React, {useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';

const StartScreen = () => {
  const navigation = useNavigation();
  const mapView = useRef(null);
  const users = [
    {
      image:
        'https://images.pexels.com/photos/7208625/pexels-photo-7208625.jpeg?auto=compress&cs=tinysrgb&w=800',
      id: '1',
      latitude: 40.8875,
      longitude: 29.1847,
      name: 'Sujan',
      description: 'Hey!',
    },
    {
      image:
        'https://images.pexels.com/photos/2913125/pexels-photo-2913125.jpeg?auto=compress&cs=tinysrgb&w=800',
      id: '2',
      latitude: 40.888,
      longitude: 29.185,
      name: 'Suhas',
      description: "Let's play",
    },
    {
      image:
        'https://images.pexels.com/photos/1042140/pexels-photo-1042140.jpeg?auto=compress&cs=tinysrgb&w=800',
      id: '3',
      latitude: 40.8885,
      longitude: 29.1855,
      name: 'Ashish',
      description: "I'm always",
    },
    {
      image:
        'https://images.pexels.com/photos/4307678/pexels-photo-4307678.jpeg?auto=compress&cs=tinysrgb&w=800',
      id: '4',
      latitude: 40.889,
      longitude: 29.186,
      name: 'Abhi',
      description: 'At 8pm?',
    },
    {
      image:
        'https://images.pexels.com/photos/1379031/pexels-photo-1379031.jpeg?auto=compress&cs=tinysrgb&w=800',
      id: '5',
      latitude: 40.8895,
      longitude: 29.1865,
      name: 'Akash',
      description: 'Hey!',
    },
    {
      image:
        'https://images.pexels.com/photos/3264235/pexels-photo-3264235.jpeg?auto=compress&cs=tinysrgb&w=800',
      id: '6',
      latitude: 40.89,
      longitude: 29.187,
      name: 'Preetham',
      description: 'What up?',
    },
  ];

  const KARTAL_COORDS = {
    latitude: 40.887334,
    longitude: 29.184348,
  };

  const onMapReady = () => {
    if (mapView.current) {
      mapView.current.fitToCoordinates(
        users.map(user => ({
          latitude: user.latitude,
          longitude: user.longitude,
        })),
        {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        },
      );
    }
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
        <MapView
          ref={mapView}
          style={{width: '100%', height: '45%'}}
          initialRegion={{
            latitude: KARTAL_COORDS.latitude,
            longitude: KARTAL_COORDS.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onMapReady={onMapReady}>
          {users.map(user => (
            <Marker
              key={user.id}
              coordinate={{latitude: user.latitude, longitude: user.longitude}}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                  source={{ uri: user.image || 'https://via.placeholder.com/150' }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: 'white',
                  }}
                />
                <Text
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                    borderRadius: 5,
                    textAlign: 'center',
                    marginTop: 5,
                    fontSize: 12,
                    color: '#333',
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: {width: 0, height: 2},
                    shadowRadius: 2,
                  }}>
                  {user.description}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>

        <View
          style={{
            alignItems: 'center',
            padding: 25,
            backgroundColor: '#fff',
            flex: 1,
            marginTop: -10,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: {width: 0, height: -5},
            shadowRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#333',
            }}>
            Find Players in your neighbourhood
          </Text>
          <Text style={{fontSize: 16, color: '#666', marginBottom: 20}}>
            Just like you did as a kid!
          </Text>
          <Image
            source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp4StDYFfxq27RMKG7uFJ6GptDm5KDGmGKsA&s'}}
            style={{
              width: 120,
              height: 40,
              marginTop: 20,
              resizeMode: 'contain',
            }}
          />
        </View>

        <Pressable
          style={{
            padding: 10,
            borderRadius: 8,
            marginHorizontal: 30,
            alignItems: 'center',
            marginBottom: 15,
          }}
          onPress={() => navigation.navigate('Login')}>
          <Text style={{fontSize: 16, color: 'gray', fontWeight: 'bold'}}>
            Already have an account? Login
          </Text>
        </Pressable>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp4StDYFfxq27RMKG7uFJ6GptDm5KDGmGKsA&s' || 'https://via.placeholder.com/150',
            }}
            style={{ width: 120, height: 40, marginTop: 20, resizeMode: 'contain' }}
          />
        </View>
      </SafeAreaView>

      <View style={{padding: 10, backgroundColor: 'white', marginTop: 'auto'}}>
        <Pressable
          onPress={() => navigation.navigate('Register')}
          style={{
            backgroundColor: '#fff',
            padding: 12,
            borderRadius: 7,
            borderWidth: 2,
            borderColor: '#000',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#000',
              fontWeight: '500',
              marginRight: 10,
            }}>
            READY
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default StartScreen;
