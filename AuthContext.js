import jwtDecode from 'jwt-decode'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, createContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
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

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));
  
      console.log('Decoded token:', decodedData);
  
      const userIdFromToken = decodedData?.userId;
      const isUserOrganizer = decodedData?.isOrganizer;
  
      if (userIdFromToken) {
        setUserId(userIdFromToken);
        setIsOrganizer(isUserOrganizer);
        console.log('Decoded isOrganizer:', isUserOrganizer);
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
        setUserId,
        isOrganizer,
        favorites,
        setFavorites,
        upcomingEvents,
        setUpcomingEvents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
