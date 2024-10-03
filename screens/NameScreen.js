import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {saveRegistrationProgress} from '../registrationUtils';
import { getRegistrationProgress } from '../registrationUtils';

const NameScreen = () => {
  const [name, setName] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const navigation = useNavigation();

  useEffect(() => {
    getRegistrationProgress('Name').then(progressData => {
      if (progressData) {
        setName(progressData.name || '');
        setLastname(progressData.lastname || '');
      }
    });
  }, []);
  const saveName = () => {
    if (name.trim() !== '') {
      saveRegistrationProgress('Name', {name, lastname});
    }
    navigation.navigate('Image');
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          <Ionicons name="arrow-back" size={24} color="black" />
        </View>
        <View style={{marginHorizontal: 10, marginVertical: 15}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Complete Your Profile
          </Text>
          <Text style={{marginTop: 10, fontWeight: 'bold'}}>
            What should we call you? Enter your name and add a profile picture
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            marginVertical: 25,
            gap: 20,
            flexDirection: 'column',
          }}>
          <View>
            <Text style={{color: 'black', fontSize: 16}}>First Name*</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={{
                padding: 10,
                borderColor: '#D0D0D0',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          </View>
          <View>
            <Text style={{fontSize: 16, color: 'black'}}>Last Name*</Text>
            <TextInput
              value={name}
              onChangeText={setLastname}
              style={{
                padding: 10,
                borderColor: '#D0D0D0',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
      <Pressable
        onPress={saveName}
        style={{
          backgroundColor: '#07bc0c',
          marginTop: 'auto',
          marginBottom: 30,
          padding: 12,
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
          Next
        </Text>
      </Pressable>
    </>
  );
};

export default NameScreen;

const styles = StyleSheet.create({});
