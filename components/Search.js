import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchBar = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginVertical: 5,
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFF',
          padding: 8,
          borderRadius: 20,
          marginRight: 10,
          flex: 1,
        }}>
        <Ionicons
          name="location-outline"
          size={20}
          color="#D32F2F"
          style={{marginRight: 5}}
        />
        <Text style={{color: '#333', fontSize: 14}}>Select City</Text>
        <Ionicons
          name="chevron-down-outline"
          size={18}
          color="#777"
          style={{marginLeft: 5}}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFF',
          padding: 8,
          borderRadius: 20,
          marginRight: 10,
          flex: 1,
        }}>
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#D32F2F"
          style={{marginRight: 5}}
        />
        <Text style={{color: '#333', fontSize: 14}}>Select Date</Text>
        <Ionicons
          name="chevron-down-outline"
          size={18}
          color="#777"
          style={{marginLeft: 5}}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#FFF',
          borderRadius: 20,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="search-outline" size={20} color="#D32F2F" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
