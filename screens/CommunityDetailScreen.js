import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    StyleSheet,
    Linking,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommunityDetailScreen = () => {
    const [community, setCommunityDetail] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const {communityId} = route.params;

    useEffect(() => {
        const fetchCommunityDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(
                    `https://biletixai.onrender.com/communities/${communityId}`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    },
                );
                setCommunityDetail(response.data);
            } catch (error) {
                console.error('Topluluk detaylarını çekerken hata:', error.message);
                Alert.alert('Hata', 'Topluluk detayları bulunamadı.');
            }
        };

        if (communityId) {
            fetchCommunityDetails();
        } else {
            Alert.alert('Hata', 'Topluluk ID\'si bulunamadı.');
        }
    }, [communityId]);

    const joinCommunity = async () => {
        try {
            const response = await axios.post(
                `https://biletixai.onrender.com/communities/${communityId}/join`,
            );
            if (response.status === 200) {
                Alert.alert('Başarılı', 'Topluluğa başarıyla katıldınız!');
            }
        } catch (error) {
            console.error('Topluluğa katılırken hata:', error.message);
            if (error.response && error.response.status === 400) {
                Alert.alert('Hata', 'Zaten bu topluluğa katıldınız.');
            } else {
                Alert.alert('Hata', 'Topluluğa katılırken bir sorun oluştu.');
            }
        }
    };

    if (!community) {
        return null;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Community Details</Text>
            </View>

            <Image
                source={{
                    uri: community.headerImage || 'https://via.placeholder.com/400x200',
                }}
                style={styles.headerImage}
            />

            <View style={styles.content}>
                <View style={styles.profileInfo}>
                    <Image
                        source={{
                            uri: community.profileImage || 'https://via.placeholder.com/100',
                        }}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileDetails}>
                        <Text style={styles.name}>{community.name}</Text>
                        <Text style={styles.members}>
                            {community.membersCount} Katılımcı
                        </Text>
                        <Text style={styles.location}>İstanbul, Turkey</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.joinButton} onPress={joinCommunity}>
                    <Text style={styles.joinButtonText}>Topluluğa Katıl</Text>
                </TouchableOpacity>

                <Text style={styles.description}>{community.description}</Text>

                <View style={styles.socialLinks}>
                    {community.links.map((link, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => Linking.openURL(link.url)}>
                            <Text style={styles.linkText}>{link.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity style={styles.tabButton}>
                        <Text style={styles.tabButtonText}>Etkinlikler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabButton}>
                        <Text style={styles.tabButtonText}>Geçmiş</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabButton}>
                        <Text style={styles.tabButtonText}>Üyeler</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff'},
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    headerText: {fontSize: 20, fontWeight: 'bold', marginLeft: 10},
    headerImage: {width: '100%', height: 200},
    content: {padding: 20},
    profileInfo: {flexDirection: 'row', alignItems: 'center', marginBottom: 15},
    profileImage: {width: 80, height: 80, borderRadius: 40},
    profileDetails: {marginLeft: 15},
    name: {fontSize: 20, fontWeight: 'bold'},
    members: {color: 'gray', marginTop: 5},
    location: {color: 'gray', marginTop: 5},
    joinButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 15,
    },
    joinButtonText: {color: '#fff', fontWeight: 'bold'},
    description: {fontSize: 16, color: 'gray', marginVertical: 10},
    socialLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    linkText: {color: '#007bff', marginRight: 10, marginBottom: 5},
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    tabButtonText: {fontWeight: 'bold'},
});

export default CommunityDetailScreen;
