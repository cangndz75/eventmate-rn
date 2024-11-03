import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';

const AdminCreateCommunityScreen = () => {
  const navigation = useNavigation();
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [headerImage, setHeaderImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [link3, setLink3] = useState('');

  const pickImage = setImage => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleCreateCommunity = async () => {
    // Validate required fields
    if (!communityName || !description) {
      Alert.alert('Error', 'Community name and description are required.');
      return;
    }

    const communityData = new FormData();
    communityData.append('name', communityName); // Ensure the key is exactly as expected on the backend
    communityData.append('description', description);
    communityData.append(
      'tags',
      JSON.stringify(tags.split(',').map(tag => tag.trim())),
    );
    communityData.append('isPrivate', isPrivate);

    // Append images as files if they are URIs
    if (headerImage) {
      communityData.append('headerImage', {
        uri: headerImage,
        type: 'image/jpeg', // Adjust the type as necessary
        name: 'header.jpg',
      });
    }

    if (profileImage) {
      communityData.append('profileImage', {
        uri: profileImage,
        type: 'image/jpeg', // Adjust the type as necessary
        name: 'profile.jpg',
      });
    }

    // Append links
    communityData.append(
      'links',
      JSON.stringify([link1, link2, link3].filter(link => link)),
    );

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        'https://biletixai.onrender.com/communities',
        communityData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Community created successfully.', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        Alert.alert('Error', 'Failed to create community.');
      }
    } catch (error) {
      console.error(
        'Error creating community:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create community.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView contentContainerStyle={{padding: 20}} style={{flex: 1}}>
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
          Create Community
        </Text>

        {/* Header Image Picker */}
        <TouchableOpacity
          onPress={() => pickImage(setHeaderImage)}
          style={{alignItems: 'center', marginBottom: 20}}>
          <View
            style={{
              width: '100%',
              height: 150,
              backgroundColor: '#e0e0e0',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            {headerImage ? (
              <Image
                source={{uri: headerImage}}
                style={{width: '100%', height: '100%', borderRadius: 10}}
              />
            ) : (
              <Ionicons name="camera" size={50} color="#888" />
            )}
          </View>
          <Text>Upload Header Image</Text>
        </TouchableOpacity>

        {/* Profile Image Picker */}
        <TouchableOpacity
          onPress={() => pickImage(setProfileImage)}
          style={{alignItems: 'center', marginBottom: 20}}>
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: '#e0e0e0',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
            }}>
            {profileImage ? (
              <Image
                source={{uri: profileImage}}
                style={{width: '100%', height: '100%', borderRadius: 50}}
              />
            ) : (
              <Ionicons name="camera" size={50} color="#888" />
            )}
          </View>
          <Text>Upload Profile Image</Text>
        </TouchableOpacity>

        {/* Community Name */}
        <TextInput
          placeholder="Community Name"
          value={communityName}
          onChangeText={setCommunityName}
          style={styles.inputStyle}
        />

        {/* Description */}
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.inputStyle, {height: 100}]}
        />

        {/* Tags */}
        <TextInput
          placeholder="Tags (comma separated)"
          value={tags}
          onChangeText={setTags}
          style={styles.inputStyle}
        />

        {/* Links */}
        <TextInput
          placeholder="Link 1"
          value={link1}
          onChangeText={setLink1}
          style={styles.inputStyle}
        />
        <TextInput
          placeholder="Link 2"
          value={link2}
          onChangeText={setLink2}
          style={styles.inputStyle}
        />
        <TextInput
          placeholder="Link 3"
          value={link3}
          onChangeText={setLink3}
          style={styles.inputStyle}
        />

        {/* Visibility Switch */}
        <View style={styles.switchContainer}>
          <Text style={{fontSize: 16}}>Make Community Private</Text>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            style={{marginLeft: 10}}
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity
          onPress={handleCreateCommunity}
          style={styles.createButtonStyle}>
          <Text style={styles.buttonTextStyle}>Create Community</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  inputStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  buttonTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  createButtonStyle: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
};

export default AdminCreateCommunityScreen;
