const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./models/user');
const Event = require('./models/event');
const Venue = require('./models/venue');
const moment = require('moment');
const app = express();
const port = process.env.PORT || 8000;
const generateRoute = require('./routes/generateRoute');
const path = require('path');
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/generate', generateRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Connection error:', error));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({message: 'No token provided, unauthorized'});
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({message: 'Invalid token'});
    }

    req.user = user;
    next();
  });
};

app.post('/refresh', async (req, res) => {
  const {token} = req.body;
  if (!token) {
    return res.status(400).json({message: 'Refresh token is required'});
  }

  try {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) return res.status(403).json({message: 'Invalid refresh token'});

      const newAccessToken = jwt.sign(
        {userId: user.userId, role: user.role},
        process.env.JWT_SECRET_KEY,
        {expiresIn: '1h'},
      );

      res.status(200).json({token: newAccessToken});
    });
  } catch (error) {
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.post('/register', async (req, res) => {
  try {
    console.log('Incoming user data:', req.body);

    const {
      email,
      password,
      firstName,
      lastName,
      role,
      image,
      aboutMe,
      interests,
      communityId,
    } = req.body;

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      role,
      image,
      aboutMe,
      interests,
      community: communityId || null,
    });

    await newUser.save();

    if (communityId) {
      const community = await Community.findById(communityId);
      if (community) {
        community.members.push(newUser._id);
        await community.save();
      } else {
        console.log('Community not found with provided ID');
      }
    }

    const token = jwt.sign(
      {userId: newUser._id, role: newUser.role},
      process.env.JWT_SECRET_KEY,
      {expiresIn: '1h'},
    );

    res.status(201).json({token, role: newUser.role});
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user || user.password !== password) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign(
      {userId: user._id, role: user.role},
      process.env.JWT_SECRET_KEY,
      {expiresIn: '1h'},
    );

    res.status(200).json({
      token,
      userId: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      aboutMe: user.aboutMe,
      interests: user.interests,
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/recent-participants', async (req, res) => {
  try {
    const participants = await User.find({}, 'image firstName')
      .sort({createdAt: -1})
      .limit(5);
    res.status(200).json(participants);
  } catch (error) {
    console.error('Error fetching recent participants1:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/user/:userId', async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId)
      .populate('events')
      .populate('followers', 'firstName lastName username image')
      .populate('following', 'firstName lastName username image');

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res
      .status(500)
      .json({message: 'Error fetching user data', error: error.message});
  }
});

app.put('/user/:userId', async (req, res) => {
  const {userId} = req.params;
  const {firstName, lastName, email, password, phone, country} = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {firstName, lastName, email, password, phone, country},
      {new: true},
    );

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.status(200).json({message: 'Profile updated successfully', user});
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({message: 'Failed to update profile'});
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

app.post('/generate', authenticateToken, async (req, res) => {
  const {eventName, location} = req.body;

  if (!eventName || !location) {
    return res
      .status(400)
      .json({message: 'Event name and location are required'});
  }

  const prompt = `Generate a detailed description for the event: ${eventName} happening at ${location}.`;

  try {
    const response = await generateText(prompt);
    res.status(200).json({response});
  } catch (error) {
    console.error('Error generating content:', error.message);
    res.status(500).json({message: 'Failed to generate content'});
  }
});

app.post('/createevent', authenticateToken, async (req, res) => {
  console.log('Received event data:', req.body);

  const {
    title,
    description,
    tags,
    location,
    date,
    time,
    eventType,
    totalParticipants,
    organizer,
    images,
    isPaid,
    price,
  } = req.body;

  if (!title || !location || !eventType || !totalParticipants || !organizer) {
    return res
      .status(400)
      .json({message: 'All fields are required except date.'});
  }

  try {
    const newEvent = new Event({
      title,
      description,
      tags,
      location,
      date,
      time,
      eventType,
      totalParticipants,
      organizer,
      images,
      isPaid,
      price: isPaid ? price : null,
    });

    await newEvent.save();
    res.status(200).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({message: 'Failed to create event.'});
  }
});

app.get('/events', async (req, res) => {
  const {organizerId, role} = req.query;

  try {
    let filter = {};

    if (role === 'organizer' && organizerId) {
      filter = {organizer: mongoose.Types.ObjectId(organizerId)};
    }

    const events = await Event.find(filter).populate('organizer');
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({message: 'Failed to fetch events'});
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
      return res.status(404).json({message: 'Event not found'});
    }

    const existingRequest = event.requests.find(
      request => request.userId.toString() === userId,
    );

    if (existingRequest) {
      return res.status(400).json({message: 'Request already sent'});
    }

    event.requests.push({userId, comment, status: 'pending'});
    await event.save();

    res.status(200).json({message: 'Request sent successfully'});
  } catch (err) {
    console.error('Error processing join request:', err);
    res.status(500).json({message: 'Failed to send request'});
  }
});

app.post('/events/:eventId/cancel-request', async (req, res) => {
  try {
    const {userId} = req.body;
    const {eventId} = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({message: 'Event not found'});
    }

    event.requests = event.requests.filter(
      request => request.userId.toString() !== userId,
    );
    await event.save();

    res.status(200).json({message: 'Request cancelled successfully'});
  } catch (err) {
    console.error('Error cancelling request:', err);
    res.status(500).json({message: 'Failed to cancel request'});
  }
});

