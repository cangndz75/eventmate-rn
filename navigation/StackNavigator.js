import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import EventScreen from '../screens/EventScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminEventScreen from '../screens/admin/AdminEventScreen'; // Import the new screen
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
import AttendeesScreen from '../screens/admin/AttendeesScreen';
import ManageRequests from '../screens/admin/ManageRequest';
import ProfileDetailScreen from '../screens/ProfileDetail';
import ChatsScreen from '../screens/ChatsScreen';
import RequestChatRoom from '../screens/RequestChatRoom';
import ChatRoom from '../screens/ChatRoom';
import PeopleScreen from '../screens/PeopleScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AdminCreateScreen from '../screens/admin/AdminCreateScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminEventSetUpScreen from '../screens/admin/AdminEventSetUpScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import TicketDetailScreen from '../screens/TicketDetailScreen';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const {token, role} = useContext(AuthContext);

  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={role === 'organizer' ? AdminDashboard : HomeScreen}
          options={{
            headerShown: false,
            tabBarActiveTintColor: 'green',
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
          component={role === 'organizer' ? AdminEventScreen : EventScreen}
          options={{
            tabBarActiveTintColor: 'green',
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
          name="Book"
          component={BookScreen}
          options={{
            tabBarActiveTintColor: 'green',
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
          name="Profile"
          component={ProfileDetailScreen}
          options={{
            tabBarActiveTintColor: 'green',
            tabBarIcon: ({focused}) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={24}
                color={focused ? 'green' : 'gray'}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Chats"
          component={ChatsScreen}
          options={{
            tabBarActiveTintColor: 'green',
            tabBarIcon: ({focused}) => (
              <Ionicons
                name={focused ? 'chatbox' : 'chatbox-outline'}
                size={24}
                color={focused ? 'green' : 'gray'}
              />
            ),
          }}
        />
        {role !== 'organizer' && (
          <Tab.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{
              tabBarActiveTintColor: 'green',
              tabBarIcon: ({focused}) => (
                <Ionicons
                  name={focused ? 'heart' : 'heart-outline'}
                  size={24}
                  color={focused ? 'green' : 'gray'}
                />
              ),
            }}
          />
        )}
      </Tab.Navigator>
    );
  }

  const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Start"
        component={StartScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Password"
        component={PasswordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Name"
        component={NameScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Image"
        component={SelectImage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PreFinal"
        component={PreFinalScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    </Stack.Navigator>
  );

  function MainStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VenueInfo"
          component={VenueInfoScreen}
          options={{headerShown: false}}
        />
        {role === 'organizer' && (
          <>
            <Stack.Screen
              name="AdminCreate"
              component={AdminCreateScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AdminEvents"
              component={AdminEventScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AdminEventSetUp"
              component={AdminEventSetUpScreen}
              options={{headerShown: false}}
            />
          </>
        )}
        <Stack.Screen
          name="TagVenue"
          component={TagVenueScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Time" component={SelectTimeScreen} />
        <Stack.Screen
          name="EventSetup"
          component={EventSetUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Attendees"
          component={AttendeesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
        <Stack.Screen
          name="ManageRequest"
          component={ManageRequests}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="People"
          component={PeopleScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Event" component={EventScreen} />
        <Stack.Screen name="EventSetUp" component={EventSetUpScreen} />
        <Stack.Screen name="Request" component={RequestChatRoom} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen name="Chats" component={ChatsScreen} />
        <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} />
        <Stack.Screen name="TicketDetailScreen" component={TicketDetailScreen} />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {token ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default StackNavigator;
