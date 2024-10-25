import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import axios from 'axios';
import {AuthContext} from '../AuthContext'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from 'react-native-alert-notification';

const interests = [
  'Music Festivals',
  'Cultural',
  'Seminars',
  'Sports',
  'Theater',
  'Book Fair',
  'Food & Drink Festival',
  'Stand-up Comedy',
  'Dance',
  'Trade Shows',
  'Charity Events',
  'Fashion Shows',
  'Science & Tech',
  'Travel & Tourism',
  'Carnivals',
];

const InterestSelectionScreen = ({navigation}) => {
  const {userId} = useContext(AuthContext);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = interest => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Limit Aşıldı',
        textBody: 'En fazla 5 ilgi alanı seçebilirsiniz.',
        button: 'Kapat',
      });
    }
  };

  const saveInterests = async () => {
    try {
      await axios.post(
        `https://biletixai.onrender.com/user/${userId}/interests`,
        {
          interests: selectedInterests,
        },
      );
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Başarılı!',
        textBody: 'İlgi alanlarınız kaydedildi!',
        button: 'Tamam',
      });
      navigation.navigate('Home');
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Hata!',
        textBody: 'İlgi alanlarınız kaydedilirken bir sorun oluştu.',
        button: 'Kapat',
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          backgroundColor: '#fff',
        }}>
        <Text style={{fontSize: 32, fontWeight: 'bold', marginBottom: 5}}>
          Choose
        </Text>
        <Text style={{fontSize: 32, fontWeight: 'bold', marginBottom: 15}}>
          Your Interest
        </Text>
        <Text style={{fontSize: 16, color: '#666', marginBottom: 20}}>
          Choose your favourite interests and let us help you find the perfect
          events for you!
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}>
          {interests.map((interest, index) => (
            <TouchableOpacity
              key={index}
              style={{
                borderWidth: 1,
                borderColor: selectedInterests.includes(interest)
                  ? '#f0b400'
                  : '#ccc',
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 15,
                margin: 5,
                backgroundColor: selectedInterests.includes(interest)
                  ? '#f0b400'
                  : '#fff',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '45%', 
              }}
              onPress={() => toggleInterest(interest)}>
              <Text
                style={{
                  fontSize: 16,
                  color: selectedInterests.includes(interest) ? '#fff' : '#333',
                  fontWeight: 'bold',
                }}>
                {interest}
              </Text>
              {selectedInterests.includes(interest) && (
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 30,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={{
              backgroundColor: '#007bff',
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 20,
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={saveInterests}
            style={{
              backgroundColor: '#007bff',
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 20,
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AlertNotificationRoot>
  );
};

export default InterestSelectionScreen;
