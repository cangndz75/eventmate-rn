import React, {useContext, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomModal, ModalContent} from 'react-native-modals';
import moment from 'moment';
import {AuthContext} from '../../AuthContext';
import {useNavigation} from '@react-navigation/native';

const AdminCreateScreen = () => {
  const [event, setEvent] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [timeInterval, setTimeInterval] = useState('');
  const [noOfParticipants, setNoOfParticipants] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const navigation = useNavigation();
  const {userId} = useContext(AuthContext);
  const eventTypes = ['Concert', 'Football', 'Theater', 'Dance', 'Other'];

  const openImagePicker = () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 3}, response => {
      if (response.assets) setImages(response.assets);
    });
  };

  const generateContent = async field => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!event)
        return Alert.alert('Error', 'Please enter an event name first.');

      const response = await axios.post(
        'http://10.0.2.2:8000/generate',
        {eventName: event},
        {headers: {Authorization: `Bearer ${token.replace(/"/g, '')}`}},
      );

      if (response.status === 200) {
        const generatedContent = response.data.response.trim();
        field === 'description'
          ? setDescription(generatedContent)
          : setTags(generatedContent);
      } else {
        Alert.alert('Error', 'Failed to generate content. Try again.');
      }
    } catch (error) {
      console.error('Error generating content:', error.message);
      Alert.alert('Error', 'Failed to generate content. Try again.');
    }
  };

  const createEvent = async () => {
    if (
      !event ||
      !area ||
      !date ||
      !timeInterval ||
      !selectedType ||
      !noOfParticipants
    ) {
      return Alert.alert('Error', 'All fields are required.');
    }

    try {
      const eventData = {
        title: event,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
        location: area,
        date,
        time: timeInterval,
        eventType: selectedType.toLowerCase(),
        totalParticipants: parseInt(noOfParticipants, 10),
        organizer: userId,
      };

      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        'http://10.0.2.2:8000/createevent',
        eventData,
        {headers: {Authorization: `Bearer ${token.replace(/"/g, '')}`}},
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Event created successfully!', [
          {text: 'OK', onPress: () => navigation.navigate('AdminEvents')},
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Try again.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{padding: 20}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Ionicons
            name="arrow-back"
            size={28}
            onPress={() => navigation.goBack()}
          />
          <Text style={{fontSize: 28, fontWeight: 'bold', marginLeft: 10}}>
            Create Event
          </Text>
        </View>

        <TouchableOpacity onPress={openImagePicker} style={buttonStyle}>
          <Feather name="image" size={24} color="#4a4a4a" />
          <Text style={{marginTop: 5, color: '#4a4a4a'}}>Upload Photos</Text>
        </TouchableOpacity>

        <ScrollView horizontal style={{marginBottom: 10}}>
          {images.map((image, index) => (
            <Image key={index} source={{uri: image.uri}} style={imageStyle} />
          ))}
        </ScrollView>

        <TextInput
          placeholder="Event Name"
          value={event}
          onChangeText={setEvent}
          style={inputStyle}
        />

        <TextInput
          placeholder="Event Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[inputStyle, {height: 150}]}
        />
        <TouchableOpacity
          onPress={() => generateContent('description')}
          style={generateButtonStyle}>
          <Text style={buttonTextStyle}>Generate Description</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Tags (comma-separated)"
          value={tags}
          onChangeText={setTags}
          style={inputStyle}
        />
        <TouchableOpacity
          onPress={() => generateContent('tags')}
          style={generateButtonStyle}>
          <Text style={buttonTextStyle}>Generate Tags</Text>
        </TouchableOpacity>

        <Text style={{marginBottom: 10}}>Event Type</Text>
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20}}>
          {eventTypes.map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedType(type)}
              style={[
                typeButtonStyle,
                selectedType === type && {backgroundColor: '#4CAF50'},
              ]}>
              <Text style={{color: selectedType === type ? 'white' : 'black'}}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={datePickerStyle}>
          <Feather name="calendar" size={24} color="#4a4a4a" />
          <Text style={dateTextStyle}>{date || 'Select a Date'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTimeModalVisible(true)}
          style={datePickerStyle}>
          <AntDesign name="clockcircleo" size={24} color="#4a4a4a" />
          <Text style={dateTextStyle}>{timeInterval || 'Select a Time'}</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Total Participants"
          keyboardType="number-pad"
          value={noOfParticipants}
          onChangeText={setNoOfParticipants}
          style={inputStyle}
        />

        <TouchableOpacity onPress={createEvent} style={createButtonStyle}>
          <Text style={buttonTextStyle}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  padding: 15,
  marginBottom: 10,
};

const buttonStyle = {
  backgroundColor: '#f0f0f0',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  marginBottom: 10,
};

const generateButtonStyle = {
  backgroundColor: '#1E90FF',
  paddingVertical: 15,
  borderRadius: 10,
  marginBottom: 10,
};

const buttonTextStyle = {
  color: 'white',
  textAlign: 'center',
  fontSize: 16,
};

const typeButtonStyle = {
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: '#eee',
  borderRadius: 10,
  marginRight: 10,
  marginBottom: 10,
};

const datePickerStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  padding: 15,
  borderRadius: 10,
  marginVertical: 10,
};

const dateTextStyle = {
  fontSize: 16,
  color: '#7d7d7d',
  marginLeft: 10,
};

const imageStyle = {
  width: 80,
  height: 80,
  marginRight: 10,
  borderRadius: 10,
};

const createButtonStyle = {
  backgroundColor: '#07bc0c',
  paddingVertical: 15,
  borderRadius: 10,
  marginTop: 20,
};

export default AdminCreateScreen;
