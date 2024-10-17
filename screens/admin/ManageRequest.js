import {SafeAreaView, View, Image, Pressable, Text, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';

const ManageRequests = () => {
  const [option, setOption] = useState('Requests');
  const route = useRoute();

  const eventId = route?.params?.eventId;

  const [requests, setRequests] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [invited, setInvited] = useState([]);
  const [retired, setRetired] = useState([]);

  useEffect(() => {
    fetchRequests();
    fetchAttendees();
  }, []);

  const fetchRequests = async () => {
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
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/event/${eventId}/attendees`,
      );
      setAttendees(response.data);
    } catch (error) {
      console.error('Failed to fetch attendees:', error);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const response = await axios.patch(
        `http://10.0.2.2:8000/requests/${requestId}`,
        {status},
      );

      if (response.status === 200) {
        Alert.alert('Success', `Request ${status}`);
        fetchRequests();
      }
    } catch (error) {
      console.error(`Failed to update request status to ${status}:`, error);
      Alert.alert('Error', `Failed to update status to ${status}`);
    }
  };

  const acceptRequest = async (userId, requestId, eventId) => {
    console.log('Accepting Request:', { userId, requestId, eventId }); 
  
    try {
      const response = await axios.post('http://10.0.2.2:8000/accept', {
        userId,
        requestId,
        eventId,
      });
  
      if (response.status === 200) {
        Alert.alert('Success', 'Request accepted');
        fetchRequests();
      }
    } catch (error) {
      console.error(
        'Failed to accept request:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert('Error', 'Failed to accept request');
    }
  };
  

  const rejectRequest = async (requestId, eventId) => {
    try {
      const response = await axios.post('http://10.0.2.2:8000/reject', {
        requestId,
        eventId,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Request rejected');
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      Alert.alert('Error', 'Failed to reject request');a
    }
  };

  return (
    <SafeAreaView>
      <View style={{padding: 12, backgroundColor: '#223536'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            justifyContent: 'space-between',
          }}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <AntDesign name="plussquareo" size={24} color="white" />
        </View>

        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
            Manage
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 15,
          }}>
          <Pressable onPress={() => setOption('Requests')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'Requests' ? '#1dd132' : 'white',
              }}>
              Requests ({requests?.length})
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('Invited')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'Invited' ? '#1dd132' : 'white',
              }}>
              Invited ({invited?.length})
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('Playing')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'Playing' ? '#1dd132' : 'white',
              }}>
              Playing ({attendees?.length})
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('Retired')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'Retired' ? '#1dd132' : 'white',
              }}>
              Retired ({retired?.length})
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{marginTop: 10, marginHorizontal: 15}}>
        {option == 'Requests' && (
          <View>
            {requests.length === 0 ? (
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 6,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: '500', fontSize: 16}}>
                  No requests
                </Text>
              </View>
            ) : (
              requests.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: 'white',
                    marginVertical: 10,
                    borderRadius: 6,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 13,
                    }}>
                    <Image
                      style={{width: 50, height: 50, borderRadius: 25}}
                      source={{uri: item?.image}}
                    />

                    <View style={{flex: 1}}>
                      <Text style={{fontWeight: '600'}}>
                        {item?.firstName} {item?.lastName}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 3,
                          marginTop: 10,
                          borderRadius: 20,
                          borderColor: 'orange',
                          borderWidth: 1,
                          alignSelf: 'flex-start',
                        }}>
                        <Text style={{fontSize: 13}}>INTERMEDIATE</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={{marginTop: 8}}>{item?.comment}</Text>

                  <View
                    style={{
                      height: 1,
                      borderColor: '#E0E0E0',
                      borderWidth: 0.7,
                      marginVertical: 15,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          backgroundColor: '#E0E0E0',
                          borderRadius: 5,
                          alignSelf: 'flex-start',
                        }}>
                        <Text style={{fontSize: 14, color: 'gray'}}>
                          0 NO SHOWS
                        </Text>
                      </View>

                      <Text
                        style={{
                          marginTop: 10,
                          fontWeight: 'bold',
                          textDecorationLine: 'underline',
                        }}>
                        See Reputation
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                      }}>
                      <Pressable
                        style={{
                          padding: 10,
                          borderRadius: 6,
                          borderColor: '#E0E0E0',
                          borderWidth: 1,
                          width: 100,
                        }}>
                        <Text style={{textAlign: 'center'}}>RETIRE</Text>
                      </Pressable>

                      <Pressable
                        onPress={
                          () => acceptRequest(item.userId, item._id, eventId) 
                        }
                        style={{
                          padding: 10,
                          borderRadius: 6,
                          backgroundColor: '#26bd37',
                          width: 100,
                        }}>
                        <Text style={{textAlign: 'center', color: 'white'}}>
                          ACCEPT
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        )}

        {option == 'Playing' && (
          <View>
            {attendees.length === 0 ? (
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 6,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: '500', fontSize: 16}}>
                  No attendees
                </Text>
              </View>
            ) : (
              attendees.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    marginVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  <View>
                    <Image
                      style={{width: 60, height: 60, borderRadius: 30}}
                      source={{uri: item?.image}}
                    />
                  </View>

                  <View>
                    <Text>
                      {item?.firstName} {item?.lastName}
                    </Text>

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
                      <Text style={{fontSize: 13, fontWeight: '400'}}>
                        INTERMEDIATE
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        )}

        {option == 'Invited' && (
          <View>
            {invited.length === 0 ? (
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 6,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: '500', fontSize: 16}}>
                  No invited players
                </Text>
              </View>
            ) : (
              <Text>Invited players will be shown here.</Text>
            )}
          </View>
        )}

        {option == 'Retired' && (
          <View>
            {retired.length === 0 ? (
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 6,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: '500', fontSize: 16}}>
                  No retired players
                </Text>
              </View>
            ) : (
              <Text>Retired players will be shown here.</Text>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ManageRequests;
