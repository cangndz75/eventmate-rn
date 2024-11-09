import React, {useContext} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {AuthContext} from '../AuthContext';

const CustomDrawerContent = props => {
  const {user} = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <View style={{padding: 20}}>
        <Image
          source={{
            uri: user?.profileImage || 'https://example.com/profile.jpg',
          }}
          style={{width: 60, height: 60, borderRadius: 30}}
        />
        <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 10}}>
          {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuSection: {
    marginTop: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
});
