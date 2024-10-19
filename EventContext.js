import React, {createContext, useState} from 'react';

export const EventContext = createContext();

export const EventProvider = ({children}) => {
  const [events, setEvents] = useState([]);

  const updateEvent = updatedEvent => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event._id === updatedEvent._id ? updatedEvent : event,
      ),
    );
  };

  return (
    <EventContext.Provider value={{events, setEvents, updateEvent}}>
      {children}
    </EventContext.Provider>
  );
};
