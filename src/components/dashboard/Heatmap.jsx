import React, { useState } from 'react';
import { format } from 'date-fns';

const Heatmap = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p>No activity data available</p>
        <p className="text-sm mt-2">Start completing tasks to see your activity</p>
      </div>
    );
  }

  // Group data by weeks
  const weeks = [];
  let currentWeek = [];

  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Fill last week if incomplete
  while (currentWeek.length < 7 && currentWeek.length > 0) {
    currentWeek.push({ date: null, completed: false });
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getLevelColor = (day) => {
    if (!day.date) return 'bg-gray-100';
    if (!day.completed) return 'bg-gray-200';
    if (day.isRecovered) return 'bg-yellow-400 hover:bg-yellow-500';
    return 'bg-green-500 hover:bg-green-600';
  };

  const getTooltipText = (day) => {
    if (!day.date) return '';
    const dateStr = format(new Date(day.date), 'EEEE, MMMM d, yyyy');
    if (!day.completed) return `No activity on ${dateStr}`;
    if (day.isRecovered) return `Recovered on ${dateStr}`;
    return `Completed on ${dateStr}`;
  };

  const monthLabels = data
    .filter((_, index) => {
      const date = new Date(data[index]?.date);
      return date.getDate() <= 7; // First week of month
    })
    .map((day) => {
      const date = new Date(day.date);
      return {
        month: format(date, 'MMM'),
        year: date.getFullYear(),
      };
    })
    .filter((item, index, self) => index === self.findIndex((t) => t.month === item.month));

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
            <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
            <div className="w-3 h-3 rounded-sm bg-green-500"></div>
            <div className="w-3 h-3 rounded-sm bg-green-600"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex mb-2 ml-10">
        {monthLabels.map((item, index) => (
          <div key={index} className="text-xs text-gray-500 font-medium flex-1 text-center">
            {item.month}
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-2">
          <div className="h-3 w-3"></div>
          <div className="h-3 w-3 text-xs text-gray-400 font-medium flex items-center justify-center">M</div>
          <div className="h-3 w-3"></div>
          <div className="h-3 w-3 text-xs text-gray-400 font-medium flex items-center justify-center">W</div>
          <div className="h-3 w-3"></div>
          <div className="h-3 w-3 text-xs text-gray-400 font-medium flex items-center justify-center">F</div>
        </div>

        {/* Weeks */}
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm transition-all duration-200 cursor-pointer ${getLevelColor(
                    day
                  )} ${selectedDate === day.date ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                  title={getTooltipText(day)}
                  onClick={() => setSelectedDate(day.date)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Selected date info */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {data.find((d) => d.date === selectedDate)?.completed
                  ? data.find((d) => d.date === selectedDate)?.isRecovered
                    ? '✓ Task recovered for this day'
                    : '✓ Task completed'
                  : '✗ No activity recorded'}
              </p>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="flex-shrink-0 text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Stats summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {data.filter((d) => d.completed && !d.isRecovered).length}
          </div>
          <div className="text-xs text-green-700 font-medium mt-1">Completed</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {data.filter((d) => d.isRecovered).length}
          </div>
          <div className="text-xs text-yellow-700 font-medium mt-1">Recovered</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {data.filter((d) => !d.completed).length}
          </div>
          <div className="text-xs text-gray-700 font-medium mt-1">Missed</div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
