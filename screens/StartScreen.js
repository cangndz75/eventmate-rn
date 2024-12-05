import {
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
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
    <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
      <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 20}}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#d32f2f',
            marginBottom: 20,
          }}>
          Login
        </Text>
        <TextInput
          placeholder="Email"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            marginVertical: 10,
            borderRadius: 5,
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            marginVertical: 10,
            borderRadius: 5,
          }}
          secureTextEntry
        />
        <Pressable
          style={{
            backgroundColor: '#d32f2f',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
            marginVertical: 10,
          }}
          onPress={() => navigation.navigate('Home')}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Login</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={{textAlign: 'center', color: '#666'}}>
            Don’t have an account? Sign up
          </Text>
        </Pressable>
        <Pressable onPress={() => alert('Forgot password?')}>
          <Text style={{textAlign: 'center', color: '#666', marginTop: 5}}>
            Forgot Password?
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default StartScreen;
