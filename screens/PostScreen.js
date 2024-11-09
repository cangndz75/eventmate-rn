import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import Modal from 'react-native-modal';

const PostScreen = () => {
  const [posts, setPosts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newPostDescription, setNewPostDescription] = useState('');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');
  const [commentText, setCommentText] = useState('');
  const {user, token} = useContext(AuthContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://biletixai.onrender.com/posts', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Unable to fetch posts.');
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCreatePost = async () => {
    if (!newPostDescription) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    try {
      await axios.post(
        'https://biletixai.onrender.com/posts/create',
        {
          description: newPostDescription,
          imageUrl: newPostImageUrl,
          userId: user._id,
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );
      setModalVisible(false);
      setNewPostDescription('');
      setNewPostImageUrl('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Unable to create post.');
    }
  };

  const handleLike = async postId => {
    try {
      await axios.post(
        `https://biletixai.onrender.com/posts/${postId}/like`,
        {userId: user._id},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      fetchPosts(); // Refresh posts after liking/unliking
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Unable to like post.');
    }
  };

  const handleComment = async postId => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }

    try {
      await axios.post(
        `https://biletixai.onrender.com/posts/${postId}/comment`,
        {userId: user._id, text: commentText},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      setCommentText('');
      fetchPosts(); // Refresh posts after commenting
    } catch (error) {
      console.error('Error commenting on post:', error);
      Alert.alert('Error', 'Unable to add comment.');
    }
  };

  const renderPost = ({item}) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{uri: item.user.image}} style={styles.profileImage} />
        <View style={styles.postUserDetails}>
          <Text style={styles.username}>
            {item.user.firstName} {item.user.lastName}
          </Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="gray" />
      </View>
      <Image source={{uri: item.imageUrl}} style={styles.postImage} />
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => handleLike(item._id)}>
          <Ionicons
            name={
              item.likes.some(like => like.user === user._id)
                ? 'heart'
                : 'heart-outline'
            }
            size={24}
            color={
              item.likes.some(like => like.user === user._id) ? 'red' : 'black'
            }
          />
        </TouchableOpacity>
        <Text style={styles.likesText}>{item.likes.length} likes</Text>
      </View>
      <Text style={styles.postDescription}>
        <Text style={styles.username}>
          {item.user.firstName} {item.user.lastName}{' '}
        </Text>
        {item.description}
      </Text>
      <View style={styles.commentSection}>
        {item.comments.map(comment => (
          <View key={comment._id} style={styles.commentContainer}>
            <Text style={styles.commentText}>
              <Text style={styles.username}>
                {comment.user.firstName} {comment.user.lastName}:{' '}
              </Text>
              {comment.text}
            </Text>
          </View>
        ))}
        <View style={styles.commentInputContainer}>
          <TextInput
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={setCommentText}
            style={styles.commentInput}
          />
          <TouchableOpacity onPress={() => handleComment(item._id)}>
            <Ionicons name="send" size={24} color="#007BFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={renderPost}
        />
      ) : (
        <Text style={styles.noPostText}>No posts available</Text>
      )}
      <TouchableOpacity style={styles.createPostButton} onPress={toggleModal}>
        <Ionicons name="add" size={30} color="black" />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Post</Text>
          <TextInput
            placeholder="Description"
            style={styles.textInput}
            value={newPostDescription}
            onChangeText={setNewPostDescription}
          />
          <TextInput
            placeholder="Image URL"
            style={styles.textInput}
            value={newPostImageUrl}
            onChangeText={setNewPostImageUrl}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreatePost}>
            <Text style={styles.submitButtonText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postUserDetails: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  likesText: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  postDescription: {
    marginBottom: 10,
  },
  commentSection: {
    marginTop: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  createPostButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 50,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: 'red',
    marginTop: 10,
  },
  noPostText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
});

export default PostScreen;
