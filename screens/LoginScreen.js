import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../AuthContext';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {setUserId, setRole} = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://eventmate-rn.onrender.com/login',
        {
          email,
          password,
        },
      );

      const {accessToken, refreshToken, userId, role} = response.data;

      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
        ['userId', String(userId)],
        ['role', role],
      ]);

      setUserId(userId);
      setRole(role);

      if (role === 'organizer') {
        navigation.navigate('AdminDashboard');
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: '#fff'}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{flex: 1, justifyContent: 'center', paddingHorizontal: 20}}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#d32f2f',
              marginBottom: 20,
            }}>
            Login
          </Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 15,
              marginVertical: 10,
              borderRadius: 10,
              fontSize: 16,
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 15,
              marginVertical: 10,
              borderRadius: 10,
              fontSize: 16,
            }}
            secureTextEntry
          />

          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: '#d32f2f',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              marginVertical: 10,
            }}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                Login
              </Text>
            )}
          </TouchableOpacity>

          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text
              style={{
                textAlign: 'center',
                color: '#666',
                marginVertical: 10,
                fontSize: 14,
              }}>
              Don’t have an account? Register
            </Text>
          </Pressable>

          <Pressable onPress={() => alert('Forgot password?')}>
            <Text
              style={{
                textAlign: 'center',
                color: '#666',
                marginVertical: 5,
                fontSize: 14,
              }}>
              Forgot Password?
            </Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>

      <View style={{padding: 20, backgroundColor: 'white'}}>
        <Pressable
          onPress={() => navigation.navigate('Register')}
          style={{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#d32f2f',
            alignItems: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#d32f2f',
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            Ready
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
