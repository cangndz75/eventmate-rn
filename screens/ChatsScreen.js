import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../AuthContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Chat from '../components/Chat';

const ChatsScreen = () => {
  const [options, setOptions] = useState(['Chats', 'Requests']);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const {token, setToken, setUserId, userId} = useContext(AuthContext);

  const chooseOption = option => {
    if (options.includes(option)) {
      setOptions(options.filter(c => c !== option));
    } else {
      setOptions([...options, option]);
    }
  };

  const navigation = useNavigation();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken('');
      navigation.replace('Login');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      getRequests();
      getUser();
    }
  }, [userId]);

  const getRequests = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/getrequests/${userId}`,
      );
      console.log('Requests fetched:', response.data);
      setRequests(response.data);
    } catch (error) {
      console.log('Error fetching requests:', error);
    }
  };

  const acceptRequest = async requestId => {
    try {
      const response = await axios.post('http://10.0.2.2:8000/acceptrequest', {
        userId: userId,
        requestId: requestId,
      });

      if (response.status === 200) {
        await getRequests(); // Refresh requests
        await getUser(); // Refresh chats
      }
    } catch (error) {
      console.log('Error accepting request:', error);
    }
  };
  const rejectRequest = async requestId => {
    try {
      const response = await axios.post('http://10.0.2.2:8000/rejectrequest', {
        userId: userId,
        requestId: requestId,
      });

      if (response.status === 200) {
        // Refresh the requests after rejecting and removing from database
        setRequests(requests.filter(request => request.from._id !== requestId));
      }
    } catch (error) {
      console.log('Error rejecting request:', error);
    }
  };

  const deleteChat = async chatId => {
    try {
      const response = await axios.delete(
        `http://10.0.2.2:8000/messages/${chatId}`,
      );
      if (response.status === 200) {
        console.log('Message deleted:', response.data);
        setChats(chats.filter(chat => chat._id !== chatId)); // Remove from UI
      }
    } catch (error) {
      console.log('Error deleting chat:', error);
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/friends/${userId}`,
      );
      console.log('Chats (friends) fetched:', response.data);
      setChats(response.data);
    } catch (error) {
      console.log('Error fetching user (friends):', error);
    }
  };

  const renderChatItem = ({item, index}) => (
    <View
      key={`${item?._id}-${index}`}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 10,
      }}>
      <Chat item={item} />
      <Pressable onPress={() => deleteChat(item?._id)}>
        <AntDesign name="delete" size={24} color="red" />
      </Pressable>
    </View>
  );

  const renderRequestItem = ({item, index}) => (
    <View
      key={`${item?.from?._id}-${index}`} // Ensure the key is unique
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={{uri: item?.from?.image}}
          style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}}
        />
        <View>
          <Text style={{fontSize: 16, fontWeight: '500'}}>
            {item?.from?.firstName} {item?.from?.lastName}
          </Text>
          <Text style={{fontSize: 14, color: 'gray', marginTop: 2}}>
            {item?.message}
          </Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Pressable
          onPress={() => acceptRequest(item?.from?._id)}
          style={{
            backgroundColor: '#005187',
            padding: 8,
            borderRadius: 5,
            minWidth: 75,
          }}>
          <Text style={{color: 'white', textAlign: 'center'}}>Accept</Text>
        </Pressable>
        <Pressable onPress={() => rejectRequest(item?.from?._id)}>
          <AntDesign name="delete" size={24} color="red" />
        </Pressable>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      {/* Chats Section */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => chooseOption('Chats')}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.sectionTitle}>Chats</Text>
          <Entypo name="chevron-small-down" size={24} color="black" />
        </Pressable>
      </View>

      {options.includes('Chats') && (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No Chats yet</Text>
          )}
        />
      )}

      {/* Requests Section */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Pressable
          onPress={() => chooseOption('Requests')}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.sectionTitle}>Requests</Text>
          <Entypo name="chevron-small-down" size={24} color="black" />
        </Pressable>
      </View>

      {options.includes('Requests') && (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No Requests yet</Text>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20,
    fontSize: 16,
  },
});
