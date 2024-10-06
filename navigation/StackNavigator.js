import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EventScreen from '../screens/EventScreen';
import BookScreen from '../screens/BookScreen';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import VenueInfoScreen from '../screens/VenueInfoScreen';
import StartScreen from '../screens/StartScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PasswordScreen from '../screens/PasswordScreen';
import NameScreen from '../screens/NameScreen';
import SelectImage from '../screens/SelectImage';
import PreFinalScreen from '../screens/PreFinalScreen';
import {AuthContext} from '../AuthContext';
import CreateEvent from '../screens/CreateEvent';
import TagVenueScreen from '../screens/TagVenueScreen';
import SelectTimeScreen from '../screens/SelectTimeScreen';
import EventSetUpScreen from '../screens/EventSetUpScreen';
import AttendeesScreen from '../screens/AttendeesScreen';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const {token} = useContext(AuthContext);

  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="HOME"
          component={HomeScreen}
          options={{
            tabBarActiveTintColor: 'green',
            //headerShown: false,
            tabBarIcon: ({focused}) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
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
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <AntDesign
                name={focused ? 'calendar' : 'calendar'}
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
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <Ionicons
                name={focused ? 'book' : 'book-outline'}
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
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
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
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Password"
          component={PasswordScreen}
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="Otp"
          component={OtpScreen}
          options={{
            headerShown: false,
          }}
        /> */}
        <Stack.Screen
          name="Name"
          component={NameScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Image"
          component={SelectImage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PreFinal"
          component={PreFinalScreen}
          options={{
            headerShown: false,
          }}
        />
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
        <Stack.Screen
          name="Venue"
          component={VenueInfoScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Create"
          component={CreateEvent}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TagVenue"
          component={TagVenueScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Time" component={SelectTimeScreen} />
        <Stack.Screen
          name="Event"
          component={EventSetUpScreen}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="Attendees"
          component={AttendeesScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {token === null || token === '' ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

export default StackNavigator;
