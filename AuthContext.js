import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState, createContext} from 'react';
import {decode as atob} from 'base-64';
const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      console.log('Stored Token:', storedToken);

      if (storedToken) {
        setToken(storedToken);
        decodeToken(storedToken); 
      } else {
        console.warn('Token bulunamadı, kullanıcı giriş yapmamış');
      }
    } catch (error) {
      console.log('Error fetching token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const decodeToken = token => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));

      console.log('Decoded Token Data:', decodedData);

      const userIdFromToken = decodedData?.userId;
      const userRole = decodedData?.role;

      if (userIdFromToken) {
        setUserId(userIdFromToken);
        setRole(userRole);
      } else {
        console.warn('Token içinde userId bulunamadı');
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
