import {jwtDecode} from 'jwt-decode'; // jwt-decode paketi import edilmeli
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, createContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

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
      const decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
  
      const userIdFromToken = decodedToken?.userId;
      const isUserOrganizer = decodedToken?.isOrganizer; // Token'dan isOrganizer çekiliyor
  
      if (userIdFromToken) {
        setUserId(userIdFromToken);
        setIsOrganizer(isUserOrganizer);  // isOrganizer'ı frontend'de state'e kaydedelim
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
        isOrganizer,  // Organizator bilgisi paylaşılıyor
        upcomingEvents,
        setUpcomingEvents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
