const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/user');
const Event = require('./models/event');
const Venue = require('./models/venue');
const Message = require('./models/message');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.log('Connection failed', error);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/register', async (req, res) => {
  try {
    const {email, password, firstName, lastName, role} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      {userId: newUser._id, role: newUser.role},
      process.env.JWT_SECRET_KEY,
      {expiresIn: '1h'},
    );

    res.status(200).json({token});
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid email or password');
    }

    const token = jwt.sign(
      {userId: user._id, role: user.role},
      process.env.JWT_SECRET_KEY,
      {expiresIn: '1h'},
    );

    res.status(200).json({token, role: user.role});
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const {userId} = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    return res.status(200).json({user});
  } catch (error) {
    res.status(500).json({message: 'Error fetching the user details'});
  }
});

const venues = [
  {
    name: 'Bostancı Gösteri Merkezi',
    rating: 4.5,
    deferLink: 'https://www.biletix.com/mekan/BG/TURKIYE/tr',
    fullLink: 'https://www.biletix.com/mekan/BG/TURKIYE/tr',
    avgRating: 4.5,
    ratingCount: 150,
    lat: 40.963218,
    lng: 29.096045,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Concert', 'Theatre'],
    eventsAvailable: [
      {
        id: '1',
        name: 'Concert',
        icon: 'concert',
        price: 150,
        courts: [
          {
            id: '1',
            name: 'Main Hall',
            number: 1,
          },
        ],
      },
      {
        id: '2',
        name: 'Theatre',
        icon: 'theatre',
        price: 100,
        courts: [
          {
            id: '1',
            name: 'Theatre Stage',
            number: 1,
          },
        ],
      },
    ],
    image:
      'https://i.ytimg.com/vi/vWEDP3RxOIs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC8xcHcti2J4pAB76sCUkD5_hKyDQ',
    location: 'Bostancı, İstanbul',
    address: 'Bostancı, Mehmet Şevki Paşa Cad. No:24, Kadıköy/İstanbul',
    bookings: [],
  },
  {
    name: 'Moda Sahnesi',
    rating: 4.7,
    deferLink: 'https://www.biletix.com/mekan/MODD/TURKIYE/tr',
    fullLink: 'https://www.biletix.com/mekan/MODD/TURKIYE/tr',
    avgRating: 4.7,
    ratingCount: 120,
    lat: 40.987213,
    lng: 29.034174,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Theatre', 'Concert'],
    eventsAvailable: [
      {
        id: '1',
        name: 'Concert',
        icon: 'concert',
        price: 200,
        courts: [
          {
            id: '1',
            name: 'Main Hall',
            number: 1,
          },
        ],
      },
      {
        id: '2',
        name: 'Theatre',
        icon: 'theatre',
        price: 120,
        courts: [
          {
            id: '1',
            name: 'Theatre Stage',
            number: 1,
          },
        ],
      },
    ],
    image:
      'https://galeri3.arkitera.com/var/albums/Haber/2014/04/16/halukar-tiyatro-806537870/BOU%20DD%20halukar%2001.jpg',
    location: 'Kadıköy, İstanbul',
    address: 'Caferağa, Moda Cd. No: 10A, 34710 Kadıköy/İstanbul',
    bookings: [],
  },
  {
    name: 'RAMS Park',
    rating: 4.8,
    deferLink: 'https://www.passo.com.tr/tr/mekan/8715/8715',
    fullLink: 'https://www.passo.com.tr/tr/mekan/8715/8715',
    avgRating: 4.8,
    ratingCount: 90,
    lat: 41.076623,
    lng: 28.833333,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Football', 'Concert'],
    eventsAvailable: [
      {
        id: '1',
        name: 'Football',
        icon: 'football',
        price: 300,
        courts: [
          {
            id: '1',
            name: 'Main Field',
            number: 1,
          },
        ],
      },
      {
        id: '2',
        name: 'Concert',
        icon: 'concert',
        price: 250,
        courts: [
          {
            id: '1',
            name: 'Concert Stage',
            number: 1,
          },
        ],
      },
    ],
    image:
      'https://media-cdn.tripadvisor.com/media/photo-s/2b/95/cf/fd/rams-park-istanbul.jpg',
    location: 'Başakşehir, İstanbul',
    address: 'Başakşehir, İstanbul',
    bookings: [],
  },
  {
    name: 'Dans Akademi',
    rating: 4.6,
    deferLink: 'https://dansakademi.com.tr/dans-akademi-bakirkoy',
    fullLink: 'https://dansakademi.com.tr/dans-akademi-bakirkoy',
    avgRating: 4.6,
    ratingCount: 80,
    lat: 41.008237,
    lng: 28.978358,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Dance'],
    eventsAvailable: [
      {
        id: '1',
        name: 'Dance',
        icon: 'dance',
        price: 100,
        courts: [
          {
            id: '1',
            name: 'Main Dance Floor',
            number: 1,
          },
        ],
      },
    ],
    image:
      'https://dansakademi.com.tr/uploads/2024/08/dans-kurslari-bakirkoy.jpg',
    location: 'Kartaltepe Mah. Alpay İzer Sok. No: 4/B Bakırköy/İstanbul',
    address: 'Kartaltepe Mah. Alpay İzer Sok. No: 4/B Bakırköy/İstanbul',
    bookings: [],
  },
];

