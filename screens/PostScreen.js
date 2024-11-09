import React, {useState, useContext} from 'react';
import {
  View,
  Text,
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
  const {user, token} = useContext(AuthContext);

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
      // fetchPosts();  // Eğer gönderi listelemek istiyorsanız bu fonksiyonu tanımlayıp burada çağırabilirsiniz.
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Unable to create post.');
    }
  };

  return (
    <View style={styles.container}>
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
    justifyContent: 'center',
    alignItems: 'center',
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
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 15},
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
  submitButtonText: {color: 'white', fontWeight: 'bold'},
  cancelButtonText: {color: 'red', marginTop: 10},
});

export default PostScreen;
