import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Footer = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.cardGradient}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>Discover More</Text>
          <Text style={styles.subtitle}>Join the Community</Text>
          <Text style={styles.description}>
            Connect with others and explore exciting events happening near you.
          </Text>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Us</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: 'https://picsum.photos/200' }}
          style={styles.image}
        />
      </LinearGradient>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="people-outline" size={22} color="#fff" />
          <Text style={styles.createButtonText}>Create Community</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.organizerButton}>
          <Ionicons name="person-add-outline" size={22} color="#fff" />
          <Text style={styles.organizerButtonText}>Become an Organizer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 EventMate</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  cardGradient: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    paddingRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffec99',
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#e0e0e0',
    marginBottom: 15,
  },
  joinButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  joinButtonText: {
    color: '#6a11cb',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#6a11cb',
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6a11cb',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  organizerButton: {
    flex: 1,
    backgroundColor: '#ff8c42',
    paddingVertical: 15,
    marginLeft: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff8c42',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  organizerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
});

export default Footer;