app.get('/events/:eventId/requests', async (req, res) => {
  try {
    const {eventId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({message: 'Invalid event ID'});
    }

    const event = await Event.findById(eventId).populate({
      path: 'requests.userId',
      select: 'firstName lastName image email',
    });

    if (!event) {
      return res.status(404).json({message: 'Event not found'});
    }

    const requestsWithUserInfo = event.requests.map(request => ({
      requestId: request._id,
      userId: request.userId?._id,
      firstName: request.userId?.firstName || 'Unknown',
      lastName: request.userId?.lastName || 'Unknown',
      image: request.userId?.image || 'https://via.placeholder.com/150',
      email: request.userId?.email || 'N/A',
      comment: request.comment || '',
      status: request.status || 'pending',
    }));

    res.status(200).json(requestsWithUserInfo);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({message: 'Internal Server Error'});
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(eventId).session(session);
    if (!event) throw new Error(`Event not found with ID: ${eventId}`);

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error(`User not found with ID: ${userId}`);

    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
    }

    event.requests = event.requests.filter(
      req => req.userId.toString() !== userId,
    );
    user.events.push(eventId);

    await event.save({session});
    await user.save({session});
    await session.commitTransaction();

    res.status(200).json({message: 'Request accepted', event});
  } catch (error) {
    await session.abortTransaction();
    console.error('Error accepting request:', error);
    res.status(500).json({message: 'Server error'});
  } finally {
    session.endSession();
  }
});

app.post('/reject', async (req, res) => {
  try {
    const {requestId, eventId} = req.body;

    const event = await Event.findOneAndUpdate(
      {_id: eventId, 'requests._id': requestId},
      {$set: {'requests.$.status': 'rejected'}},
      {new: true},
    );

    if (!event) {
      return res.status(404).json({message: 'Request or Event not found'});
    }

    console.log(`Request rejected: ${requestId}`);
    res.status(200).json({message: 'Request rejected'});
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({message: 'Server Error'});
  }
});

app.post('/sendrequest', async (req, res) => {
  const {senderId, receiverId, message} = req.body;

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

  receiver.requests.push({from: senderId, message});
  await receiver.save();

  console.log(`Request sent from ${senderId} to ${receiverId}`);
  res.status(200).json({message: 'Request sent successfully'});
});

