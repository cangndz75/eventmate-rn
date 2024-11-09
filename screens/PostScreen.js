import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {AuthContext} from '../AuthContext';

const PostScreen = () => {
  const [posts, setPosts] = useState([]);
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
  const [newPostDescription, setNewPostDescription] = useState('');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');
  const {user, token} = useContext(AuthContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://biletixai.onrender.com/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Unable to fetch posts.');
    }
  };

  const handleCreatePost = async () => {
    if (!newPostDescription) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    try {
      const response = await axios.post(
        'https://biletixai.onrender.com/posts/create',
        {
          description: newPostDescription,
          imageUrl: newPostImageUrl,
          userId: user._id,
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );
      setIsCreatePostVisible(false);
      setNewPostDescription('');
      setNewPostImageUrl('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Unable to create post.');
    }
  };

  const renderPost = ({item}) => (
    <View style={styles.postContainer}>
      <View style={styles.headerContainer}>
        <Image
          source={{uri: item.user.profileImage}}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.user.name}</Text>
          <Text style={styles.location}>Snowden Deli</Text>
        </View>
        <TouchableOpacity style={styles.moreIcon}>
          <Icon name="ellipsis-horizontal" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <Image source={{uri: item.imageUrl}} style={styles.postImage} />
      <View style={styles.actionContainer}>
        <TouchableOpacity>
          <Icon name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.commentIcon}>
          <Icon name="chatbubble-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareIcon}>
          <Icon name="paper-plane-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.likes}>
        aezosuly and {item.likes.length} others liked
      </Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>LOLI</Text>
        <TouchableOpacity onPress={() => setIsCreatePostVisible(true)}>
          <Icon name="add-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabTextSelected}>Following</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>For You</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={isCreatePostVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create Post</Text>
          <TextInput
            placeholder="Create a great post today..."
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
          <TouchableOpacity onPress={() => setIsCreatePostVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  logo: {fontSize: 24, fontWeight: 'bold'},
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tabButton: {paddingHorizontal: 20, paddingVertical: 5},
  tabTextSelected: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  tabText: {fontSize: 16, color: 'gray'},
  postContainer: {marginBottom: 20, backgroundColor: '#fff'},
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  profileImage: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  userInfo: {flex: 1},
  username: {fontWeight: 'bold'},
  postImage: {width: '100%', height: 300, marginVertical: 10},
  actionContainer: {flexDirection: 'row', paddingHorizontal: 15, paddingTop: 5},
  likes: {fontWeight: 'bold', paddingHorizontal: 15, paddingTop: 5},
  description: {paddingHorizontal: 15, paddingVertical: 5},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 15},
  textInput: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  submitButtonText: {color: 'white'},
  cancelButtonText: {color: 'red', marginTop: 10},
});

export default PostScreen;
