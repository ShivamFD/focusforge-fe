import React from 'react';
import { motion } from 'framer-motion';

const StreakCard = ({ streak, task }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {task?.title || 'Unknown Task'}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{task?.taskType}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {streak.taskId.taskType}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{streak.current}</div>
          <div className="text-xs text-gray-500">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{streak.longest}</div>
          <div className="text-xs text-gray-500">Longest Streak</div>
        </div>
      </div>
      
      {streak.lastCompletedDate && (
        <div className="mt-4 text-sm text-gray-500">
          Last completed: {new Date(streak.lastCompletedDate).toLocaleDateString()}
        </div>
      )}
    </motion.div>
  );
};

export default StreakCard;