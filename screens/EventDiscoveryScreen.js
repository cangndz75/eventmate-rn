import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const EventCard = ({event, onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <Image source={{uri: event.image}} style={styles.image} />
    <View style={styles.cardContent}>
      <Text style={styles.title}>{event.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.newPrice}>${event.newPrice}</Text>
        <Text style={styles.oldPrice}>${event.oldPrice}</Text>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#FF5A5F" />
          <Text style={styles.metaText}>{event.distance}</Text>
        </View>
        <MaterialCommunityIcons name="dots-horizontal" size={24} color="#444" />
      </View>
      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name="weather-sunny"
            size={24}
            color="#FDB813"
          />
          <Text style={styles.metaText}>Sunny 24°C</Text>
        </View>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{event.rating}</Text>
          <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const EventDiscoveryScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.example.com/events')
      .then(response => response.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <Text style={styles.header}>Let’s pick your next destination</Text>
      {events.map(event => (
        <EventCard key={event.id} event={event} onPress={() => alert('Event Selected!')} />
      ))}
      <View style={styles.navigation}>
        <MaterialCommunityIcons name="home" size={32} color="white" />
        <TouchableOpacity style={styles.centerButton}>
          <MaterialCommunityIcons name="plus" size={32} color="#fff" />
        </TouchableOpacity>
        <MaterialCommunityIcons name="heart" size={32} color="white" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: width * 0.85,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  newPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#777',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginRight: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
  },
  centerButton: {
    backgroundColor: '#6a11cb',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6a11cb',
  },
});

export default EventDiscoveryScreen;