async function addVenues() {
  for (const venueData of venues) {
    const existingVenue = await Venue.findOne({name: venueData?.name});

    if (existingVenue) {
      console.log('Venue already exists:', venueData?.name);
    } else {
      const newVenue = new Venue(venueData);
      await newVenue.save();
      console.log('Venue added:', venueData?.name);
    }
  }
}

addVenues().catch(err => {
  console.log('Error adding venues:', err);
});

app.get('/venues', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/createevent', async (req, res) => {
  try {
    const {
      title,
      eventType,
      date,
      time,
      location,
      organizer,
      totalParticipants,
    } = req.body;

    // Yeni bir event oluşturuluyor
    const newEvent = new Event({
      title,
      eventType,
      date,
      time,
      location,
      organizer,
      totalParticipants,
      attendees: [organizer],
    });

    const savedEvent = await newEvent.save();

    const user = await User.findById(organizer);
    if (user) {
      user.events.push(savedEvent._id);
      await user.save();
    }

    res.status(200).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/events', async (req, res) => {
  try {
    const events = await Event.find({})
      .populate('organizer')
      .populate('attendees', 'image firstName lastName');
    const currentDate = moment();
    const filteredEvents = events?.filter(event => {
      const eventData = moment(event.date, 'Do MMMM');
      const eventTime = event.time.split(' - ')[0];
      const eventDateTime = moment(
        `${event.date} ${eventTime}`,
        'Do MMMM HH:mm',
      );
      return eventDateTime.isAfter(currentDate);
    });
    const formattedEvents = filteredEvents.map(event => ({
      _id: event._id,
      title: event.title,
      eventType: event.eventType,
      location: event.location,
      date: event.date,
      time: event.time,
      attendees: event.attendees.map(attendee => ({
        _id: attendee._id,
        imageUrl: attendee.image,
        name: `${attendee.firstName} ${attendee.lastName}`,
      })),
      totalParticipants: event.totalParticipants,
      queries: event.queries,
      request: event.request,
      isBooked: event.isBooked,
      organizerId: event.organizer._id,
      organizerName: `${event.organizer.firstName} ${event.organizer.lastName}`,
      organizerUrl: event.organizer.image,
      isFull: event.isFull,
    }));
    res.json(formattedEvents);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Error fetching events');
  }
});

app.get('/upcoming', async (req, res) => {
  try {
    const events = await Event.find({})
      .populate('organizer')
      .populate('attendees', 'image firstName lastName');
    const currentDate = moment();
    const filteredEvents = events?.filter(event => {
      const eventData = moment(event.date, 'Do MMMM');
      const eventTime = event.time.split(' - ')[0];
      const eventDateTime = moment(
        `${event.date} ${eventTime}`,
        'Do MMMM HH:mm',
      );
      return eventDateTime.isAfter(currentDate);
    });
    const formattedEvents = filteredEvents.map(event => ({
      _id: event._id,
      title: event.title,
      eventType: event.eventType,
      location: event.location,
      date: event.date,
      time: event.time,
      attendees: event.attendees.map(attendee => ({
        _id: attendee._id,
        imageUrl: attendee.image,
        name: `${attendee.firstName} ${attendee.lastName}`,
      })),
      totalParticipants: event.totalParticipants,
      queries: event.queries,
      request: event.request,
      isBooked: event.isBooked,
      organizerId: event.organizer._id,
      organizerName: `${event.organizer.firstName} ${event.organizer.lastName}`,
      organizerUrl: event.organizer.image,
      isFull: event.isFull,
    }));
    res.json(formattedEvents);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Error fetching events');
  }
});

