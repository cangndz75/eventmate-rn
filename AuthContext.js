import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, createContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const userToken = await AsyncStorage.getItem('token');
      if (userToken) {
        setToken(userToken);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching token:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token) { 
        try {
          const decodedToken = jwtDecode(token); 
          const userId = decodedToken.userId; 
          setUserId(userId);
        } catch (error) {
          console.log('Error decoding token:', error);
        }
      }
    };

    fetchUser(); 
  }, [token]); 

  useEffect(() => {
    isLoggedIn(); 
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isLoading, setToken, userId, setUserId, upcomingEvents, setUpcomingEvents }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };