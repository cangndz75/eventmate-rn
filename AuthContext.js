import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState, createContext} from 'react';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);

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
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));

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
        setRole,
        setUserId,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
