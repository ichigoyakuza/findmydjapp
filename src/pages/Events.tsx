import React, { useState } from 'react';
import { Calendar, MapPin, Clock, ExternalLink, Ticket } from 'lucide-react';

const Events = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const events = [
    {
      id: '1',
      title: 'Miami Music Week',
      dj: 'DJ Nexus',
      date: '2024-03-25',
      time: '22:00',
      venue: 'Club Space',
      city: 'Miami, FL',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
      ticketUrl: 'https://tickets.example.com',
      type: 'Festival',
    },
    {
      id: '2',
      title: 'Progressive House Night',
      dj: 'Luna Beats',
      date: '2024-03-30',
      time: '21:00',
      venue: 'Sound Nightclub',
      city: 'Los Angeles, CA',
      image: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=600',
      ticketUrl: 'https://tickets.example.com',
      type: 'Club Night',
    },
    {
      id: '3',
      title: 'Underground Sessions',
      dj: 'Bass Master',
      date: '2024-04-05',
      time: '23:00',
      venue: 'Warehouse 23',
      city: 'Brooklyn, NY',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
      ticketUrl: 'https://tickets.example.com',
      type: 'Underground',
    },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'festival':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'club night':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'underground':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upcoming <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Don't miss out on the hottest DJ events and performances happening near you
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                viewMode === 'calendar'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>

        {/* Events List */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="md:flex">
                  {/* Event Image */}
                  <div className="md:w-1/3">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                        <p className="text-lg text-gray-300">featuring {event.dj}</p>
                      </div>

                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
                      >
                        <Ticket className="w-4 h-4" />
                        Get Tickets
                      </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}, {event.city}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700">
            <div className="text-center text-gray-400 py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">Calendar view coming soon...</p>
              <p className="mt-2">For now, switch to list view to see all upcoming events</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;