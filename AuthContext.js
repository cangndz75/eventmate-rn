import React, {useEffect, useState, createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {decode as atob} from 'base-64';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(true);

  const clearUserData = async () => {
    try {
      setAccessToken(null);
      setUserId(null);
      setUser(null);
      setRole('user');
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userId',
        'role',
      ]);
    } catch (error) {
      console.error('Error clearing user data:', error);
      Alert.alert('Error', 'Failed to clear user data. Please try again.');
    }
  };

  const decodeToken = async (token, refreshToken) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedData.exp < currentTime) {
        if (refreshToken) {
          await refreshAccessToken(refreshToken);
          return;
        }
        throw new Error('Token has expired');
      }

      setAccessToken(token);
      setUserId(decodedData.userId);
      setRole(decodedData.role);
    } catch (error) {
      console.error('Error decoding token:', error);
      await clearUserData();
    }
  };

  const refreshAccessToken = async refreshToken => {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }

      const response = await axios.post(
        'https://eventmate-rn.onrender.com/refresh',
        {token: refreshToken},
        {timeout: 10000},
      );

      const {accessToken: newAccessToken} = response.data;
      if (!newAccessToken) {
        throw new Error('Failed to fetch new access token');
      }

      await AsyncStorage.setItem('accessToken', newAccessToken);
      await decodeToken(newAccessToken, refreshToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
      await clearUserData();
    }
  };

  const isLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setAccessToken(token);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };
  
  const login = async (newAccessToken, newRefreshToken) => {
    try {
      await AsyncStorage.multiSet([
        ['accessToken', newAccessToken],
        ['refreshToken', newRefreshToken],
      ]);
      await decodeToken(newAccessToken, newRefreshToken);
    } catch (error) {
      console.error('Login error:', error);
      await clearUserData();
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isLoading,
        setAccessToken,
        userId,
        user,
        role,
        setRole,
        setUserId,
        clearUserData,
        login,
        isLoggedIn,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
