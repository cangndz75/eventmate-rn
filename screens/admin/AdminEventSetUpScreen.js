import React, {useState, useContext, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Pressable,
  TextInput,
  Text,
  Alert,
} from 'react-native';
import {Button, Avatar} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BottomModal, ModalContent, SlideAnimation} from 'react-native-modals';
import axios from 'axios';
import {AuthContext} from '../../AuthContext';

const AdminEventSetUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userId} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [organizer, setOrganizer] = useState(null);
  const [requests, setRequests] = useState([]);
  const eventId = route?.params?.item?._id;

  useEffect(() => {
    fetchAttendees();
  }, []);

  useEffect(() => {
    console.log('Organizer state:', organizer);
  }, [organizer]);

  const fetchAttendees = async () => {
    if (!eventId) return;
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/event/${eventId}/attendees`,
      );
      setAttendees(response.data);
    } catch (error) {
      console.error('Failed to fetch attendees:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <Image
          source={{
            uri:
              route?.params?.item?.image ||
              'https://via.placeholder.com/600x300',
          }}
          style={{width: '100%', height: 300}}
        />
        <View style={{position: 'absolute', top: 20, left: 20}}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            flexDirection: 'row',
            gap: 15,
          }}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
          <Entypo name="share" size={24} color="#fff" />
        </View>

        <View style={{padding: 16}}>
          <Text style={{fontSize: 24, fontWeight: 'bold', color: '#333'}}>
            {route?.params?.item?.title || 'National Music Festival'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Button
              title="Music"
              type="outline"
              buttonStyle={{
                borderColor: '#5c6bc0',
                borderRadius: 20,
                paddingHorizontal: 10,
              }}
              titleStyle={{color: '#5c6bc0'}}
            />
            <View
              style={{
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {attendees.slice(0, 4).map((attendee, index) => (
                <Avatar
                  key={index}
                  size={30}
                  rounded
                  source={{
                    uri: attendee.imageUrl || 'https://via.placeholder.com/150',
                  }}
                  containerStyle={{marginLeft: index === 0 ? 0 : -10}}
                />
              ))}
              <Text style={{marginLeft: 10, color: '#333'}}>
                {attendees.length}+ going
              </Text>
            </View>
          </View>

          <Button
            title="Add to My Calendar"
            buttonStyle={{backgroundColor: '#5c6bc0', borderRadius: 10}}
            containerStyle={{marginVertical: 10}}
          />

          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <MaterialIcons name="location-on" size={24} color="#5c6bc0" />
            <View style={{marginLeft: 10}}>
              <Text style={{fontWeight: 'bold', color: '#333'}}>
                {route?.params?.item?.location ||
                  'Grand Park, New York City, US'}
              </Text>
              <Text style={{color: '#666'}}>
                Grand City St. 100, New York, United States.
              </Text>
            </View>
          </View>

          <Button
            title="See Location on Maps"
            buttonStyle={{backgroundColor: '#5c6bc0', borderRadius: 10}}
            containerStyle={{marginBottom: 20}}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <MaterialIcons name="attach-money" size={24} color="#5c6bc0" />
            <Text style={{marginLeft: 10, fontWeight: 'bold', color: '#333'}}>
              $20.00 - $100.00
            </Text>
          </View>
          <Text style={{color: '#666', marginBottom: 20}}>
            Ticket price depends on package.
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar
              size={60}
              rounded
              source={{
                uri: organizer?.imageUrl || 'https://via.placeholder.com/150',
              }}
            />
            <View style={{marginLeft: 10}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {organizer?.name || 'World of Music'}
              </Text>
              <Text style={{color: 'gray'}}>Organizer</Text>
            </View>
          </View>

          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>
            About Event
          </Text>
          <Text style={{color: '#666', marginTop: 10}}>
            {route?.params?.item?.description ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'}
          </Text>
          <Pressable>
            <Text style={{color: '#5c6bc0', marginTop: 5}}>Read more...</Text>
          </Pressable>

          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>
            Gallery (Pre-Event)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              'https://via.placeholder.com/150',
              'https://via.placeholder.com/150',
              'https://via.placeholder.com/150',
            ].map((img, index) => (
              <Image
                key={index}
                source={{uri: img}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  marginRight: 10,
                  marginTop: 10,
                }}
              />
            ))}
          </ScrollView>

          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Organizer Options
            </Text>
            <View>
              <View
                style={{
                  height: 1,
                  borderWidth: 0.5,
                  borderColor: '#E0E0E0',
                  marginVertical: 12,
                }}
              />
              <Pressable
                style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{width: 30, height: 30, resizeMode: 'contain'}}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/343/343303.png',
                    }}
                  />
                </View>

                <Text style={{fontSize: 15, fontWeight: '500', flex: 1}}>
                  Add Co-Host
                </Text>

                <MaterialCommunityIcons
                  style={{textAlign: 'center'}}
                  name="chevron-right"
                  size={24}
                  color="black"
                />
              </Pressable>

              <View
                style={{
                  height: 1,
                  borderWidth: 0.5,
                  borderColor: '#E0E0E0',
                  marginVertical: 12,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Pressable>
                  <Pressable
                    style={{
                      width: 60,
                      height: 60,
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{width: 30, height: 30, resizeMode: 'contain'}}
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/128/1474/1474545.png',
                      }}
                    />
                  </Pressable>
                  <Text
                    style={{
                      marginTop: 8,
                      fontWeight: '500',
                      textAlign: 'center',
                    }}>
                    Add
                  </Text>
                </Pressable>

                <Pressable>
                  <Pressable
                    onPress={() =>
                      navigation.navigate('ManageRequest', {
                        requests: requests,
                        userId: userId,
                        eventId: route?.params?.item?._id,
                      })
                    }
                    style={{
                      width: 60,
                      height: 60,
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        resizeMode: 'contain',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/128/7928/7928637.png',
                      }}
                    />
                  </Pressable>
                  <Text
                    style={{
                      marginTop: 8,
                      fontWeight: '500',
                      textAlign: 'center',
                    }}>
                    Manage ({requests?.length})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    navigation.navigate('Attendees', {
                      attendees: attendees,
                    })
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      padding: 10,
                      borderColor: '#E0E0E0',
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: 12,
                    }}>
                    <MaterialCommunityIcons
                      style={{textAlign: 'center'}}
                      name="chevron-right"
                      size={24}
                      color="black"
                    />
                  </View>
                  <Pressable
                    onPress={() =>
                      navigation.navigate('Attendees', {attendees: attendees})
                    }>
                    <Text
                      style={{
                        marginBottom: 12,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      All attendees
                    </Text>
                  </Pressable>
                </Pressable>
              </View>

              <View
                style={{
                  height: 1,
                  borderWidth: 0.5,
                  borderColor: '#E0E0E0',
                  marginVertical: 12,
                }}
              />

              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{width: 30, height: 30, resizeMode: 'contain'}}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/1511/1511847.png',
                    }}
                  />
                </View>

                <View>
                  <Text>Not on EventMate? Invite</Text>
                  <Text style={{marginTop: 6, color: 'gray', width: '80%'}}>
                    Earn 100 Karma points by referring your friend.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminEventSetUpScreen;
