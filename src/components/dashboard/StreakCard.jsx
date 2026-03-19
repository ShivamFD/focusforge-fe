import React from 'react';

const StreakCard = ({ streak, task }) => {
  const getStreakLevel = (current) => {
    if (current >= 30) return 'legendary';
    if (current >= 14) return 'epic';
    if (current >= 7) return 'rare';
    if (current >= 3) return 'uncommon';
    return 'common';
  };

  const getStreakStyles = (level) => {
    const styles = {
      legendary: {
        bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        text: 'text-yellow-600',
        border: 'border-yellow-300',
        glow: 'shadow-yellow-200',
      },
      epic: {
        bg: 'bg-gradient-to-br from-purple-400 to-pink-500',
        text: 'text-purple-600',
        border: 'border-purple-300',
        glow: 'shadow-purple-200',
      },
      rare: {
        bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
        text: 'text-blue-600',
        border: 'border-blue-300',
        glow: 'shadow-blue-200',
      },
      uncommon: {
        bg: 'bg-gradient-to-br from-green-400 to-emerald-500',
        text: 'text-green-600',
        border: 'border-green-300',
        glow: 'shadow-green-200',
      },
      common: {
        bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
        text: 'text-gray-600',
        border: 'border-gray-300',
        glow: 'shadow-gray-200',
      },
    };
    return styles[level] || styles.common;
  };

  const getFlameIcon = (level) => {
    const sizes = {
      legendary: 'h-12 w-12',
      epic: 'h-10 w-10',
      rare: 'h-9 w-9',
      uncommon: 'h-8 w-8',
      common: 'h-7 w-7',
    };

    return (
      <svg className={`${sizes[level]} ${level === 'legendary' ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    );
  };

  if (!streak) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
        <p className="text-gray-500">No streak data available</p>
      </div>
    );
  }

  const level = getStreakLevel(streak.current);
  const styles = getStreakStyles(level);

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 ${styles.border} bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      {/* Background gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${styles.bg} opacity-10 rounded-full -translate-y-16 translate-x-16`}></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${styles.bg} bg-opacity-20`}>
            {getFlameIcon(level)}
          </div>
          {streak.longest > streak.current && (
            <div className="text-xs text-gray-500 font-medium">
              Personal Best: {streak.longest}
            </div>
          )}
        </div>

        {/* Streak count */}
        <div className="mb-3">
          <div className={`text-4xl font-bold ${styles.text}`}>
            {streak.current}
          </div>
          <div className="text-sm text-gray-500 font-medium">day streak</div>
        </div>

        {/* Task info */}
        {task && (
          <div className="pt-3 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-900 truncate" title={task.title}>
              {task.title}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${styles.text} bg-opacity-20 ${styles.bg}`}>
                {task.taskType}
              </span>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {streak.longest > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress to personal best</span>
              <span>{Math.round((streak.current / streak.longest) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${styles.bg}`}
                style={{ width: `${Math.min((streak.current / streak.longest) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Last completed date */}
        {streak.lastCompletedDate && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 text-center">
            Last completed: {new Date(streak.lastCompletedDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCard;