app.post('/events/:eventId/request', async (req, res) => {
  try {
    const {userId, comment} = req.body;
    const {eventId} = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send('Event not found');
    }
    const existingRequest = event?.requests.find(
      request => request.userId.toString() === userId,
    );
    if (existingRequest) {
      return res.status(400).send('Request already exists');
    }
    event.requests.push({userId, comment});
    await event.save();
    res.status(200).send('Request sent successfully');
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Error fetching events');
  }
});

app.get('/events/:eventId/requests', async (req, res) => {
  try {
    const {eventId} = req.params;
    const event = await Event.findById(eventId).populate({
      path: 'requests.userId',
      select:
        'email firstName lastName image image skill noOfEvents eventPals events badges level points',
    });
    if (!event) {
      return res.status(404).send('Event not found');
    }
    const requestsWithUserInfo = event?.requests?.map(request => ({
      userId: request.userId._id,
      email: request.userId.email,
      firstName: request.userId.firstName || '',
      lastName: request.userId.lastName || '',
      image: request.userId.image || '',
      skill: request.userId.skill || '',
      noOfEvents: request.userId.noOfEvents || 0,
      eventPals: request.userId.eventPals || [],
      events: request.userId.events || [],
      badges: request.userId.badges || [],
      level: request.userId.level || 0,
      points: request.userId.points || 0,
      comment: request.comment || '',
    }));
    res.json(requestsWithUserInfo);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Error fetching events');
  }
});

app.get('/events/:eventId/requests', async (req, res) => {
  try {
    const {eventId} = req.params;
    const event = await Event.findById(eventId).populate({
      path: 'requests.userId',
      select:
        'email firstName lastName image image skill noOfEvents eventPals events badges level points',
    });

    if (!event) {
      return res.status(404).send('Event not found');
    }

    const requestsWithUserInfo = event?.requests?.map(request => ({
      userId: request.userId._id,
      email: request.userId.email,
      firstName: request.userId.firstName,
      lastName: request.userId.lastName,
      image: request.userId.image,
      skill: request.userId.skill,
      noOfEvents: request.userId.noOfEvents,
      eventPals: request.userId.eventPals,
      events: request.userId.events,
      badges: request.userId.badges,
      level: request.userId.level,
      points: request.userId.points,
      comment: request.comment,
    }));
    res.json(requestsWithUserInfo);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Error fetching events');
  }
});

app.get('/event/:eventId/attendees', async (req, res) => {
  try {
    const {eventId} = req.params;
    const event = await Event.findById(eventId).populate('attendees');

    if (!event) {
      return res.status(404).json({message: 'Event not found'});
    }

    res.status(200).json(event.attendees);
    console.log('Attendees:', event.attendees);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch attendees'});
  }
});

app.put('/user/:userId/makeOrganizer', async (req, res) => {
  try {
    const {userId} = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.isOrganizer = true;
    await user.save();

    res.status(200).send('User updated as organizer');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
});

app.put('/updateAllUsersToAddOrganizer', async (req, res) => {
  try {
    const updatedUsers = await User.updateMany(
      {},
      {$set: {isOrganizer: false}},
    );
    res.status(200).send('All users updated with isOrganizer field');
  } catch (error) {
    console.error('Error updating all users:', error);
    res.status(500).send('Error updating users');
  }
});

app.post('/accept', async (req, res) => {
  const {eventId, userId} = req.body;

  console.log('user', userId);

  console.log('heyy', eventId);

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({message: 'Event not found'});
    }

    event.attendees.push(userId);

    await Event.findByIdAndUpdate(
      eventId,
      {
        $pull: {requests: {userId: userId}},
      },
      {new: true},
    );

    await event.save();

    res.status(200).json({message: 'Request accepted', event});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
});

app.post('/sendrequest', async (req, res) => {
  const {senderId, receiverId, message} = req.body;

  // Ensure senderId and receiverId are not empty
  if (!senderId || !receiverId) {
    return res.status(400).json({message: 'Sender or Receiver ID is missing'});
  }

  console.log(
    `Sender: ${senderId}, Receiver: ${receiverId}, Message: ${message}`,
  );

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({message: 'Receiver not found'});
  }

  // Add request to the receiver's requests array
  receiver.requests.push({from: senderId, message});
  await receiver.save();

  console.log(`Request sent from ${senderId} to ${receiverId}`);
  res.status(200).json({message: 'Request sent successfully'});
});

