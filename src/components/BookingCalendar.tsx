import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Star, Music } from 'lucide-react';

interface BookingCalendarProps {
  djId: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ djId }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Mock availability data
  const availableDates = [5, 8, 12, 15, 19, 22, 26, 29];
  const bookedDates = [3, 10, 17, 24];

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 sm:h-10 md:h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isAvailable = availableDates.includes(day);
      const isBooked = bookedDates.includes(day);
      const isSelected = selectedDate === day;
      const isToday = day === new Date().getDate() && 
                     selectedMonth === new Date().getMonth() && 
                     selectedYear === new Date().getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => isAvailable && setSelectedDate(day)}
          className={`h-8 sm:h-10 md:h-12 flex items-center justify-center text-xs sm:text-sm cursor-pointer transition-all duration-300 rounded-lg relative group ${
            isToday 
              ? 'bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold shadow-lg shadow-purple-500/25' 
              : isSelected
              ? 'bg-gradient-to-br from-purple-400 to-cyan-400 text-white font-semibold shadow-lg shadow-purple-400/25'
              : isAvailable
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-500/20 hover:scale-105'
              : isBooked
              ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 cursor-not-allowed'
              : 'text-gray-600 cursor-not-allowed hover:text-gray-500'
          }`}
        >
          {day}
          {isAvailable && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-gradient-to-br from-dark-800/80 to-dark-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-700/50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <span className="hidden sm:inline">Disponibilités</span>
          <span className="sm:hidden">Agenda</span>
        </h3>
        
        {selectedDate && (
          <div className="text-xs sm:text-sm text-cyan-400 font-medium">
            {selectedDate} {months[selectedMonth]}
          </div>
        )}
      </div>

      {/* Month/Year Selector */}
      <div className="flex items-center justify-between mb-6 bg-dark-800/50 rounded-xl p-3">
        <button
          onClick={() => {
            if (selectedMonth === 0) {
              setSelectedMonth(11);
              setSelectedYear(selectedYear - 1);
            } else {
              setSelectedMonth(selectedMonth - 1);
            }
            setSelectedDate(null);
          }}
          className="p-2 text-gray-400 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-200 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
        
        <h4 className="text-white font-semibold text-sm sm:text-base">
          {months[selectedMonth]} {selectedYear}
        </h4>
        
        <button
          onClick={() => {
            if (selectedMonth === 11) {
              setSelectedMonth(0);
              setSelectedYear(selectedYear + 1);
            } else {
              setSelectedMonth(selectedMonth + 1);
            }
            setSelectedDate(null);
          }}
          className="p-2 text-gray-400 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-200 group"
        >
          <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
          <div key={day} className="h-6 sm:h-8 flex items-center justify-center text-xs text-gray-400 font-medium">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
        <div className="flex items-center gap-2 p-2 bg-dark-800/30 rounded-lg">
          <div className="w-3 h-3 bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-500/50 rounded"></div>
          <span className="text-gray-400">Disponible</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-dark-800/30 rounded-lg">
          <div className="w-3 h-3 bg-gradient-to-br from-red-500/30 to-pink-500/30 border border-red-500/50 rounded"></div>
          <span className="text-gray-400">Réservé</span>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl">
          <h5 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            {selectedDate} {months[selectedMonth]} {selectedYear}
          </h5>
          <p className="text-sm text-gray-400 mb-3">Créneaux disponibles :</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-dark-800/50 rounded-lg text-center">
              <div className="text-cyan-400 font-medium">20h - 02h</div>
              <div className="text-gray-500">Soirée</div>
            </div>
            <div className="p-2 bg-dark-800/50 rounded-lg text-center">
              <div className="text-purple-400 font-medium">14h - 18h</div>
              <div className="text-gray-500">Après-midi</div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Events Preview */}
      <div className="pt-6 border-t border-gray-700/50">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
            <Music className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
          </div>
          <span className="text-sm sm:text-base">Prochains événements</span>
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-dark-800/30 rounded-lg hover:bg-dark-800/50 transition-colors">
            <div>
              <div className="text-sm font-medium text-white">Club Nexus</div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Miami Beach
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-cyan-400 font-medium">15 Déc</div>
              <div className="text-xs text-gray-500">22h00</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-dark-800/30 rounded-lg hover:bg-dark-800/50 transition-colors">
            <div>
              <div className="text-sm font-medium text-white">Événement privé</div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Brickell
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-400 font-medium">22 Déc</div>
              <div className="text-xs text-gray-500">20h00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;