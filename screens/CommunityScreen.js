import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import axios from 'axios';

const CommunityScreen = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      const response = await axios.get(
        'https://biletixai.onrender.com/communities',
      );
      setCommunities(response.data);
    };
    fetchCommunities();
  }, []);

  return (
    <ScrollView>
      {communities.map(community => (
        <View key={community._id} style={{padding: 20}}>
          <Image
            source={{uri: community.image}}
            style={{width: 50, height: 50}}
          />
          <Text>{community.name}</Text>
          <Text>{community.membersCount} Members</Text>
          <TouchableOpacity>
            <Text>Join Community</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default CommunityScreen;
