import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BottomModal} from 'react-native-modals';
import {SlideAnimation} from 'react-native-modals';
import {ModalContent} from 'react-native-modals';
import moment from 'moment';

const CreateEvent = () => {
  const [event, setEvent] = useState('');
  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [timeInterval, setTimeInterval] = useState('');
  const [noOfParticipants, setNoOfParticipants] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const [taggedVenue, setTaggedVenue] = useState(null);
  useEffect(() => {
    const { timeInterval, taggedVenue } = route?.params || {};
  
    if (timeInterval) {
      setTimeInterval(timeInterval);
    }
  
    if (taggedVenue) {
      setTaggedVenue(taggedVenue);
    }
  }, [route?.params]);
  
  useEffect(() => {
    if (route?.params?.taggedVenue) {
      setTaggedVenue(route?.params?.taggedVenue);
    }
  }, [route?.params]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState('Public');
  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 30; i++) {
      const date = moment().add(i, 'days');
      let displayDate;
      if (i === 0) {
        displayDate = 'Today';
      } else if (i === 1) {
        displayDate = 'Tomorrow';
      } else if (i === 2) {
        displayDate = 'Day After';
      } else {
        displayDate = date.format('Do MMMM');
      }
      dates.push({
        id: i.toString(),
        displayDate,
        dayOfWeek: date.format('ddd'),
        actualDate: date.format('Do MMMM'),
      });
    }
    return dates;
  };
  const dates = generateDates();
  console.log('dates', dates);
  const selectDate = date => {
    setModalVisible(false);
    setDate(date);
  };
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingTop: Platform.OS === 'android' ? 35 : 0,
        }}>
        <ScrollView>
          <View style={{marginHorizontal: 10}}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </View>
          <View style={{padding: 10}}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>
              Create Event
            </Text>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                marginTop: 15,
                marginVertical: 15,
              }}>
              <MaterialIcons name="add-a-photo" size={24} color="black" />
              <View style={{flex: 1}}>
                <Text style={{fontSize: 17, fontWeight: '500', color: 'black'}}>
                  Event
                </Text>
                <TextInput
                  value={event}
                  onChangeText={setEvent}
                  style={{marginTop: 7, fontSize: 15, color: 'black'}}
                  placeholder="Enter event name"
                  placeholderTextColor="gray"
                />
              </View>
              <AntDesign name="right" size={24} color="black" />
            </Pressable>
            <Text style={{borderColor: '#E0E0E0', borderWidth: 1, height: 1}} />
            <Pressable
              onPress={() => navigation.navigate('TagVenue')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                marginTop: 15,
                marginVertical: 15,
              }}>
              <Entypo name="location" size={24} color="black" />
              <View style={{flex: 1}}>
                <Text style={{fontSize: 17, fontWeight: '500', color: 'black'}}>
                  Event
                </Text>
                <TextInput
                  value={area ? area : taggedVenue}
                  onChangeText={setArea}
                  style={{marginTop: 7, fontSize: 15, color: 'black'}}
                  placeholder="Enter event area"
                  placeholderTextColor="gray"
                />
              </View>
              <AntDesign name="right" size={24} color="black" />
            </Pressable>
            <Text style={{borderColor: '#E0E0E0', borderWidth: 1, height: 1}} />
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                marginTop: 15,
                marginVertical: 15,
              }}>
              <Feather name="calendar" size={24} color="black" />
              <View style={{flex: 1}}>
                <Text style={{fontSize: 17, fontWeight: '500', color: 'black'}}>
                  Date
                </Text>
                <TextInput
                  editable={false}
                  value={date}
                  onChangeText={setDate}
                  style={{marginTop: 7, fontSize: 15, color: 'black'}}
                  placeholderTextColor={date ? 'black' : 'gray'}
                  placeholder={date ? date : 'Pick a day'}
                />
              </View>
              <AntDesign name="right" size={24} color="black" />
            </Pressable>
            <Text style={{borderColor: '#E0E0E0', borderWidth: 1, height: 1}} />
            <Pressable
              onPress={() => navigation.navigate('Time')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                marginTop: 15,
                marginVertical: 15,
              }}>
              <AntDesign name="clockcircleo" size={24} color="black" />
              <View style={{flex: 1}}>
                <Text style={{fontSize: 17, fontWeight: '500', color: 'black'}}>
                  Time
                </Text>
                <TextInput
                  editable={false}
                  value={timeInterval}
                  onChangeText={setTimeInterval}
                  style={{marginTop: 7, fontSize: 15, color: 'black'}}
                  placeholderTextColor={timeInterval ? 'black' : 'gray'}
                  placeholder={timeInterval ? timeInterval : 'Pick Exact Time'}
                />
              </View>
              <AntDesign name="right" size={24} color="black" />
            </Pressable>
            <Text style={{borderColor: '#E0E0E0', borderWidth: 1, height: 1}} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                marginTop: 7,
                marginVertical: 10,
              }}>
              <Feather name="activity" size={24} color="black" />
              <View style={{marginTop: 10}}>
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 15,
                    fontWeight: '500',
                    color: 'black',
                  }}>
                  Event Access
                </Text>
                <Pressable style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Pressable
                    onPress={() => setSelected('Public')}
                    style={
                      selected.includes('Public')
                        ? {
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            backgroundColor: '#07bc0c',
                            padding: 10,
                            borderRadius: 3,
                            justifyContent: 'center',
                            width: 140,
                          }
                        : {
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 3,
                            justifyContent: 'center',
                            width: 140,
                          }
                    }>
                    <Ionicons
                      name="earth"
                      size={24}
                      color={selected.includes('Public') ? 'white' : 'black'}
                    />
                    <Text
                      style={
                        selected.includes('Public')
                          ? {color: 'white', fontWeight: 'bold', fontSize: 15}
                          : {color: 'black', fontWeight: 'bold', fontSize: 15}
                      }>
                      Public
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setSelected('Invite Only')}
                    style={
                      selected.includes('Invite Only')
                        ? {
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            backgroundColor: '#07bc0c',
                            padding: 10,
                            borderRadius: 3,
                            justifyContent: 'center',
                            width: 140,
                          }
                        : {
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 3,
                            justifyContent: 'center',
                            width: 140,
                          }
                    }>
                    <AntDesign
                      name="lock1"
                      size={24}
                      color={
                        selected.includes('Invite Only') ? 'white' : 'black'
                      }
                    />
                    <Text
                      style={
                        selected.includes('Invite Only')
                          ? {color: 'white', fontWeight: 'bold', fontSize: 15}
                          : {color: 'black', fontWeight: 'bold', fontSize: 15}
                      }>
                      Invite Only
                    </Text>
                  </Pressable>
                </Pressable>
              </View>
            </View>
            <Text
              style={{
                borderColor: '#E0E0E0',
                borderWidth: 1,
                height: 1,
                marginTop: 7,
              }}
            />
            <Text style={{marginTop: 20, fontSize: 16, color: 'black'}}>
              Total Participants
            </Text>
            <View
              style={{
                padding: 10,
                backgroundColor: '#F0F0F0',
                marginTop: 10,
                borderRadius: 6,
              }}>
              <View style={{marginVertical: 5}}>
                <View>
                  <TextInput
                    value={noOfParticipants}
                    onChangeText={setNoOfParticipants}
                    style={{
                      padding: 10,
                      backgroundColor: 'white',
                      borderColor: '#D0D0D0',
                      borderWidth: 1,
                      borderRadius: 4,
                    }}
                    placeholder="Total Participants (including you)"
                  />
                </View>
              </View>
            </View>

            <Text
              style={{
                borderColor: '#E0E0E0',
                borderWidth: 1,
                height: 1,
                marginTop: 15,
              }}
            />
            <Text style={{marginTop: 20, fontSize: 16, color: 'black'}}>
              Add Instructions
            </Text>
            <View
              style={{
                padding: 10,
                backgroundColor: '#F0F0F0',
                marginTop: 10,
                borderRadius: 6,
              }}>
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <Ionicons name="bag-check" size={24} color="black" />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    fontWeight: '500',
                    color: 'black',
                  }}>
                  Bring your own equipment
                </Text>
                <FontAwesome name="check-square" size={24} color="green" />
              </View>

              <View
                style={{
                  marginVertical: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <MaterialCommunityIcons
                  name="directions-fork"
                  size={24}
                  color="#FEBE10"
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    fontWeight: '500',
                    color: 'black',
                  }}>
                  Cost Shared
                </Text>
                <FontAwesome name="check-square" size={24} color="green" />
              </View>

              <View
                style={{
                  marginVertical: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <FontAwesome5 name="syringe" size={24} color="green" />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    fontWeight: '500',
                    color: 'black',
                  }}>
                  Covid Vaccinated Participants Preferred
                </Text>
                <FontAwesome name="check-square" size={24} color="green" />
              </View>
              <TextInput
                style={{
                  padding: 10,
                  backgroundColor: 'white',
                  borderColor: '#d0d0d0',
                  borderWidth: 1,
                  marginVertical: 8,
                  borderRadius: 6,
                }}
                placeholder="Add Additional Instructions"
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 15,
                marginVertical: 10,
              }}>
              <AntDesign name="setting" size={24} color="black" />
              <View style={{flex: 1}}>
                <Text style={{color: 'black', fontSize: 15, fontWeight: '500'}}>
                  Advanced Settings
                </Text>
              </View>
              <AntDesign name="right" size={24} color="black" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipteDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={new SlideAnimation({slideFrom: 'bottom'})}
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}>
        <ModalContent
          style={{width: '100%', height: 400, backgroundColor: 'white'}}>
          <View>
            <Text>Choose Date/Time to host</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                flexWrap: 'wrap',
                marginVertical: 20,
              }}>
              {dates?.map((item, index) => (
                <Pressable
                  onPress={() => selectDate(item?.actualDate)}
                  key={index}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    borderColor: '#E0E0E0',
                    borderWidth: 1,
                    width: '30%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>{item?.displayDate}</Text>
                  <Text style={{color: 'gray', marginTop: 7}}>
                    {item?.dayOfWeek}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({});
