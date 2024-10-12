import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const VenueCard = ({item, onPress}) => {
  return (
    <View style={{margin: 15}}>
      <Pressable
        onPress={onPress} 
        style={{
          backgroundColor: 'white',
          borderRadius: 5,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        <Image
          style={{
            width: '100%',
            height: 200,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          source={{uri: item.image}}
        />
        <View style={{paddingVertical: 12, paddingHorizontal: 10}}>
          <Text style={{color: 'black'}}>
            {item.name.length > 40
              ? `${item.name.substring(0, 40)}...`
              : item.name}
          </Text>
          <Text style={{color: 'gray'}}>
            {item.address.length > 40
              ? `${item.address.substring(0, 40)}...`
              : item.address}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default VenueCard;

const styles = StyleSheet.create({
  cardContainer: {
    margin: 15,
  },
  cardPressable: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  venueName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 5,
  },
  ratingText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  addressText: {
    color: 'gray',
    marginTop: 4,
  },
  separator: {
    height: 1,
    borderWidth: 0.6,
    borderColor: '#E0E0E0',
    marginVertical: 10,
  },
  sportsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sportsTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
  sportsList: {
    color: 'gray',
    marginLeft: 5,
    flex: 1,
  },
});
