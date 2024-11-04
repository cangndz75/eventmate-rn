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
import {useNavigation} from '@react-navigation/native';

const AdminCommunityScreen = () => {
  const [communities, setCommunities] = useState([]);
  const navigation = useNavigation();

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

  const handleManageRequests = communityId => {
    navigation.navigate('AdminManageCommunityScreen', {communityId});
  };

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
          <Text style={{color: 'gray'}}>{community.members.length} Üye</Text>
          <Text style={{marginTop: 5, color: 'gray'}}>
            {community.description}
          </Text>
          <TouchableOpacity
            onPress={() => handleManageRequests(community._id)}
            style={{
              marginTop: 10,
              backgroundColor: '#007bff',
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white'}}>
              Yönet (
              {
                community.joinRequests.filter(req => req.status === 'pending')
                  .length
              }
              )
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default AdminCommunityScreen;
