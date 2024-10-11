import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState, createContext} from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        decodeToken(storedToken);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching token:', error);
      setIsLoading(false);
    }
  };

  const decodeToken = token => {
    try {
      const decodedData = jwt_decode(token);
      const userIdFromToken = decodedData?.userId;
      const userRole = decodedData?.role;

      if (userIdFromToken) {
        setUserId(userIdFromToken);
        setRole(userRole);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        setToken,
        userId,
        role,
        favorites,
        setFavorites,
        upcomingEvents,
        setUpcomingEvents,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
