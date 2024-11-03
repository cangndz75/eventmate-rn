import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';

const AdminCreateCommunityScreen = () => {
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [headerImage, setHeaderImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [link, setLink] = useState('');
  const navigation = useNavigation();

  const pickImage = async setImage => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateCommunity = async () => {
    const token = await AsyncStorage.getItem('token');
  
    const communityData = {
      name: communityName.trim(),
      description: description.trim(),
      tags: tags.split(',').map(tag => tag.trim()),
      isPrivate,
      link,
    };
  
    try {
      const response = await axios.post(
        'https://biletixai.onrender.com/communities',
        communityData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        Alert.alert('Success', 'Community created successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create community.');
      }
    } catch (error) {
      console.error('Error creating community:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data.message || 'Failed to create community.');
    }
  };
  

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
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
              Create Community
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => pickImage(setHeaderImage)}
            style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Upload Header Image</Text>
            {headerImage && (
              <Image source={{uri: headerImage}} style={styles.imagePreview} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickImage(setProfileImage)}
            style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Upload Profile Image</Text>
            {profileImage && (
              <Image source={{uri: profileImage}} style={styles.imagePreview} />
            )}
          </TouchableOpacity>

          <TextInput
            placeholder="Community Name"
            value={communityName}
            onChangeText={setCommunityName}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, {height: 100}]}
          />
          <TextInput
            placeholder="Tags (comma separated)"
            value={tags}
            onChangeText={setTags}
            style={styles.input}
          />

          <Text style={{fontSize: 16, marginVertical: 10}}>Link</Text>
          <TextInput
            placeholder="Link"
            value={link}
            onChangeText={setLink}
            style={styles.input}
          />

          <View style={styles.switchContainer}>
            <Text style={{fontSize: 16}}>Make Community Private</Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              style={{marginLeft: 10}}
            />
          </View>

          <TouchableOpacity
            onPress={handleCreateCommunity}
            style={styles.createButton}>
            <Text style={styles.buttonText}>Create Community</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#4a4a4a',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  createButton: {
    backgroundColor: '#07bc0c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
};

export default AdminCreateCommunityScreen;
