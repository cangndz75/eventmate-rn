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

const CommunityScreen = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(
          'https://biletixai.onrender.com/communities',
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
    fetchCommunities();
  }, []);

  const joinCommunity = async communityId => {
    try {
      const response = await axios.post(
        `https://biletixai.onrender.com/communities/${communityId}/join`,
      );
      if (response.status === 200) {
        Alert.alert('Başarılı', 'Topluluğa başarıyla katıldınız!');
      }
    } catch (error) {
      console.error('Topluluğa katılırken hata:', error.message);
      if (error.response && error.response.status === 400) {
        Alert.alert('Hata', 'Zaten bu topluluğa katıldınız.');
      } else {
        Alert.alert('Hata', 'Topluluğa katılırken bir sorun oluştu.');
      }
    }
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
      ))}
    </ScrollView>
  );
};

export default CommunityScreen;