app.get('/friends/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Fetching friends for userId: ${userId}`);

    const user = await User.findById(userId).populate(
      'friends',
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

app.get('/users', async (req, res) => {
  console.log('Fetching users...');
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

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(eventId)
    ) {
      return res.status(400).json({message: 'Invalid user or event ID'});
    }

    const [user, event] = await Promise.all([
      User.findById(userId),
      Event.findById(eventId),
    ]);

    if (!user) return res.status(404).json({message: 'User not found'});
    if (!event) return res.status(404).json({message: 'Event not found'});

    const isFavorited = user.favorites.includes(eventId);

    if (isFavorited) {
      user.favorites.pull(eventId);
      await user.save();
      return res
        .status(200)
        .json({message: 'Event removed from favorites', isFavorited: false});
    } else {
      user.favorites.addToSet(eventId);
      await user.save();
      return res
        .status(200)
        .json({message: 'Event added to favorites', isFavorited: true});
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/favorites/:userId', async (req, res) => {
  try {
    const {userId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({message: 'Invalid user ID'});
    }

    const user = await User.findById(userId).populate({
      path: 'favorites',
      model: 'Event',
      select: 'title location date time',
    });

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/venues/:venueId', async (req, res) => {
  const {venueId} = req.params;

  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    return res.status(400).json({message: 'Invalid Venue ID'});
  }

  try {
    const venue = await Venue.findById(venueId).populate({
      path: 'eventsAvailable',
      model: 'Event',
      select: 'title eventType location date time price',
    });

    if (!venue) {
      return res.status(404).json({message: 'Venue not found'});
    }

    res.status(200).json(venue);
  } catch (error) {
    console.error('Error fetching venue:', error.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/venues/:venueId/events', async (req, res) => {
  const {venueId} = req.params;

  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    return res.status(400).json({message: 'Invalid Venue ID'});
  }

  try {
    const venue = await Venue.findById(venueId).populate('eventsAvailable');
    if (!venue) return res.status(404).json({message: 'Venue not found'});

    const events = venue.eventsAvailable.map(event => ({
      _id: event._id,
      title: event.title,
      eventType: event.eventType,
      price: event.price,
      location: event.location,
      date: event.date,
      time: event.time,
    }));

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/event/:eventId/organizer', async (req, res) => {
  try {
    const {eventId} = req.params;

    const event = await Event.findById(eventId).populate(
      'organizer',
      'firstName lastName image',
    );
    if (!event) {
      return res.status(404).json({message: 'Event not found'});
    }

    const organizer = event.organizer;
    res.status(200).json(organizer);
  } catch (error) {
    console.error('Error fetching organizer:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/events/:eventId', async (req, res) => {
  const {eventId} = req.params;

  console.log('Fetching event with ID:', eventId);

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({message: 'Invalid event ID'});
  }

  try {
    const event = await Event.findById(eventId)
      .populate('organizer')
      .populate('attendees');

    if (!event) {
      console.warn('Event not found.');
      return res.status(404).json({message: 'Event not found'});
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
});

app.put('/event/:eventId', async (req, res) => {
  const {eventId} = req.params;
  const updateData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({message: 'Event not found'});
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error.message);
    res
      .status(500)
      .json({message: 'Failed to update event', error: error.message});
  }
});

app.post('/venues', async (req, res) => {
  try {
    const newVenue = new Venue(req.body);
    await newVenue.save();
    res
      .status(201)
      .json({message: 'Venue created successfully', venue: newVenue});
  } catch (error) {
    console.error('Error creating venue:', error);
    res.status(500).json({message: 'Failed to create venue'});
  }
});

app.post('/user/:userId/interests', async (req, res) => {
  try {
    const {userId} = req.params;
    const {interests} = req.body;

    const user = await User.findByIdAndUpdate(userId, {interests}, {new: true});

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.status(200).json({message: 'Interests saved successfully', user});
  } catch (error) {
    res.status(500).json({message: 'Failed to save interests', error});
  }
});

app.get('/user/:userId/interests', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({message: 'Invalid user ID format'});
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({interests: user.interests});
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.put('/user/:userId/about', async (req, res) => {
  try {
    const {userId} = req.params;
    const {aboutMe} = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {aboutMe},
      {new: true},
    );

    if (!updatedUser) {
      return res.status(404).json({message: 'User not found'});
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({message: 'Failed to update about me', error});
  }
});
