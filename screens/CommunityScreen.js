import React, {useCallback, useState, useEffect, useContext} from 'react';
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
import {AuthContext} from '../AuthContext';

const CommunityScreen = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const {userId, setToken, setUserId} = useContext(AuthContext);

  const fetchUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');

      if (storedToken && storedUserId) {
        const response = await axios.get(
          `http://10.0.2.2:8000/user/${storedUserId}`,
          {
            headers: {Authorization: `Bearer ${storedToken}`},
          },
        );
        setUser(response.data);
      } else {
        Alert.alert('Hata', 'Giriş yapmanız gerekiyor.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Kullanıcı verilerini yüklerken hata:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    } else {
      navigation.navigate('Login');
    }
  }, [userId]);

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
        onPress={() => handleNavigation(community._id)}
        style={{
          marginTop: 10,
          backgroundColor: '#007bff',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white'}}>Detay</Text>
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
