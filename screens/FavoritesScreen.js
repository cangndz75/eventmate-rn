import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';

const FavoritesScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const { userId } = useContext(AuthContext);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:8000/favorites/${userId}`);
            const favoriteEvents = response.data; // Assuming response.data contains an array of favorite event objects

            setFavorites(favoriteEvents);
        } catch (error) {
            setError('Failed to fetch favorites.');
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const renderFavoriteItem = ({ item }) => (
        <Pressable
            onPress={() => navigation.navigate('Event', { item })}
            style={styles.eventCard}
        >
            <Image style={styles.eventImage} source={{ uri: item.organizerUrl }} />
            <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>{item.date}</Text>
                <Text style={styles.eventLocation}>{item.location}</Text>
            </View>
            <Ionicons name="heart" size={24} color="red" />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Favorites</Text>
            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : favorites.length === 0 ? (
                <Text style={styles.noFavorites}>No favorites yet</Text>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderFavoriteItem}
                    keyExtractor={(item) => item._id}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    noFavorites: {
        textAlign: 'center',
        color: '#777',
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    eventImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    eventDetails: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    eventDate: {
        fontSize: 14,
        color: '#888',
    },
    eventLocation: {
        fontSize: 12,
        color: '#aaa',
    },
});

export default FavoritesScreen;
