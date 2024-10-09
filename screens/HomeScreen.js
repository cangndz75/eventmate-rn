import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {AuthContext} from '../AuthContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {userId, favorites, setFavorites} = useContext(AuthContext);
  const [eventList, setEventList] = useState([]);
  const [popularEvent, setPopularEvent] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu-outline" size={30} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events from server...');
      const eventListResponse = await axios.get('http://10.0.2.2:8000/events');
      const events = eventListResponse.data;
      setEventList(events);
      if (events.length > 0) {
        setPopularEvent(events[0]);
      }
      console.log('Events fetched successfully:', events);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };
  

  const toggleFavorite = async eventId => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];

      const isFavorite = favoritesArray.includes(eventId);
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = favoritesArray.filter(id => id !== eventId);
      } else {
        updatedFavorites = [...favoritesArray, eventId];
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      await axios.post('http://10.0.2.2:8000/favorites', {userId, eventId});
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      {/* Öne Çıkan Etkinlik */}
      {popularEvent && (
        <View style={styles.featuredEventContainer}>
          <Pressable
            onPress={() => navigation.navigate('Event', {item: popularEvent})}
            style={styles.featuredEventCard}>
            <ImageBackground
              source={{uri: popularEvent.organizerUrl}}
              style={styles.featuredEventImage}
              imageStyle={{borderRadius: 15}}>
              <Pressable
                onPress={() => toggleFavorite(popularEvent._id)}
                style={styles.favoriteButton}>
                <Ionicons
                  name="heart"
                  size={24}
                  color={
                    favorites.includes(popularEvent._id) ? 'red' : 'transparent'
                  }
                />
              </Pressable>
            </ImageBackground>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{popularEvent.title}</Text>
              <Text style={styles.eventDate}>{popularEvent.date}</Text>
              <View style={styles.eventLocation}>
                <Ionicons name="location-outline" size={16} color="#777" />
                <Text style={styles.locationText}>{popularEvent.location}</Text>
              </View>
              <View style={styles.attendees}>
                {popularEvent.attendees.slice(0, 3).map((attendee, index) => (
                  <Image
                    key={index}
                    source={{uri: attendee.imageUrl}}
                    style={[
                      styles.attendeeImage,
                      {marginLeft: index === 0 ? 0 : -10},
                    ]}
                  />
                ))}
                <Text style={styles.attendeeCount}>
                  {popularEvent.attendees.length} Katılıyor
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      )}

      {/* Etkinlik Listesi */}
      <View style={styles.eventListContainer}>
        {eventList.slice(1).map(item => (
          <Pressable
            key={item._id}
            onPress={() => navigation.navigate('Event', {item})}
            style={styles.eventCard}>
            <Image
              source={{uri: item.organizerUrl}}
              style={styles.eventCardImage}
            />
            <View style={styles.eventCardInfo}>
              <Text style={styles.eventCardTitle}>{item.title}</Text>
              <Text style={styles.eventCardDate}>{item.date}</Text>
              <View style={styles.eventCardLocation}>
                <Ionicons name="location-outline" size={16} color="#777" />
                <Text style={styles.eventCardLocationText}>
                  {item.location}
                </Text>
              </View>
              <View style={styles.eventCardAttendees}>
                {item.attendees.slice(0, 3).map((attendee, index) => (
                  <Image
                    key={index}
                    source={{uri: attendee.imageUrl}}
                    style={[
                      styles.attendeeImage,
                      {marginLeft: index === 0 ? 0 : -10},
                    ]}
                  />
                ))}
                <Text style={styles.attendeeCount}>
                  {item.attendees.length} Katılıyor
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => toggleFavorite(item._id)}
              style={styles.favoriteButton}>
              <Ionicons
                name="heart"
                size={24}
                color={favorites.includes(item._id) ? 'red' : 'transparent'}
              />
            </Pressable>
          </Pressable>
        ))}
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Text style={styles.bannerText}>Arkadaşlarını davet et</Text>
        <Pressable style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Davet Et</Text>
        </Pressable>
      </View>

      {/* Özel Fırsatlar */}
      <View style={styles.specialDealContainer}>
        <Text style={styles.sectionTitle}>Özel Fırsatlar</Text>
        {eventList.slice(1, 4).map(deal => (
          <Pressable
            key={deal._id}
            onPress={() => navigation.navigate('Event', {item: deal})}
            style={styles.dealCard}>
            <View style={styles.dealInfo}>
              <Text style={styles.dealTitle}>{deal.title}</Text>
              <Text style={styles.dealDate}>{deal.date}</Text>
              <Text style={styles.dealPrice}>₺{deal.price}</Text>
            </View>
            <Image source={{uri: deal.organizerUrl}} style={styles.dealImage} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  headerText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  featuredEventContainer: {
    padding: 15,
  },
  featuredEventCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  featuredEventImage: {
    height: 220,
    justifyContent: 'flex-end',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  locationText: {
    marginLeft: 5,
    color: '#777',
    fontSize: 14,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  attendeeImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  attendeeCount: {
    marginLeft: 15,
    color: '#777',
    fontSize: 14,
  },
  eventListContainer: {
    paddingHorizontal: 15,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  eventCardImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  eventCardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  eventCardDate: {
    fontSize: 13,
    color: '#777',
    marginVertical: 2,
  },
  eventCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventCardLocationText: {
    marginLeft: 5,
    color: '#777',
    fontSize: 13,
  },
  eventCardAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  bannerContainer: {
    marginTop: 20,
    marginHorizontal: 15,
    padding: 20,
    backgroundColor: '#d0e8ff',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bannerButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#42a5f5',
    borderRadius: 8,
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  specialDealContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  dealInfo: {
    flex: 1,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dealDate: {
    fontSize: 13,
    color: '#777',
    marginVertical: 2,
  },
  dealPrice: {
    fontSize: 16,
    color: '#00c853',
    fontWeight: '700',
    marginTop: 5,
  },
  dealImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
    marginLeft: 10,
  },
  favoriteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#777', // Daha koyu bir kenarlık
    backgroundColor: '#f0f0f0', // Açık gri arka plan
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    right: 15,
  },

  favoriteButtonActive: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
});
