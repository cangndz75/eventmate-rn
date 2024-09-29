import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EventScreen from '../screens/EventScreen';
import BookScreen from '../screens/BookScreen';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    function BottomTabs() {
        return (
            <Tab.Navigator>
                <Tab.Screen
                    name="HOME"
                    component={HomeScreen}
                    options={{
                        tabBarActiveTintColor: 'green',
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={24}
                                color={focused ? 'green' : 'gray'}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="PROFILE"
                    component={ProfileScreen}
                    options={{
                        tabBarActiveTintColor: 'green',
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? 'person' : 'person-outline'}
                                size={24}
                                color={focused ? 'green' : 'gray'}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="BOOK"
                    component={BookScreen}
                    options={{
                        tabBarActiveTintColor: 'green',
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? 'book' : 'book-outline'}
                                size={24}
                                color={focused ? 'green' : 'gray'}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="EVENT"
                    component={EventScreen}
                    options={{
                        tabBarActiveTintColor: 'green',
                        tabBarIcon: ({ focused }) => (
                            <AntDesign
                                name={focused ? 'calendar' : 'calendar'}
                                size={24}
                                color={focused ? 'green' : 'gray'}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }

    const AuthStack = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        );
    };

    function MainStack() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Main"
                    component={BottomTabs}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        );
    }

    return (
        <NavigationContainer>
            <MainStack />
        </NavigationContainer>
    );
};

export default StackNavigator;
