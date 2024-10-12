import { Pressable, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const SelectTimeScreen = () => {
    const [selectedTimeId, setSelectedTimeId] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const navigation = useNavigation();

    const times = [
        {
            id: '0',
            type: 'Morning',
            timings: '12 AM - 9 AM',
            icon: 'partly-sunny-outline', // Valid Ionicons name
            iconComponent: Ionicons,
        },
        {
            id: '1',
            type: 'Day',
            timings: '9 AM - 4 PM',
            icon: 'sun', // Valid Feather name
            iconComponent: Feather,
        },
        {
            id: '2',
            type: 'Evening',
            timings: '4 PM - 9 PM',
            icon: 'sunset', // Valid Feather name
            iconComponent: Feather,
        },
        {
            id: '3',
            type: 'Night',
            timings: '9 PM - 11 PM',
            icon: 'moon-outline', // Valid Ionicons name
            iconComponent: Ionicons,
        },
    ];

    const selectTime = (item) => {
        setSelectedTimeId(item.id); 
    
        navigation.navigate('AdminCreate', { timeInterval: item.timings });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Select Suitable Time',
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
            },
        });
    }, [navigation]);

    const showStartTimePicker = () => {
        setStartTimePickerVisibility(true);
    };

    const hideStartTimePicker = () => {
        setStartTimePickerVisibility(false);
    };

    const showEndTimePicker = () => {
        setEndTimePickerVisibility(true);
    };

    const hideEndTimePicker = () => {
        setEndTimePickerVisibility(false);
    };

    const handleConfirmStartTime = time => {
        setStartTime(time);
        hideStartTimePicker();
    };

    const handleConfirmEndTime = time => {
        setEndTime(time);
        hideEndTimePicker();
    };

    const formatTime = time => {
        if (!time) return 'Select Time';
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    const clearSelections = () => {
        setStartTime(null);
        setEndTime(null);
        setSelectedTimeId('');
    };

    const confirmSelections = () => {
        if (startTime && endTime) {
            const formattedStartTime = formatTime(startTime);
            const formattedEndTime = formatTime(endTime);
            const timeInterval = `${formattedStartTime} - ${formattedEndTime}`;
            
            navigation.navigate('AdminCreate', { timeInterval });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.timeSelectionContainer}>
                    {times.map(item => {
                        const IconComponent = item.iconComponent;
                        return (
                            <Pressable
                                key={item.id}
                                onPress={() => selectTime(item)}
                                style={[styles.timeCard, selectedTimeId === item.id && styles.selectedCard]}>
                                <IconComponent name={item.icon} size={24} color="black" />
                                <Text style={styles.timeText}>{item.type}</Text>
                                <Text style={styles.timingText}>{item.timings}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View style={styles.timeContainer}>
                    <View style={styles.timePicker}>
                        <Text style={styles.label}>Start Time:</Text>
                        <TouchableOpacity onPress={showStartTimePicker} style={styles.button}>
                            <Text style={styles.buttonText}>{formatTime(startTime)}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isStartTimePickerVisible}
                            mode="time"
                            onConfirm={handleConfirmStartTime}
                            onCancel={hideStartTimePicker}
                            is24Hour={false}
                        />
                    </View>
                    <View style={styles.timePicker}>
                        <Text style={styles.label}>End Time:</Text>
                        <TouchableOpacity onPress={showEndTimePicker} style={styles.button}>
                            <Text style={styles.buttonText}>{formatTime(endTime)}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isEndTimePickerVisible}
                            mode="time"
                            onConfirm={handleConfirmEndTime}
                            onCancel={hideEndTimePicker}
                            is24Hour={false}
                        />
                    </View>

                    {startTime && endTime && (
                        <View style={styles.summaryContainer}>
                            <Text style={styles.summaryText}>
                                Selected Interval: {formatTime(startTime)} - {formatTime(endTime)}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.clearButton} onPress={clearSelections}>
                        <Text style={styles.clearButtonText}>Clear Selections</Text>
                    </TouchableOpacity>

                    {/* Floating Circular "+" Button */}
                    {startTime && endTime && (
                        <TouchableOpacity
                            style={styles.floatingButton}
                            onPress={confirmSelections}
                        >
                            <Ionicons name="add" size={30} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default SelectTimeScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    timeSelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    timeCard: {
        backgroundColor: 'white',
        marginBottom: 20,
        width: '48%',
        height: 150,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    selectedCard: {
        borderColor: '#00f',
        borderWidth: 2,
    },
    timeText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    timingText: {
        fontSize: 14,
        color: '#555',
    },
    timeContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    timePicker: {
        marginBottom: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    button: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
    },
    summaryContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    summaryText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    clearButton: {
        marginTop: 20,
        backgroundColor: '#ff3b3b',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#4CAF50',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
