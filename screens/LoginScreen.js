import {
  KeyboardAvoidingView,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import jwt_decode from 'jwt-decode';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const {setToken, setUserId, setIsOrganizer} = useContext(AuthContext);
  const [token, setTokenState] = useState(null);

  useEffect(() => {
    if (token) {
      navigation.replace('MainStack', {screen: 'Main'});
    }
  }, [token, navigation]);

  const handleLogin = () => {
    const user = {email, password};
    axios
      .post('http://10.0.2.2:8000/login', user)
      .then(response => {
        const {token, isOrganizer} = response.data;
        AsyncStorage.setItem('token', token);
        setToken(token);
        setUserId(response.data.userId);
        setIsOrganizer(isOrganizer);
      })
      .catch(error => console.error('Login error:', error));
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{padding: 10, alignItems: 'center'}}>
        <KeyboardAvoidingView>
          <View style={{marginTop: 80, alignItems: 'center'}}>
            <Text style={{fontSize: 20, fontWeight: '500'}}>
              Login to your account
            </Text>
          </View>
          <View style={{marginTop: 50}}>
            <View>
              <Text style={{fontSize: 18, fontWeight: '600', color: 'gray'}}>
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#BEBEBE"
                style={{
                  width: 340,
                  marginTop: 15,
                  borderBottomColor: '#BEBEBE',
                  borderBottomWidth: 1,
                  paddingBottom: 10,
                  fontSize: 15,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: 'gray',
                  marginTop: 25,
                }}>
                Password
              </Text>
              <TextInput
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#BEBEBE"
                style={{
                  width: 340,
                  marginTop: 15,
                  borderBottomColor: '#BEBEBE',
                  borderBottomWidth: 1,
                  paddingBottom: 10,
                  fontSize: 15,
                }}
              />
            </View>
            <Pressable
              onPress={handleLogin}
              style={{
                width: 200,
                backgroundColor: 'green',
                padding: 15,
                marginTop: 50,
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: 6,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Login
              </Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'gray',
                  fontSize: 16,
                  margin: 12,
                }}>
                Don't have an account? Sign Up
              </Text>
            </Pressable>
          </View>
          <View style={{marginTop: 50, alignItems: 'center'}}>
            <Image
              style={{width: 110, height: 60, resizeMode: 'contain'}}
              source={{
                uri: 'https://playo-website.gumlet.io/playo-website-v2/logos-icons/new-logo-playo.png?q=50',
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
