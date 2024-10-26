import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import {BottomModal, ModalContent, SlideAnimation} from 'react-native-modals';
import axios from 'axios';

const EventSetUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userId} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState('none');
  const [selectedTab, setSelectedTab] = useState('About');
  const {item} = route.params;
  const eventId = item?._id;

  useEffect(() => {
    if (item) {
      fetchEventDetails();
    } else {
      Alert.alert('Error', 'No event data found.');
      navigation.goBack();
    }
  }, [item]);

  const fetchEventDetails = async () => {
    try {
      await fetchReviews();
      await checkRequestStatus();
    } catch (error) {
      console.error('Error fetching event details:', error);
      ToastAndroid.show('Failed to load event details', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `https://biletixai.onrender.com/events/${eventId}/reviews`,
      );
      setReviews(response.data || []);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No reviews found');
        setReviews([]);
      } else {
        console.error('Error fetching reviews:', error);
        ToastAndroid.show('Failed to fetch reviews', ToastAndroid.SHORT);
      }
    }
  };

  const submitReview = async () => {
    if (!comment) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }
    try {
      await axios.post(
        `https://biletixai.onrender.com/events/${eventId}/reviews`,
        {userId, comment},
      );
      setReviews(prev => [...prev, {userId, review: comment}]);
      setComment('');
      ToastAndroid.show('Review added!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review.');
    }
  };

  const checkRequestStatus = async () => {
    try {
      const response = await axios.get(
        `https://biletixai.onrender.com/events/${eventId}/requests`,
      );
      const userRequest = response.data.find(req => req.userId === userId);
      setRequestStatus(userRequest ? userRequest.status : 'none');
    } catch (error) {
      console.error('Error fetching requests:', error);
      ToastAndroid.show('Failed to check request status', ToastAndroid.SHORT);
    }
  };

  const renderGoingSection = () => (
    <FlatList
      horizontal
      data={item.attendees}
      keyExtractor={(attendee, index) => attendee._id + index}
      renderItem={({item: attendee}) => (
        <Image
          source={{uri: attendee.image || 'https://via.placeholder.com/50'}}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginHorizontal: 5,
          }}
        />
      )}
      contentContainerStyle={{marginVertical: 10}}
    />
  );

  const renderReviewSection = () => (
    <View style={{ marginVertical: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold' }}>Reviews</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ReviewScreen',{ eventId }) }>
          <Text style={{ color: 'blue' }}>See All</Text>
        </TouchableOpacity>
      </View>
  
      {reviews.length === 0 ? (
        <Text>No reviews available.</Text>
      ) : (
        reviews.slice(0, 2).map((review, index) => (
          <View
            key={index}
            style={{
              backgroundColor: '#f0f0f0',
              padding: 10,
              marginVertical: 5,
              borderRadius: 8,
            }}
          >
            <Text>{review.review}</Text>
          </View>
        ))
      )}
  
      <TextInput
        placeholder="Add your review"
        value={comment}
        onChangeText={setComment}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          marginTop: 10,
        }}
      />
      <TouchableOpacity onPress={submitReview} style={{ backgroundColor: 'green', padding: 15, borderRadius: 8, marginTop: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
  

  const renderActionButton = () => (
    <TouchableOpacity
      onPress={() => setModalVisible(true)}
      style={{
        backgroundColor: requestStatus === 'none' ? 'green' : 'gray',
        padding: 15,
        margin: 10,
        borderRadius: 8,
      }}>
      <Text style={{color: 'white', textAlign: 'center'}}>
        {requestStatus === 'none' ? 'Join Event' : 'Pending'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Event...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <View style={{position: 'relative'}}>
          <Image
            source={{
              uri: item?.images?.[0] || 'https://via.placeholder.com/600x300',
            }}
            style={{width: '100%', height: 300, resizeMode: 'cover'}}
          />
          <Text
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              padding: 5,
              borderRadius: 5,
            }}>
            {item.time}
          </Text>
        </View>
        <View style={{position: 'absolute', top: 20, left: 20}}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
            onPress={() => navigation.goBack()} 
          />
        </View>

        <View
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Ionicons
            name="heart-outline"
            size={24}
            color="#fff"
            onPress={() => ToastAndroid.show('Favorited!', ToastAndroid.SHORT)}
          />
          <Ionicons
            name="search"
            size={24}
            color="#fff"
            onPress={() =>
              ToastAndroid.show('Search clicked!', ToastAndroid.SHORT)
            }
          />
        </View>

        <View style={{padding: 16}}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>
            {item?.title || 'Event Title'}
          </Text>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <MaterialIcons name="location-on" size={24} color="#5c6bc0" />
            <Text style={{marginLeft: 10}}>
              {item?.location || 'Event Location'}
            </Text>
          </View>

          <Text style={{fontWeight: 'bold', marginVertical: 10}}>
            Hosted by: {item.organizer || 'Unknown Organizer'}
          </Text>
          {renderGoingSection()}

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 10,
                borderBottomWidth: selectedTab === 'About' ? 2 : 0,
              }}
              onPress={() => setSelectedTab('About')}>
              <Text>About</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 10,
                borderBottomWidth: selectedTab === 'Review' ? 2 : 0,
              }}
              onPress={() => setSelectedTab('Review')}>
              <Text>Review</Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'About' ? (
            <Text style={{marginVertical: 10}}>
              {item?.description || 'Event Description'}
            </Text>
          ) : (
            renderReviewSection()
          )}

          {renderActionButton()}

          <BottomModal
            visible={modalVisible}
            onTouchOutside={() => setModalVisible(false)}
            modalAnimation={new SlideAnimation({slideFrom: 'bottom'})}>
            <ModalContent style={{padding: 20}}>
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Add a comment..."
                style={{
                  borderColor: '#ccc',
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 10,
                  height: 100,
                  textAlignVertical: 'top',
                  marginBottom: 10,
                }}
              />
              <TouchableOpacity
                onPress={submitReview}
                style={{
                  backgroundColor: 'green',
                  padding: 15,
                  borderRadius: 8,
                  alignItems: 'center',
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Submit Review
                </Text>
              </TouchableOpacity>
            </ModalContent>
          </BottomModal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventSetUpScreen;
