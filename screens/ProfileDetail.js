import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageViewing from 'react-native-image-viewing';

const ProfileDetailScreen = () => {
  const [user, setUser] = useState('');
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const {userId, token, setToken, setUserId} = useContext(AuthContext);
  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);
  const fetchUser = async () => {
    try {
      console.log('test', userId);
      const response = await axios.get(`http://10.0.2.2:8000/user/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('token');

      setToken('');

      setUserId('');

      navigation.replace('Start');
    } catch (error) {
      console.log('Error', error);
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
            //   alignItems: 'center',
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
      <ScrollView>
        <View style={{padding: 12}}>
          <View
            style={{backgroundColor: 'white', padding: 10, borderRadius: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name="calendar" size={24} color={'green'} />
              </View>

              <View style={{}}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  My Bookings
                </Text>
                <Text style={{marginTop: 7, color: 'gray'}}>
                  View Transactions & Receipts
                </Text>
              </View>
            </View>

            <View
              style={{
                height: 1,
                borderColor: '#E0E0E0',
                borderWidth: 0.5,
                marginTop: 15,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginVertical: 15,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="people-outline" size={24} color={'green'} />
              </View>

              <View style={{}}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>Playpals</Text>
                <Text style={{marginTop: 7, color: 'gray'}}>
                  View & Manage Players
                </Text>
              </View>
            </View>

            <View
              style={{height: 1, borderColor: '#E0E0E0', borderWidth: 0.5}}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 15,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name="book" size={24} color={'green'} />
              </View>

              <View style={{}}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>Passbook</Text>
                <Text style={{marginTop: 7, color: 'gray'}}>
                  Manage Karma,Playo credits, etc
                </Text>
              </View>
            </View>

            <View
              style={{
                height: 1,
                borderColor: '#E0E0E0',
                borderWidth: 0.5,
                marginTop: 15,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 15,
                marginBottom: 10,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons
                  name="energy-savings-leaf"
                  size={24}
                  color={'green'}
                />
              </View>

              <View style={{}}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Preference and Privacy
                </Text>
                <Text style={{marginTop: 7, color: 'gray'}}>
                  View Transactions & Receipts
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{padding: 12}}>
          <View
            style={{backgroundColor: 'white', padding: 10, borderRadius: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name="calendar" size={24} color={'green'} />
              </View>

              <View style={{}}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>Offers</Text>
              </View>
            </View>

            <View
              style={{
                height: 1,
                borderColor: '#E0E0E0',
                borderWidth: 0.5,
                marginTop: 15,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginVertical: 15,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="people-outline" size={24} color={'green'} />
              </View>

              <View style={{}}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>Blogs</Text>
              </View>
            </View>

            <View
              style={{height: 1, borderColor: '#E0E0E0', borderWidth: 0.5}}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 10,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name="book" size={24} color={'green'} />
              </View>

              <View style={{}}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Invite & Earn
                </Text>
              </View>
            </View>

            <View
              style={{
                height: 1,
                borderColor: '#E0E0E0',
                borderWidth: 0.5,
                marginTop: 15,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 15,
                marginBottom: 10,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons
                  name="energy-savings-leaf"
                  size={24}
                  color={'green'}
                />
              </View>

              <View style={{}}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Help & Support
                </Text>
              </View>
            </View>

            <View
              style={{height: 1, borderColor: '#E0E0E0', borderWidth: 0.5}}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 15,
                marginBottom: 10,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons
                  name="energy-savings-leaf"
                  size={24}
                  color={'green'}
                />
              </View>

              <View style={{}}>
                <Text
                  style={{fontSize: 16, fontWeight: '500'}}
                  onPress={clearAuthToken}>
                  Logout
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <ImageViewing
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </ScrollView>
    </SafeAreaView>
    
  );
};

export default ProfileDetailScreen;

const styles = StyleSheet.create({});
