import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommunityScreen = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // Kullanıcı bilgilerini tutmak için
  const navigation = useNavigation();

  // Kullanıcı bilgilerini ve token'i yükleme
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          Alert.alert('Hata', 'Giriş yapmanız gerekiyor.');
          navigation.navigate('Login'); // Giriş ekranına yönlendirme
        }
      } catch (error) {
        console.error('Kullanıcı verilerini yüklerken hata:', error);
      }
    };

    loadUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCommunities();
    }, []),
  );

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://biletixai.onrender.com/communities',
      );
      setCommunities(response.data);
    } catch (error) {
      console.error('Toplulukları çekerken hata:', error.message);
      Alert.alert('Hata', 'Topluluklar bulunamadı.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCommunities();
    setRefreshing(false);
  };

  const handleJoinCommunity = async communityId => {
    if (!token) {
      Alert.alert('Hata', 'Giriş yapmanız gerekiyor.');
      return;
    }

    try {
      const response = await axios.post(
        `https://biletixai.onrender.com/communities/${communityId}/join`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (response.status === 200) {
        Alert.alert('Başarılı', 'Topluluğa başarıyla katıldınız!');
        fetchCommunities(); // Toplulukları yenile
      }
    } catch (error) {
      console.error('Topluluğa katılırken hata:', error.message);
      Alert.alert('Hata', 'Topluluğa katılırken bir sorun oluştu.');
    }
  };

  const handleNavigation = communityId => {
    navigation.navigate('CommunityDetailScreen', {communityId});
  };

  const renderCommunityItem = ({item: community}) => (
    <Pressable
      onPress={() => handleNavigation(community._id)}
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
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{width: 80, height: 80, borderRadius: 12, marginRight: 12}}
          source={{
            uri: community.profileImage || 'https://via.placeholder.com/100',
          }}
        />
        <View style={{flex: 1}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#333'}}>
            {community.name}
          </Text>
          <Text style={{fontSize: 14, color: '#777', marginVertical: 4}}>
            {community.membersCount} Üye
          </Text>
          {community.organizer && (
            <Text style={{fontSize: 14, color: '#999'}}>
              Organizator: {community.organizer.firstName}{' '}
              {community.organizer.lastName}
            </Text>
          )}
        </View>
      </View>
      <Pressable
        onPress={() =>
          community.isPrivate
            ? Alert.alert(
                'Gizli Topluluk',
                'Soruları yanıtlayarak katılma isteği gönderebilirsiniz.',
              )
            : handleJoinCommunity(community._id)
        }
        style={{
          marginTop: 10,
          backgroundColor: '#007bff',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white'}}>
          {community.isPrivate ? 'Katılma İsteği Gönder' : 'Topluluğa Katıl'}
        </Text>
      </Pressable>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#07bc0c" />
      </View>
    );
  }

  return (
    <FlatList
      data={communities}
      renderItem={renderCommunityItem}
      keyExtractor={item => item._id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default CommunityScreen;
