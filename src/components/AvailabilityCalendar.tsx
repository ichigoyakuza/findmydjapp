import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Plus, X, Edit3, Trash2 } from 'lucide-react';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  isBooked: boolean;
  eventTitle?: string;
  clientName?: string;
  price?: number;
}

interface DayAvailability {
  date: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface AvailabilityCalendarProps {
  isDJ?: boolean;
  djId?: string;
  onSlotSelect?: (date: string, slot: TimeSlot) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ 
  isDJ = false, 
  djId,
  onSlotSelect 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [newSlot, setNewSlot] = useState({ start: '', end: '', price: '' });

  // Données de démonstration
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({
    '2024-01-15': {
      date: '2024-01-15',
      isAvailable: true,
      timeSlots: [
        {
          id: '1',
          start: '14:00',
          end: '18:00',
          isBooked: false,
          price: 300
        },
        {
          id: '2',
          start: '20:00',
          end: '02:00',
          isBooked: true,
          eventTitle: 'Mariage Sophie & Pierre',
          clientName: 'Sophie Dubois',
          price: 800
        }
      ]
    },
    '2024-01-16': {
      date: '2024-01-16',
      isAvailable: true,
      timeSlots: [
        {
          id: '3',
          start: '19:00',
          end: '01:00',
          isBooked: false,
          price: 500
        }
      ]
    },
    '2024-01-20': {
      date: '2024-01-20',
      isAvailable: true,
      timeSlots: [
        {
          id: '4',
          start: '21:00',
          end: '03:00',
          isBooked: true,
          eventTitle: 'Soirée Entreprise',
          clientName: 'Tech Corp',
          price: 600
        }
      ]
    }
  });

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dateString: prevDate.toISOString().split('T')[0]
      });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        dateString: date.toISOString().split('T')[0]
      });
    }

    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dateString: nextDate.toISOString().split('T')[0]
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDayStatus = (dateString: string) => {
    const dayData = availability[dateString];
    if (!dayData) return 'unavailable';
    
    const hasBookedSlots = dayData.timeSlots.some(slot => slot.isBooked);
    const hasAvailableSlots = dayData.timeSlots.some(slot => !slot.isBooked);
    
    if (hasBookedSlots && hasAvailableSlots) return 'partial';
    if (hasBookedSlots) return 'booked';
    if (hasAvailableSlots) return 'available';
    return 'unavailable';
  };

  const addTimeSlot = () => {
    if (!selectedDate || !newSlot.start || !newSlot.end) return;

    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      start: newSlot.start,
      end: newSlot.end,
      isBooked: false,
      price: parseInt(newSlot.price) || 0
    };

    setAvailability(prev => ({
      ...prev,
      [selectedDate]: {
        date: selectedDate,
        isAvailable: true,
        timeSlots: [...(prev[selectedDate]?.timeSlots || []), newTimeSlot]
      }
    }));

    setNewSlot({ start: '', end: '', price: '' });
    setShowTimeSlotModal(false);
  };

  const removeTimeSlot = (dateString: string, slotId: string) => {
    setAvailability(prev => ({
      ...prev,
      [dateString]: {
        ...prev[dateString],
        timeSlots: prev[dateString].timeSlots.filter(slot => slot.id !== slotId)
      }
    }));
  };

  const days = getDaysInMonth(currentDate);
  const selectedDayData = selectedDate ? availability[selectedDate] : null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header du calendrier */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isDJ ? 'Mes Disponibilités' : 'Disponibilités'}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <div className="lg:col-span-2">
          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-1">
            {days.map(({ date, isCurrentMonth, dateString }) => {
              const status = getDayStatus(dateString);
              const isSelected = selectedDate === dateString;
              const isToday = dateString === new Date().toISOString().split('T')[0];

              return (
                <button
                  key={dateString}
                  onClick={() => setSelectedDate(dateString)}
                  className={`
                    p-3 text-sm rounded-lg transition-all duration-200 relative
                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                    ${isSelected ? 'ring-2 ring-purple-500' : ''}
                    ${isToday ? 'font-bold' : ''}
                    ${status === 'available' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                    ${status === 'booked' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                    ${status === 'partial' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                    ${status === 'unavailable' ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : ''}
                  `}
                >
                  {date.getDate()}
                  {availability[dateString]?.timeSlots.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Légende */}
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-200 rounded"></div>
              <span>Partiellement réservé</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span>Réservé</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span>Non disponible</span>
            </div>
          </div>
        </div>

        {/* Détails du jour sélectionné */}
        <div className="bg-gray-50 rounded-lg p-4">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {new Date(selectedDate).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </h4>
                {isDJ && (
                  <button
                    onClick={() => setShowTimeSlotModal(true)}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {selectedDayData?.timeSlots && selectedDayData.timeSlots.length > 0 ? (
                <div className="space-y-3">
                  {selectedDayData.timeSlots.map(slot => (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-lg border ${
                        slot.isBooked 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            {slot.start} - {slot.end}
                          </span>
                        </div>
                        {isDJ && !slot.isBooked && (
                          <button
                            onClick={() => removeTimeSlot(selectedDate, slot.id)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {slot.isBooked ? (
                        <div>
                          <p className="text-sm font-medium text-red-800">
                            {slot.eventTitle}
                          </p>
                          <p className="text-sm text-red-600">
                            Client: {slot.clientName}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-green-800">
                            Disponible
                          </p>
                          {!isDJ && (
                            <button
                              onClick={() => onSlotSelect?.(selectedDate, slot)}
                              className="mt-2 w-full px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                            >
                              Réserver
                            </button>
                          )}
                        </div>
                      )}
                      
                      {slot.price && (
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {slot.price}€
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {isDJ ? 'Aucun créneau défini' : 'Aucune disponibilité'}
                  </p>
                  {isDJ && (
                    <button
                      onClick={() => setShowTimeSlotModal(true)}
                      className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Ajouter un créneau
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500">
                Sélectionnez une date pour voir les détails
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout de créneau */}
      {showTimeSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Ajouter un créneau
              </h3>
              <button
                onClick={() => setShowTimeSlotModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de début
                </label>
                <input
                  type="time"
                  value={newSlot.start}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de fin
                </label>
                <input
                  type="time"
                  value={newSlot.end}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  value={newSlot.price}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="300"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowTimeSlotModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={addTimeSlot}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;