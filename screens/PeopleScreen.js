import {StyleSheet, Text, View, SafeAreaView, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../AuthContext';
import User from '../components/User';
import {useNavigation} from '@react-navigation/native';

const PeopleScreen = () => {
  const [users, setUsers] = useState([]);
  const {token, userId} = useContext(AuthContext);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/users`);
      const data = await response.json();
      console.log('Fetched Users:', data); // Log the data
      setUsers(data); // Ensure you set the users state
    } catch (error) {
      console.log('Error fetching users:', error); // Log any errors
    }
  };

  console.log('users', users);
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 15,
            fontWeight: '500',
            marginTop: 12,
          }}>
          People using EventMate
        </Text>
      </View>
      <FlatList
        data={users}
        renderItem={({item}) => <User item={item} key={item?._id} />}
      />
    </SafeAreaView>
  );
};

export default PeopleScreen;

const styles = StyleSheet.create({});
