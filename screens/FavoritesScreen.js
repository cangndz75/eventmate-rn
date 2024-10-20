import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ToastAndroid,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import {BottomModal, ModalContent, SlideAnimation} from 'react-native-modals';
import {RefreshControl} from 'react-native';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const {userId} = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    } else {
      console.log('User ID not found');
    }
  }, [userId]);

  const fetchFavorites = async () => {
    try {
      console.log('Fetching favorites for userId:', userId);
      const response = await axios.get(
        `http://10.0.2.2:8000/favorites/${userId}`,
      );
      const favoriteEvents = await Promise.all(
        response.data.map(async favorite => {
          const eventResponse = await axios.get(
            `http://10.0.2.2:8000/events/${favorite._id}`,
          );
          return eventResponse.data;
        }),
      );
      setFavorites(favoriteEvents);
    } catch (error) {
      console.error(
        'Failed to fetch favorites:',
        error.response ? error.response.data : error.message,
      );
      ToastAndroid.show('Failed to load favorites.', ToastAndroid.SHORT);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, []),
  );

  const removeFromFavorites = async eventId => {
    try {
      await axios.post(`http://10.0.2.2:8000/favorites`, {
        userId,
        eventId,
      });
      ToastAndroid.show('Removed from favorites', ToastAndroid.SHORT);
      setFavorites(prevFavorites =>
        prevFavorites.filter(event => event._id !== eventId),
      );
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      ToastAndroid.show('Failed to remove from favorites.', ToastAndroid.SHORT);
    }
  };

  const openRemoveModal = event => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const renderFavoriteItem = ({item}) => (
    <Pressable
      onPress={() => navigation.navigate('EventSetup', {item})}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}>
      <Image
        style={{width: 60, height: 60, borderRadius: 8, marginRight: 10}}
        source={{uri: item.images?.[0] || 'https://via.placeholder.com/150'}}
      />
      <View style={{flex: 1}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.title}</Text>
        <Text style={{fontSize: 14, color: '#888'}}>{item.date}</Text>
        <Text style={{fontSize: 12, color: '#aaa'}}>{item.location}</Text>
      </View>
      <Pressable onPress={() => openRemoveModal(item)}>
        <Ionicons name="heart" size={24} color="red" />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={{flex: 1, padding: 20, backgroundColor: '#fff'}}>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10}}>
        Your Favorites
      </Text>
      {error ? (
        <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>
      ) : favorites.length === 0 ? (
        <Text style={{textAlign: 'center', color: '#777'}}>
          No favorites yet
        </Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <BottomModal
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(false)}
        swipeDirection={['up', 'down']}
        modalAnimation={new SlideAnimation({slideFrom: 'bottom'})}>
        <ModalContent style={{padding: 20, alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>
            Remove from Favorites?
          </Text>
          {selectedEvent && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Image
                source={{
                  uri:
                    selectedEvent.images?.[0] ||
                    'https://via.placeholder.com/150',
                }}
                style={{width: 60, height: 60, borderRadius: 8}}
              />
              <View style={{marginLeft: 10}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {selectedEvent.title}
                </Text>
                <Text style={{fontSize: 14, color: '#888'}}>
                  {selectedEvent.date}
                </Text>
                <Text style={{fontSize: 12, color: '#aaa'}}>
                  {selectedEvent.location}
                </Text>
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Pressable
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 8,
                backgroundColor: '#ddd',
                marginRight: 10,
                alignItems: 'center',
              }}
              onPress={() => setModalVisible(false)}>
              <Text style={{color: '#333', fontWeight: '500'}}>Cancel</Text>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 8,
                backgroundColor: '#f00',
                alignItems: 'center',
              }}
              onPress={() => removeFromFavorites(selectedEvent._id)}>
              <Text style={{color: '#fff', fontWeight: '500'}}>
                Yes, Remove
              </Text>
            </Pressable>
          </View>
        </ModalContent>
      </BottomModal>
    </View>
  );
};

export default FavoritesScreen;
