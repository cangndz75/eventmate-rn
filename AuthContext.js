import React, {useEffect, useState, createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {decode as atob} from 'base-64';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Sets the token and updates the context state.
   */
  const setToken = async (token, refresh) => {
    try {
      await AsyncStorage.multiSet([
        ['accessToken', token],
        ['refreshToken', refresh],
      ]);
      setAccessToken(token);
      setRefreshToken(refresh);
      await decodeToken(token);
    } catch (error) {
      console.error('Error setting token:', error);
      clearUserData();
    }
  };

  /**
   * Clears all user-related data from AsyncStorage and resets state.
   */
  const clearUserData = async () => {
    try {
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userId',
        'role',
      ]);
      setAccessToken(null);
      setRefreshToken(null);
      setUserId(null);
      setRole('user');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  /**
   * Decodes the JWT token and updates the user state.
   */
  const decodeToken = async token => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedData.exp < currentTime) {
        if (refreshToken) {
          await refreshAccessToken();
          return;
        }
        throw new Error('Token has expired');
      }

      setUserId(decodedData.userId);
      setRole(decodedData.role);
    } catch (error) {
      console.error('Error decoding token:', error);
      clearUserData();
    }
  };

  /**
   * Refreshes the access token using the refresh token.
   */
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }

      const response = await axios.post(
        'https://eventmate-rn.onrender.com/refresh',
        {
          token: refreshToken,
        },
      );

      const {accessToken: newAccessToken} = response.data;
      if (!newAccessToken) {
        throw new Error('Failed to fetch new access token');
      }

      await AsyncStorage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);
      await decodeToken(newAccessToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearUserData();
    }
  };

  /**
   * Checks if the user is logged in by validating stored tokens.
   */
  const isLoggedIn = async () => {
    try {
      const [storedAccessToken, storedRefreshToken] =
        await AsyncStorage.multiGet(['accessToken', 'refreshToken']);

      if (storedAccessToken[1]) {
        setAccessToken(storedAccessToken[1]);
        setRefreshToken(storedRefreshToken[1]);
        await decodeToken(storedAccessToken[1]);
      } else {
        console.log('No valid token found');
        clearUserData();
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      clearUserData();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles user login by saving the tokens and decoding the access token.
   */
  const login = async (accessToken, refreshToken) => {
    await setToken(accessToken, refreshToken);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userId,
        role,
        isLoading,
        setToken,
        clearUserData,
        refreshAccessToken,
        isLoggedIn,
        login,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
