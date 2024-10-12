import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';

const Amenities = () => {
  const services = [
    {id: '0', name: 'Bar'},
    {id: '1', name: 'Free Wi-Fi'},
    {id: '2', name: 'Toilets'},
    {id: '3', name: 'Changing Rooms'},
    {id: '4', name: 'Drinking Water'},
    {id: '5', name: 'Food Stalls'},
    {id: '6', name: 'VIP Lounge'},
    {id: '7', name: 'Coat Check'},
    {id: '8', name: 'Parking'},
    {id: '9', name: 'First Aid Station'},
  ];

  const renderAmenity = ({item}) => (
    <View style={styles.amenityCard}>
      <Text style={styles.amenityText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facilities & Amenities</Text>
      <FlatList
        data={services}
        renderItem={renderAmenity}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{paddingBottom: 10}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Amenities;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amenityCard: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '30%',
  },
  amenityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
