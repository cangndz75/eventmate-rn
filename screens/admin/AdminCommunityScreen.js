import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminCommunityScreen = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchOrganizerCommunities = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          'https://biletixai.onrender.com/communities',
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        setCommunities(response.data);
      } catch (error) {
        console.error(
          'Toplulukları çekerken hata:',
          error.message,
          error.response ? error.response.data : 'Sunucuya erişim yok',
        );
        Alert.alert('Hata', 'Topluluklar bulunamadı.');
      }
    };
    fetchOrganizerCommunities();
  }, []);

  return (
    <ScrollView>
      {communities.map(community => (
        <View key={community._id} style={{padding: 20, alignItems: 'center'}}>
          <Image
            source={{
              uri: community.profileImage || 'https://via.placeholder.com/100',
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 10,
            }}
          />
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>
            {community.name}
          </Text>
          <Text style={{color: 'gray'}}>{community.membersCount} Üye</Text>
          <Text style={{marginTop: 5, color: 'gray'}}>
            {community.description}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default AdminCommunityScreen;
