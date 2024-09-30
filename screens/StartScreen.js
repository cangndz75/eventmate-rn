import { Image, SafeAreaView, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';

const StartScreen = () => {
  const mapView = React.useRef(null);
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
      latitude: 40.8880,
      longitude: 29.1850,
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
      latitude: 40.8890,
      longitude: 29.1860,
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
      latitude: 40.8900,
      longitude: 29.1870,
      name: 'Preetham',
      description: 'What up?',
    },
  ];

  const KARTAL_COORDS = {
    latitude: 40.887334,
    longitude: 29.184348,
  };

  useEffect(() => {
    mapView.current.fitToCoordinates(
      users.map((user) => ({
        latitude: user.latitude,
        longitude: user.longitude,
      })),
      {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      }
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        ref={mapView}
        style={{ width: '100%', height: '50%' }}
        initialRegion={{
          latitude: KARTAL_COORDS.latitude,
          longitude: KARTAL_COORDS.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {users.map((user) => (
          <Marker key={user.id} coordinate={{ latitude: user.latitude, longitude: user.longitude }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={{ uri: user.image }}
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
                }}>
                {user.description}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>
      <View style={{ alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9', flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
          Find Player in your neighbourhood
        </Text>
        <Text style={{ fontSize: 16, color: '#666', marginBottom: 20 }}>Just like you did as a kid!</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>
          Already have an account?{' '}
          <Text style={{ color: '#1e90ff', fontWeight: 'bold' }}>Login</Text>
        </Text>
        <Image
          source={{ uri: 'https://playo.co/img/logos/logo-green-1.svg' }}
          style={{ width: 120, height: 40, marginTop: 20, resizeMode: 'contain' }}
        />
      </View>
    </SafeAreaView>
  );
};

export default StartScreen;
