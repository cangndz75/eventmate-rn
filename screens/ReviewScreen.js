import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const ReviewScreen = ({route, navigation}) => {
  const eventId = route?.params?.eventId;
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [averageScore, setAverageScore] = useState(0.0);
  const [selectedFilter, setSelectedFilter] = useState('All time');

  useEffect(() => {
    if (eventId) {
      fetchReviews();
    } else {
      console.error('Event ID is missing.');
      Alert.alert('Error', 'No event ID provided.');
      navigation.goBack();
    }
  }, [eventId]);

  const fetchReviews = async () => {
      const response = await axios.get(
        `https://biletixai.onrender.com/events/${eventId}/reviews`,
      );
      const reviewsData = response.data || [];
      setReviews(reviewsData);
      setFilteredReviews(reviewsData);
      calculateAverageScore(reviewsData);
    }

  const submitReview = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(
        `https://biletixai.onrender.com/events/${eventId}/reviews`,
        {review: comment},
      );

      if (response.status === 201) {
        setReviews(prev => [...prev, {review: comment}]);
        setComment('');
        ToastAndroid.show('Review added!', ToastAndroid.SHORT);
      } else {
        throw new Error('Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to submit review.';
      Alert.alert('Error', errorMessage);
    }
  };

  const calculateAverageScore = reviews => {
    if (reviews.length === 0) {
      setAverageScore(0.0);
      return;
    }
    const totalScore = reviews.reduce((sum, review) => sum + review.rating, 0);
    setAverageScore(totalScore / reviews.length);
  };

  const renderReviewItem = ({item}) => (
    <View style={styles.reviewItem}>
      <Image
        source={{uri: item.userImage || 'https://via.placeholder.com/50'}}
        style={styles.userImage}
      />
      <View style={{flex: 1}}>
        <Text style={styles.userName}>{item.userName}</Text>
        <View style={{flexDirection: 'row', marginVertical: 5}}>
          {Array(5)
            .fill()
            .map((_, index) => (
              <Ionicons
                key={index}
                name={index < item.rating ? 'star' : 'star-outline'}
                size={16}
                color="#ffa500"
              />
            ))}
        </View>
        <Text>{item.review}</Text>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Reviews</Text>
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderReviewItem}
        style={styles.reviewList}
      />
      <View style={styles.averageScoreContainer}>
        <Text style={styles.averageScore}>{averageScore.toFixed(1)}</Text>
        <View style={styles.starsContainer}>
          {Array(5)
            .fill()
            .map((_, index) => (
              <Ionicons
                key={index}
                name={
                  index < Math.floor(averageScore) ? 'star' : 'star-outline'
                }
                size={20}
                color="#ffa500"
              />
            ))}
        </View>
      </View>

      <View style={styles.filterContainer}>
        {['All time', 'This month', 'This year', 'This week'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => applyFilter(filter)}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Send your review"
          value={comment}
          onChangeText={setComment}
          style={styles.textInput}
        />
        <TouchableOpacity onPress={() => console.log('Add Review')}>
          <Ionicons name="send" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  averageScoreContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  averageScore: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeFilterButton: {
    backgroundColor: '#ffa500',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterText: {
    color: 'white',
  },
  reviewList: {
    flex: 1,
    marginVertical: 10,
  },
  noReviewsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginVertical: 20,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
});

export default ReviewScreen;
