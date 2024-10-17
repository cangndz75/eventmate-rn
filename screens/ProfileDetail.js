import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useContext, useState, useCallback} from 'react';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageViewing from 'react-native-image-viewing';

const ProfileDetailScreen = () => {
  const [user, setUser] = useState('');
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const {userId, token, setToken, setUserId} = useContext(AuthContext);

  // Fetch user data function
  const fetchUser = async () => {
    try {
      console.log('Fetching data for user:', userId);
      const response = await axios.get(`http://10.0.2.2:8000/user/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Ensure the data refreshes whenever the user navigates to this screen
  useFocusEffect(
    useCallback(() => {
      fetchUser(); // Fetch data when the screen is focused
    }, [userId]),
  );

  // Clear authentication token on logout
  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken('');
      setUserId('');
      navigation.replace('Start'); // Redirect to the Start screen
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const images = [
    {
      uri: user?.user?.image || 'https://via.placeholder.com/150',
    },
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={{paddingBottom: 20}}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 12,
            margin: 12,
            borderRadius: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 20,
            }}>
            <Pressable onPress={() => setVisible(true)}>
              <Image
                style={{width: 70, height: 70, borderRadius: 35}}
                source={{
                  uri: user?.user?.image || 'https://via.placeholder.com/150',
                }}
              />
            </Pressable>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 30,
                justifyContent: 'space-around',
                width: '80%',
              }}>
              <View>
                <Text style={{textAlign: 'center'}}>
                  {user?.user?.noOfEvents}
                </Text>
                <Text style={{color: 'gray', marginTop: 6, fontSize: 13}}>
                  EVENTS
                </Text>
              </View>

              <View>
                <Text style={{textAlign: 'center'}}>
                  {user?.user?.eventPals?.length}
                </Text>
                <Text style={{color: 'gray', marginTop: 6, fontSize: 13}}>
                  PLAYPALS
                </Text>
              </View>

              <View>
                <Text style={{textAlign: 'center'}}>60</Text>
                <Text style={{color: 'gray', marginTop: 6, fontSize: 13}}>
                  KARMA
                </Text>
              </View>
            </View>
          </View>

          <View>
            <Text style={{marginTop: 10, fontWeight: '500'}}>
              {user?.user?.firstName}
            </Text>
            <Text style={{color: 'gray', marginTop: 6}}>
              Last Played on 13th July
            </Text>
          </View>
        </View>

        <View style={{padding: 12}}>
          <View
            style={{backgroundColor: 'white', padding: 10, borderRadius: 10}}>
            <ProfileOption
              icon={<AntDesign name="calendar" size={24} color={'green'} />}
              title="My Bookings"
              subtitle="View Transactions & Receipts"
            />

            <ProfileOption
              icon={
                <Ionicons name="people-outline" size={24} color={'green'} />
              }
              title="Playpals"
              subtitle="View & Manage Players"
            />

            <ProfileOption
              icon={<AntDesign name="book" size={24} color={'green'} />}
              title="Passbook"
              subtitle="Manage Karma, Playo credits, etc"
            />

            <ProfileOption
              icon={
                <MaterialIcons
                  name="energy-savings-leaf"
                  size={24}
                  color={'green'}
                />
              }
              title="Preference and Privacy"
              subtitle="View Transactions & Receipts"
            />

            <ProfileOption
              icon={<AntDesign name="profile" size={24} color={'green'} />}
              title="Detail"
              onPress={() => navigation.navigate('ProfileEditScreen')}
            />

            <ProfileOption
              icon={
                <Ionicons name="people-outline" size={24} color={'green'} />
              }
              title="Blogs"
            />

            <ProfileOption
              icon={<AntDesign name="book" size={24} color={'green'} />}
              title="Invite & Earn"
            />

            <ProfileOption
              icon={
                <MaterialIcons
                  name="energy-savings-leaf"
                  size={24}
                  color={'green'}
                />
              }
              title="Help & Support"
            />

            <ProfileOption
              icon={
                <MaterialIcons
                  name="energy-savings-leaf"
                  size={24}
                  color={'green'}
                />
              }
              title="Logout"
              onPress={clearAuthToken}
            />
          </View>
        </View>
      </ScrollView>

      <ImageViewing
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </SafeAreaView>
  );
};

const ProfileOption = ({icon, title, subtitle, onPress}) => (
  <Pressable onPress={onPress} style={styles.optionContainer}>
    <View style={styles.iconContainer}>{icon}</View>
    <View>
      <Text style={styles.optionTitle}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
  </Pressable>
);

export default ProfileDetailScreen;

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionSubtitle: {
    marginTop: 7,
    color: 'gray',
  },
});
