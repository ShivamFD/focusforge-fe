import React from 'react';
import { format, parseISO, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';

const Heatmap = ({ data }) => {
  // Convert data to a map for quick lookup
  const dataMap = new Map();
  data.forEach(item => {
    dataMap.set(item.date, item);
  });

  // Get the date range
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1); // 3 months ago
  const endDate = today;

  // Get all weeks in the range
  const start = startOfWeek(startDate);
  const end = endOfWeek(endDate);
  const weeks = [];
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
    weeks.push(new Date(d));
  }

  // Get day labels
  const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

  // Get month labels
  const months = [];
  for (let d = new Date(startDate); d <= endDate; d = addMonths(d, 1)) {
    months.push(new Date(d));
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-start">
        {/* Month labels */}
        <div className="flex mr-2" style={{ minWidth: '30px' }}>
          {months.map((month, i) => (
            <div 
              key={i} 
              className="text-xs text-gray-500 mb-1" 
              style={{ width: `${(eachDayOfInterval({ start: month, end: endOfWeek(addMonths(month, 1), { weekStartsOn: 1 }) }).length * 13)}px` }}
            >
              {format(month, 'MMM yyyy')}
            </div>
          ))}
        </div>
        
        {/* Calendar */}
        <div>
          {/* Day labels */}
          <div className="flex mb-1" style={{ height: '20px' }}>
            {Array.from({ length: 53 }).map((_, i) => (
              <div key={i} className="w-3 h-3" />
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex">
            {weeks.map((weekStart, weekIndex) => {
              const days = Array.from({ length: 7 }, (_, i) => {
                const day = new Date(weekStart);
                day.setDate(day.getDate() + i);
                return day;
              });

              return (
                <div key={weekIndex} className="flex flex-col mr-1">
                  {days.map((day, dayIndex) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayData = dataMap.get(dateStr);
                    
                    // Determine intensity level (0-4)
                    let level = 0;
                    if (dayData && dayData.completed) {
                      level = dayData.isRecovered ? 1 : 4; // Different color for recovered
                    }
                    
                    // Check if it's today
                    const isToday = isSameDay(day, today);
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`heatmap-day ${
                          dayData ? `level-${level}` : 'bg-gray-100'
                        } ${isToday ? 'border border-gray-400' : ''}`}
                        title={`${format(day, 'MMM d, yyyy')} - ${dayData ? (dayData.completed ? (dayData.isRecovered ? 'Recovered' : 'Completed') : 'Missed') : 'No data'}`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center mt-4 text-xs text-gray-500">
        <span className="mr-2">Less</span>
        <div className="flex">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`heatmap-day ml-1 level-${level}`}
            />
          ))}
        </div>
        <span className="ml-2">More</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        <span className="inline-block w-3 h-3 bg-green-400 mr-1"></span>Completed
        <span className="inline-block w-3 h-3 bg-blue-300 mr-1 ml-2"></span>Recovered
      </div>
    </div>
  );
};

export default Heatmap;