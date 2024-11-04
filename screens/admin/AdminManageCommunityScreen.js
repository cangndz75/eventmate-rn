import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute, useNavigation} from '@react-navigation/native';

const AdminManageCommunityScreen = () => {
  const [requests, setRequests] = useState([]);
  const route = useRoute();
  const {communityId} = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `https://biletixai.onrender.com/communities/${communityId}/join-requests`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        setRequests(response.data);
      } catch (error) {
        console.error('İstekleri çekerken hata:', error.message);
        Alert.alert('Hata', 'İstekler bulunamadı.');
      }
    };
    fetchJoinRequests();
  }, [communityId]);

  const handleApproveRequest = async requestId => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `https://biletixai.onrender.com/communities/${communityId}/join-requests/${requestId}/approve`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === requestId ? {...req, status: 'approved'} : req,
        ),
      );
      Alert.alert('Başarılı', 'İstek onaylandı.');
    } catch (error) {
      console.error('İstek onaylarken hata:', error.message);
      Alert.alert('Hata', 'İstek onaylanamadı.');
    }
  };

  const handleRejectRequest = async requestId => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `https://biletixai.onrender.com/communities/${communityId}/join-requests/${requestId}/reject`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === requestId ? {...req, status: 'rejected'} : req,
        ),
      );
      Alert.alert('Başarılı', 'İstek reddedildi.');
    } catch (error) {
      console.error('İstek reddederken hata:', error.message);
      Alert.alert('Hata', 'İstek reddedilemedi.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{padding: 20}}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{color: '#007bff', marginBottom: 10}}>Geri Dön</Text>
      </TouchableOpacity>
      {requests.map(request => (
        <View
          key={request._id}
          style={{
            backgroundColor: '#f9f9f9',
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {request.userId.firstName} {request.userId.lastName}
          </Text>
          <Text style={{color: 'gray', marginBottom: 5}}>
            Durum: {request.status}
          </Text>
          <Text style={{marginBottom: 5}}>Cevaplar:</Text>
          {Array.from(request.answers.entries()).map(
            ([question, answer], idx) => (
              <Text key={idx} style={{marginLeft: 10}}>
                {question}: {answer}
              </Text>
            ),
          )}
          {request.status === 'pending' && (
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <TouchableOpacity
                onPress={() => handleApproveRequest(request._id)}
                style={{
                  backgroundColor: '#28a745',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  marginRight: 10,
                }}>
                <Text style={{color: 'white'}}>Onayla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRejectRequest(request._id)}
                style={{
                  backgroundColor: '#dc3545',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                }}>
                <Text style={{color: 'white'}}>Reddet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default AdminManageCommunityScreen;
