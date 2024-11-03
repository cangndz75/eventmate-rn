import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { pickImage } from "../../utils/uploadUtils";
const AdminCreateCommunityScreen = () => {
  const navigation = useNavigation();
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [headerPhoto, setHeaderPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [link3, setLink3] = useState('');

  const handleCreateCommunity = async () => {
    if (!communityName || !description) {
      Alert.alert("Error", "Community name and description are required.");
      return;
    }

    try {
      const response = await axios.post('https://your-api-url.com/communities', {
        communityName,
        description,
        tags,
        isPrivate,
        headerPhoto,
        profilePhoto,
        link1,
        link2,
        link3,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Community created successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to create community.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Create Community</Text>

        {/* Header Photo */}
        <TouchableOpacity onPress={() => pickImage(setHeaderPhoto)} style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{
            width: '100%',
            height: 150,
            backgroundColor: '#e0e0e0',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
            {headerPhoto ? (
              <Image source={{ uri: headerPhoto }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
            ) : (
              <Ionicons name="camera" size={50} color="#888" />
            )}
          </View>
          <Text>Upload Header Photo</Text>
        </TouchableOpacity>

        {/* Profile Photo */}
        <TouchableOpacity onPress={() => pickImage(setProfilePhoto)} style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{
            width: 100,
            height: 100,
            backgroundColor: '#e0e0e0',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
          }}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={{ width: '100%', height: '100%', borderRadius: 50 }} />
            ) : (
              <Ionicons name="camera" size={50} color="#888" />
            )}
          </View>
          <Text>Upload Profile Photo</Text>
        </TouchableOpacity>

        {/* Community Name */}
        <TextInput
          placeholder="Community Name"
          value={communityName}
          onChangeText={setCommunityName}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
          }}
        />

        {/* Description */}
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
            height: 100,
          }}
        />

        {/* Tags */}
        <TextInput
          placeholder="Tags (comma separated)"
          value={tags}
          onChangeText={setTags}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
          }}
        />

        {/* Links */}
        <TextInput
          placeholder="Link 1"
          value={link1}
          onChangeText={setLink1}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
          }}
        />
        <TextInput
          placeholder="Link 2"
          value={link2}
          onChangeText={setLink2}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
          }}
        />
        <TextInput
          placeholder="Link 3"
          value={link3}
          onChangeText={setLink3}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
          }}
        />

        {/* Visibility Switch */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 16 }}>Make Community Private</Text>
          <Switch value={isPrivate} onValueChange={setIsPrivate} style={{ marginLeft: 10 }} />
        </View>

        {/* Create Button */}
        <TouchableOpacity onPress={handleCreateCommunity} style={styles.createButton}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Community</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  createButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
};

export default AdminCreateCommunityScreen;
