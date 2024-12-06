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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const AdminDashboard = () => {
  const navigation = useNavigation();
  const [recentParticipants, setRecentParticipants] = useState([]);
  const [darkMode, setDarkMode] = useState(true); 

  const dashboardItems = [
    {title: 'Create', icon: 'add-circle-outline', route: 'AdminCreate'},
    {title: 'My Events', icon: 'calendar-outline', route: 'AdminEvents'},
    {title: 'Attends', icon: 'people-outline', route: 'Attends'},
    {title: 'Communities', icon: 'people-outline', route: 'AdminCommunityScreen'},
    {title: 'My Communities', icon: 'people-outline', route: 'AdminCreateCommunity'},
    {title: 'Settings', icon: 'settings-outline', route: 'Settings'},
  ];

  useEffect(() => {
    const loadThemePreference = async () => {
      const savedMode = await AsyncStorage.getItem('theme');
      setDarkMode(savedMode === 'dark'); 
    };
    loadThemePreference();
  }, []);

  useEffect(() => {
    fetchRecentParticipants();
  }, []);

  const fetchRecentParticipants = async () => {
    try {
      const response = await axios.get(
        'https://eventmate-rn.onrender.com/recent-participants',
      );
      setRecentParticipants(response.data);
    } catch (error) {
      console.error('Error fetching recent participants:', error);
    }
  };

  const toggleTheme = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const styles = getStyles(darkMode); 

  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken('');
      setUserId('');
      navigation.navigate('Start');
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
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

        <View style={styles.themeToggleContainer}>
          <Text style={styles.cardSubTitle}>
            {darkMode ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <TouchableOpacity style={styles.toggleSwitch} onPress={toggleTheme}>
            <View
              style={[
                styles.toggleCircle,
                darkMode ? styles.toggleCircleDark : styles.toggleCircleLight,
              ]}
            />
          </TouchableOpacity>
        </View>

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
          <View style={[styles.card,styles.highlightCard]}>
            <TouchableOpacity
            style={styles.optionContainer}
            onPress={clearAuthToken}>
            <View style={styles.iconContainer}>
              <Ionicons name="log-out-outline" size={24} color="red" />
            </View>
            <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
          </View>
        </View>

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

const getStyles = darkMode =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#1a1a1a' : '#f8f8f8',
    },
    scrollView: {
      padding: 16,
    },
    horizontalScroll: {
      marginBottom: 16,
    },
    dashboardItem: {
      backgroundColor: darkMode ? '#444' : '#ddd',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      width: 100,
    },
    dashboardItemText: {
      color: darkMode ? '#FFF' : '#333',
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
      backgroundColor: darkMode ? '#333' : '#FFF',
      width: '48%',
      borderRadius: 10,
      padding: 20,
      marginBottom: 10,
    },
    highlightCard: {
      backgroundColor: darkMode ? '#ff6b81' : '#ffa1c5',
    },
    cardTitle: {
      color: darkMode ? '#FFF' : '#333',
      fontSize: 22,
      fontWeight: 'bold',
    },
    cardSubTitle: {
      color: darkMode ? '#ddd' : '#555',
      marginTop: 5,
    },
    cardPercentage: {
      color: darkMode ? '#76e48f' : '#4caf50',
      fontSize: 16,
      marginTop: 8,
    },
    themeToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    toggleSwitch: {
      backgroundColor: darkMode ? '#555' : '#ccc',
      borderRadius: 20,
      width: 50,
      height: 25,
      marginLeft: 10,
      justifyContent: darkMode ? 'flex-end' : 'flex-start',
      paddingHorizontal: 3,
    },
    toggleCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    toggleCircleDark: {
      backgroundColor: '#03C03C',
    },
    toggleCircleLight: {
      backgroundColor: '#FFF',
    },
    recentTitle: {
      color: darkMode ? '#FFF' : '#333',
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
      borderColor: darkMode ? '#FFF' : '#333',
    },
    participantName: {
      color: darkMode ? '#FFF' : '#333',
      marginTop: 6,
      fontSize: 12,
    },
  });