app.get('/getrequests/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Fetching requests for userId: ${userId}`);
    const user = await User.findById(userId).populate(
      'requests.from', // Populate request sender details
      'firstName lastName email image',
    );

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    console.log(`Found requests for user ${userId}:`, user.requests);
    res.json(user.requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({message: 'Server error'});
  }
});
app.post('/acceptrequest', async (req, res) => {
  try {
    const {userId, requestId} = req.body;
    console.log(
      `Accepting request for userId: ${userId}, requestId: ${requestId}`,
    );

    // Find both users
    const user = await User.findById(userId);
    const friend = await User.findById(requestId);

    if (!user || !friend) {
      return res.status(404).json({message: 'User or Friend not found'});
    }

    // Add each other as friends
    await User.findByIdAndUpdate(userId, {
      $push: {friends: requestId},
      $pull: {requests: {from: requestId}},
    });

    await User.findByIdAndUpdate(requestId, {
      $push: {friends: userId},
    });

    console.log(`Request accepted: ${requestId} is now a friend of ${userId}`);
    res.status(200).json({message: 'Request accepted'});
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({message: 'Server Error'});
  }
});

const http = require('http').createServer(app);

const io = require('socket.io')(http);

//{"userId" : "socket ID"}

const userSocketMap = {};

io.on('connection', socket => {
  console.log('a user is connected', socket.id);

  const userId = socket.handshake.query.userId;

  console.log('userid', userId);

  if (userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  console.log('user socket data', userSocketMap);

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId];
  });

  socket.on('sendMessage', ({senderId, receiverId, message}) => {
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {senderId, message});
    }
  });
});

http.listen(3000, () => {
  console.log('Socket.IO running on port 8000');
});
app.post('/sendMessage', async (req, res) => {
  try {
    const {senderId, receiverId, message} = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      console.log('emitting receiveMessage event to the receiver', receiverId);
      io.to(receiverSocketId).emit('newMessage', newMessage);
    } else {
      console.log('Receiver socket ID not found');
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('ERROR', error);
  }
});

app.get('/messages', async (req, res) => {
  try {
    const {senderId, receiverId} = req.query;

    const messages = await Message.find({
      $or: [
        {senderId: senderId, receiverId: receiverId},
        {senderId: receiverId, receiverId: senderId},
      ],
    }).populate('senderId', '_id name');

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error', error);
  }
});

app.get('/friends/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Fetching friends for userId: ${userId}`);

    const user = await User.findById(userId).populate(
      'friends', // Populate friends array
      'firstName lastName image',
    );

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    console.log(`Found friends for user ${userId}:`, user.friends);
    return res.status(200).json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    return res.status(500).json({message: 'Server error'});
  }
});

app.delete('/messages/:messageId', async (req, res) => {
  try {
    const {messageId} = req.params;
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({message: 'Message deleted'});
  } catch (error) {
    console.log('Error deleting message:', error);
    res.status(500).json({message: 'Error deleting message'});
  }
});

app.get('/users', async (req, res) => {
  console.log('Fetching users...'); // Debugging log
  try {
    const users = await User.find({}, 'firstName lastName image');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/rejectrequest', async (req, res) => {
  try {
    const {userId, requestId} = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {requests: {from: requestId}},
      },
      {new: true},
    );

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.status(200).json({message: 'Request rejected and removed'});
  } catch (error) {
    console.log('Error rejecting request:', error);
    res.status(500).json({message: 'Server error'});
  }
});

app.post('/favorites', async (req, res) => {
  try {
    const {userId, eventId} = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Check if the event is already in favorites
    const eventIndex = user.favorites.indexOf(eventId);

    if (eventIndex === -1) {
      // Add the event to favorites
      user.favorites.push(eventId);
      await user.save();
      return res.status(200).json({message: 'Event added to favorites'});
    } else {
      // Remove the event from favorites
      user.favorites.splice(eventIndex, 1);
      await user.save();
      return res.status(200).json({message: 'Event removed from favorites'});
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/favorites/:userId', async (req, res) => {
  try {
    const {userId} = req.params;

    // Populate 'favorites' field with event details from 'Event' model
    const user = await User.findById(userId).populate({
      path: 'favorites',
      model: 'Event', // Make sure 'Event' is the correct name of your model
    });

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Return populated favorites (event details included)
    res.status(200).json(user.favorites);
    console.log('Favorites:', user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});
