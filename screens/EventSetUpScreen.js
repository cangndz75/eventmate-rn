import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Pressable,
  TextInput,
  Alert,
  Text,
  StyleSheet,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BottomModal, ModalContent, SlideAnimation} from 'react-native-modals';
import axios from 'axios';
import {AuthContext} from '../AuthContext';

const EventSetUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userId} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [comment, setComment] = useState('');
  const [isFull, setIsFull] = useState(route?.params?.item?.isFull || false);
  const eventId = route?.params?.item?._id;
  const organizerId = route?.params?.item?.organizer?._id;
  const isOrganizer = userId === organizerId;
  const [requests, setRequests] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [venues, setVenues] = useState([]);

  const userRequested =
    route?.params?.item?.requests?.some(request => request.userId === userId) ||
    false;

  useEffect(() => {
    fetchRequests();
    fetchAttendees();
    fetchVenues();
  }, []);

  const fetchRequests = async () => {
    if (!eventId) return;
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/events/${eventId}/requests`,
      );
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

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

  const fetchVenues = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/venues');
      setVenues(response.data);
    } catch (error) {
      console.error('Failed to fetch venues:', error);
    }
  };

  const venue = venues?.find(
    item => item?.name === route?.params?.item?.location,
  );

  const toggleIsFullStatus = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:8000/toggle-is-full', {
        eventId,
      });
      if (response.status === 200) {
        setIsFull(!isFull);
        Alert.alert('Success', 'Event full status updated');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update event full status');
    }
  };

  const sendJoinRequest = async () => {
    try {
      const response = await axios.post(
        `http://10.0.2.2:8000/events/${eventId}/request`,
        {userId, comment},
      );
      if (response.status === 200) {
        Alert.alert('Request Sent', 'Please wait for the host to accept!');
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Failed to send request:', error);
    }
  };
  console.log('UserId', userId);
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View
            style={{
              padding: 10,
              backgroundColor: '#294461',
              paddingBottom: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Ionicons name="arrow-back" size={24} color="white" />

              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Entypo name="share" size={24} color="white" />
                <Entypo name="dots-three-vertical" size={24} color="white" />
              </View>
            </View>

            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}>
              <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>
                {route?.params?.item?.title}
              </Text>

              <View
                style={{
                  padding: 7,

                  backgroundColor: 'white',
                  borderRadius: 7,
                  alignSelf: 'flex-start',
                }}>
                <Text>Mixed Doubles</Text>
              </View>

              <View
                style={{
                  marginLeft: 'auto',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                <Text style={{fontSize: 15, fontWeight: '500', color: 'white'}}>
                  Event Full
                </Text>
                <FontAwesome
                  onPress={() => toggleIsFullStatus(route?.params?.item?._id)}
                  name={
                    isFull || route?.params?.item?.isFull == true
                      ? 'toggle-on'
                      : 'toggle-off'
                  }
                  size={24}
                  color="white"
                />
              </View>
            </View>

            <View style={{marginTop: 10}}>
              <Text style={{fontSize: 15, color: 'white', fontWeight: '600'}}>
                {route?.params?.item?.time} • {route?.params?.item?.date}
              </Text>
            </View>

            <Pressable
              onPress={() =>
                navigation.navigate('Slot', {
                  area: route?.params?.item?.location,
                  events: venue?.eventsAvailable || [],
                  date: route?.params?.item?.date,
                  slot: route?.params?.item?.time,
                  startTime: startTime,
                  endTime: endTime,
                  eventId: route?.params?.item?._id,
                  bookings: venue?.bookings,
                })
              }
              style={{
                backgroundColor: '#28c752',
                paddingHorizontal: 10,
                paddingVertical: 6,
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                width: '90%',
                justifyContent: 'center',
                borderRadius: 8,
              }}>
              <Entypo name="location" size={24} color="white" />

              <View>
                <Text style={{color: 'white'}}>
                  {route?.params?.item?.location}
                </Text>
              </View>
            </Pressable>
          </View>

          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 15,
              backgroundColor: 'white',
              padding: 10,
              flexDirection: 'row',

              gap: 10,
            }}>
            <MaterialCommunityIcons
              name="directions-fork"
              size={24}
              color="#adcf17"
            />

            <View>
              <Text style={{fontSize: 15}}>Add Expense</Text>

              <View
                style={{
                  marginTop: 6,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{width: '80%', color: 'gray'}}>
                  Start adding your expenses to split cost among attendees
                </Text>

                <Entypo name="chevron-small-right" size={24} color="gray" />
              </View>
            </View>
          </View>

          <View style={{marginHorizontal: 15}}>
            <Image
              style={{
                width: '100%',
                height: 220,
                borderRadius: 10,
                resizeMode: 'cover',
              }}
              source={{
                uri: 'https://playo.gumlet.io/OFFERS/PlayplusSpecialBadmintonOfferlzw64ucover1614258751575.png',
              }}
            />
          </View>

          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 15,
              backgroundColor: 'white',
              padding: 12,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 16, fontWeight: '600'}}>
                Attendees {route?.params?.item?.attendees.length}
              </Text>

              <Ionicons name="earth" size={24} color="gray" />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{fontSize: 15, fontWeight: '500'}}>
                ❤️ You are not covered 🙂
              </Text>

              <Text style={{fontWeight: '500'}}>Learn More</Text>
            </View>

            <View style={{marginVertical: 12, flexDirection: 'row', gap: 10}}>
              <View>
                <Image
                  style={{width: 60, height: 60, borderRadius: 30}}
                  source={{uri: route?.params?.item?.organizerUrl}}
                />
              </View>

              <View>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <Text>{route?.params?.item?.organizerName}</Text>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      backgroundColor: '#E0E0E0',
                      borderRadius: 8,
                    }}>
                    <Text>HOST</Text>
                  </View>
                </View>

                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginTop: 10,
                    borderRadius: 20,
                    borderColor: 'orange',
                    borderWidth: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <Text>INTERMEDIATE</Text>
                </View>
              </View>
            </View>
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
                      navigation.navigate('Manage', {
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
                    Manage
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

                  <Text
                    style={{
                      marginBottom: 12,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    All Attendees
                  </Text>
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
                    Earn 100 Karma points by referring your friend
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  navigation.navigate('Attendees', {
                    attendees: attendees,
                  })
                }
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopColor: '#E0E0E0',
                  borderTopWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  borderBottomWidth: 1,
                  marginBottom: 20,
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

                <Text style={{marginBottom: 12, fontWeight: '600'}}>
                  All Attendees
                </Text>
              </Pressable>
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 15,
              backgroundColor: 'white',
              padding: 12,
              borderRadius: 6,
            }}>
            <View>
              <Text style={{fontSize: 18, fontWeight: '600'}}>Queries (0)</Text>

              <View style={{marginVertical: 12}}>
                <Text
                  style={{color: 'gray', fontSize: 15, textAlign: 'center'}}>
                  There are no queries yet! Queries sent by attendees will be
                  shown here
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* route?.params?.item?.isUserAdmin == true */}
      </SafeAreaView>

      <Pressable
        style={{
          backgroundColor: '#07bc0c',
          marginTop: 'auto',
          marginBottom: 'auto',
          padding: 15,
          marginHorizontal: 10,
          borderRadius: 4,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: 15,
            fontWeight: '500',
          }}>
          EVENT CHAT
        </Text>
      </Pressable>
      <View
        style={{
          marginTop: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          backgroundColor: '#E8E8E8',
        }}></View>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}>
        <ModalContent
          style={{width: '100%', height: 400, backgroundColor: 'white'}}>
          <View>
            <Text style={{fontSize: 15, fontWeight: '500', color: 'gray'}}>
              Join Event
            </Text>

            <Text style={{marginTop: 25, color: 'gray'}}>
              {route?.params?.item?.organizerName} has been putting efforts to
              organize this game. Please send the request if you are quite sure
              to attend
            </Text>

            <View
              style={{
                borderColor: '#E0E0E0',
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                height: 200,
                marginTop: 20,
              }}>
              <TextInput
                value={comment}
                // multiline
                onChangeText={text => setComment(text)}
                style={{
                  fontFamily: 'Helvetica',
                  fontSize: comment ? 17 : 17,
                }}
                placeholder="Send a message to the host along with your request!"
                //   placeholderTextColor={"black"}
              />
              <Pressable
                onPress={() => sendJoinRequest(route?.params?.item?._id)}
                style={{
                  marginTop: 'auto',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  backgroundColor: 'green',
                  borderRadius: 5,
                  justifyContent: 'center',
                  padding: 10,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 15,
                    fontWeight: '500',
                  }}>
                  Send Request
                </Text>
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default EventSetUpScreen;

const styles = StyleSheet.create({});
