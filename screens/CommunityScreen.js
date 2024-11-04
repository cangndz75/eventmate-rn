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

const CommunityScreen = () => {
  const [communities, setCommunities] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCommunities = async () => {
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
        console.error('Toplulukları çekerken hata:', error.message);
        Alert.alert('Hata', 'Topluluklar bulunamadı.');
      }
    };
    fetchCommunities();
  }, []);

  const joinCommunity = async communityId => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `https://biletixai.onrender.com/communities/${communityId}/join`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 200) {
        Alert.alert('Başarılı', 'Topluluğa başarıyla katıldınız!');
      }
    } catch (error) {
      console.error('Topluluğa katılırken hata:', error.message);
      Alert.alert('Hata', 'Topluluğa katılırken bir sorun oluştu.');
    }
  };

  const goToCommunityDetail = communityId => {
    navigation.navigate('CommunityDetailScreen', {communityId});
  };

  return (
    <ScrollView>
      {communities.map(community => (
        <TouchableOpacity
          key={community._id}
          onPress={() => goToCommunityDetail(community._id)}>
          <View style={{padding: 20, alignItems: 'center'}}>
            <Image
              source={{
                uri:
                  community.profileImage || 'https://via.placeholder.com/100',
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
            <TouchableOpacity
              onPress={() => joinCommunity(community._id)}
              style={{
                marginTop: 10,
                backgroundColor: '#007bff',
                padding: 10,
                borderRadius: 5,
              }}>
              <Text style={{color: 'white'}}>Topluluğa Katıl</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CommunityScreen;
