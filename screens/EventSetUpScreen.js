import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    Pressable,
    TextInput,
    Alert,
  } from 'react-native';
  import React, {useState, useContext, useEffect} from 'react';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import Entypo from 'react-native-vector-icons/Entypo';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
  import {useNavigation, useRoute} from '@react-navigation/native';
  import {SlideAnimation} from 'react-native-modals';
  import {BottomModal} from 'react-native-modals';
  import {ModalContent} from 'react-native-modals';
  import {AuthContext} from '../AuthContext';
  import axios from 'axios';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const EventSetUpScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [modalVisible, setModalVisible] = useState(false);
    const {userId} = useContext(AuthContext);
    const [comment, setComment] = useState('');
    const [isRequestPending, setIsRequestPending] = useState(false);
    const eventId = route?.params?.item?._id;
    const organizerId = route?.params?.item?.organizerId;
    const [isFull, setIsFull] = useState(route?.params?.item?.isFull || false);
  
    useEffect(() => {
      checkRequestStatus();
    }, []);
  
    const checkRequestStatus = async () => {
      const storedStatus = await AsyncStorage.getItem(`event_${eventId}_request_status`);
      if (storedStatus === 'pending') {
        setIsRequestPending(true);
      }
    };
  
    const storeRequestStatus = async status => {
      await AsyncStorage.setItem(`event_${eventId}_request_status`, status);
    };
  
    const sendJoinRequest = async eventId => {
      try {
        const response = await axios.post(
          `http://10.0.2.2:8000/events/${eventId}/request`,
          {
            userId,
            comment,
          },
        );
  
        if (response.status === 200) {
          Alert.alert('Request Sent', 'Please wait for the host to accept!', [
            {text: 'OK', onPress: () => setModalVisible(false)},
          ]);
          setIsRequestPending(true);
          await storeRequestStatus('pending');
        }
      } catch (error) {
        if (error.response && error.response.data === 'Request already exists') {
          setIsRequestPending(true);
          await storeRequestStatus('pending');
        } else {
          console.error('Failed to send request:', error);
        }
      }
    };
  
    return (
      <>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView>
            <View style={{padding: 10, backgroundColor: '#294461', paddingBottom: 20}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Ionicons name="arrow-back" size={24} color="white" />
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <Entypo name="share" size={24} color="white" />
                  <Entypo name="dots-three-vertical" size={24} color="white" />
                </View>
              </View>
  
              <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 14}}>
                <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>
                  {route?.params?.item?.title}
                </Text>
  
                <View style={{padding: 7, backgroundColor: 'white', borderRadius: 7, alignSelf: 'flex-start'}}>
                  <Text>Mixed Doubles</Text>
                </View>
  
                <View style={{marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <Text style={{fontSize: 15, fontWeight: '500', color: 'white'}}>
                    Event Full
                  </Text>
                  <FontAwesome
                    onPress={() => setIsFull(!isFull)}
                    name={isFull || route?.params?.item?.isFull ? 'toggle-on' : 'toggle-off'}
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
                  navigation.navigate('Venue', {
                    place: route?.params?.item?.location,
                    sports: [],
                    date: route?.params?.item?.date,
                    slot: route?.params?.item?.time,
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
                  <Text style={{color: 'white'}}>{route?.params?.item?.location}</Text>
                </View>
              </Pressable>
            </View>
  
            <View style={{marginVertical: 20, marginHorizontal: 15, backgroundColor: 'white', padding: 10, flexDirection: 'row', gap: 10}}>
              <MaterialCommunityIcons name="directions-fork" size={24} color="#adcf17" />
              <View>
                <Text style={{fontSize: 15}}>Add Expense</Text>
                <View style={{marginTop: 6, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={{width: '80%', color: 'gray'}}>
                    Start adding your expenses to split cost among attendees
                  </Text>
                  <Entypo name="chevron-small-right" size={24} color="gray" />
                </View>
              </View>
            </View>
  
            <View style={{marginHorizontal: 15}}>
              <Image
                style={{width: '100%', height: 220, borderRadius: 10, resizeMode: 'cover'}}
                source={{
                  uri: 'https://playo.gumlet.io/OFFERS/PlayplusSpecialBadmintonOfferlzw64ucover1614258751575.png',
                }}
              />
            </View>
  
            <View style={{marginVertical: 20, marginHorizontal: 15, backgroundColor: 'white', padding: 12}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 16, fontWeight: '600'}}>Attendees (2)</Text>
                <Ionicons name="earth" size={24} color="gray" />
              </View>
  
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20}}>
                <Text style={{fontSize: 15, fontWeight: '500'}}>❤️ You are not covered 🙂</Text>
                <Text style={{fontWeight: '500'}}>Learn More</Text>
              </View>
  
              <View style={{marginVertical: 12, flexDirection: 'row', gap: 10}}>
                <View>
                  <Image style={{width: 60, height: 60, borderRadius: 30}} source={{uri: route?.params?.item?.adminUrl}} />
                </View>
  
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Text>{route?.params?.item?.organizerName}</Text>
                    <View style={{alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#E0E0E0', borderRadius: 8}}>
                      <Text>HOST</Text>
                    </View>
                  </View>
  
                  <View style={{paddingHorizontal: 10, paddingVertical: 5, marginTop: 10, borderRadius: 20, borderColor: 'orange', borderWidth: 1, alignSelf: 'flex-start'}}>
                    <Text>MEDIATE</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
  
        {route?.params?.item?.isOrganizer == true ? (
          <Pressable
            style={{
              backgroundColor: '#07bc0c',
              marginTop: 'auto',
              marginBottom: 30,
              padding: 15,
              marginHorizontal: 10,
              borderRadius: 4,
            }}>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 15, fontWeight: '500'}}>EVENT CHAT</Text>
          </Pressable>
        ) : organizerId !== userId ? (
          isRequestPending ? (
            <Pressable
              style={{
                backgroundColor: 'gray',
                marginTop: 'auto',
                marginBottom: 30,
                padding: 15,
                marginHorizontal: 10,
                borderRadius: 4,
              }}>
              <Text style={{textAlign: 'center', color: 'white', fontSize: 15, fontWeight: '500'}}>Pending</Text>
            </Pressable>
          ) : (
            <View style={{marginTop: 'auto', flexDirection: 'row', alignItems: 'center', paddingVertical: 12, backgroundColor: '#E8E8E8'}}>
              <Pressable
                style={{
                  backgroundColor: 'white',
                  marginTop: 'auto',
                  marginBottom: 30,
                  padding: 15,
                  marginHorizontal: 10,
                  borderRadius: 4,
                  flex: 1,
                }}>
                <Text style={{textAlign: 'center', fontSize: 15, fontWeight: '500'}}>SEND QUERY</Text>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(!modalVisible)}
                style={{
                  backgroundColor: '#07bc0c',
                  marginTop: 'auto',
                  marginBottom: 30,
                  padding: 15,
                  marginHorizontal: 10,
                  borderRadius: 4,
                  flex: 1,
                }}>
                <Text style={{textAlign: 'center', color: 'white', fontSize: 15, fontWeight: '500'}}>JOIN EVENT</Text>
              </Pressable>
            </View>
          )
        ) : null}
  
        <BottomModal
          onBackdropPress={() => setModalVisible(!modalVisible)}
          swipeDirection={['up', 'down']}
          swipeThreshold={200}
          modalAnimation={new SlideAnimation({slideFrom: 'bottom'})}
          visible={modalVisible}
          onTouchOutside={() => setModalVisible(!modalVisible)}>
          <ModalContent style={{width: '100%', height: 400, backgroundColor: 'white'}}>
            <View>
              <Text style={{fontSize: 15, fontWeight: '500', color: 'gray'}}>Join Event</Text>
              <Text style={{marginTop: 25, color: 'gray'}}>
                {route?.params?.item?.organizerName} has been putting effort to organize this event. Please send the request if you are quite sure to attend.
              </Text>
  
              <View style={{borderColor: '#E0E0E0', borderWidth: 1, padding: 10, borderRadius: 10, height: 200, marginTop: 20}}>
                <TextInput
                  value={comment}
                  onChangeText={text => setComment(text)}
                  style={{fontFamily: 'Helvetica', fontSize: 17}}
                  placeholder="Send a message to the host along with your request!"
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
                  <Text style={{color: 'white', textAlign: 'center', fontSize: 15, fontWeight: '500'}}>Send Request</Text>
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
  