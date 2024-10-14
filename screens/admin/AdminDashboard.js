import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const AdminDashboard = () => {
  const navigation = useNavigation();
  const [recentParticipants, setRecentParticipants] = useState([]);

  // Fetch recent participants
  useEffect(() => {
    fetchRecentParticipants();
  }, []);

  const fetchRecentParticipants = async () => {
    try {
      const response = await axios.get(
        'http://10.0.2.2:8000/recent-participants',
      );
      setRecentParticipants(response.data);
    } catch (error) {
      console.error('Error fetching recent participants2:', error);
    }
  };

const dashboardItems = [
    {title: 'Create', icon: 'add-circle-outline', route: 'AdminCreate'},
    {title: 'My Events', icon: 'calendar-outline', route: 'AdminEvents'},
    {title: 'Attends', icon: 'people-outline', route: 'Attends'},
    {title: 'Reports', icon: 'bar-chart-outline', route: 'Reports'},
    {title: 'Settings', icon: 'settings-outline', route: 'Settings'},
];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Horizontal Dashboard Items */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}>
          {dashboardItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dashboardItem}
              onPress={() => navigation.navigate(item.route)}>
              <Ionicons name={item.icon} size={28} color="#FFF" />
              <Text style={styles.dashboardItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dashboard Cards */}
        <View style={styles.dashboardGrid}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>$12,487</Text>
            <Text style={styles.cardSubTitle}>+864 Comp.</Text>
            <Text style={styles.cardPercentage}>+24%</Text>
          </View>
          <View style={[styles.card, styles.highlightCard]}>
            <Text style={styles.cardTitle}>35%</Text>
            <Text style={styles.cardSubTitle}>Desktop users</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dark Mode</Text>
            <Text style={styles.cardSubTitle}>Enabled</Text>
            <TouchableOpacity style={styles.toggleSwitch}>
              <View style={styles.toggleCircle} />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>New Sale!</Text>
            <Text style={styles.cardSubTitle}>+24,685</Text>
          </View>
        </View>

        {/* Recent Participants */}
        <Text style={styles.recentTitle}>Recent Participants</Text>
        <FlatList
          horizontal
          data={recentParticipants}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.participant}>
              <Image
                source={{uri: item.image}}
                style={styles.participantImage}
              />
              <Text style={styles.participantName}>{item.name}</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    padding: 16,
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  dashboardItem: {
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    width: 100,
  },
  dashboardItemText: {
    color: '#FFF',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    backgroundColor: '#333',
    width: '48%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  highlightCard: {
    backgroundColor: '#ff6b81',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardSubTitle: {
    color: '#ddd',
    marginTop: 5,
  },
  cardPercentage: {
    color: '#76e48f',
    fontSize: 16,
    marginTop: 8,
  },
  toggleSwitch: {
    backgroundColor: '#555',
    borderRadius: 20,
    width: 50,
    height: 25,
    marginTop: 10,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleCircle: {
    backgroundColor: '#03C03C',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  recentTitle: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 8,
  },
  participant: {
    alignItems: 'center',
    marginRight: 12,
  },
  participantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  participantName: {
    color: '#FFF',
    marginTop: 6,
    fontSize: 12,
  },
});
