import React, { useState } from 'react';
import { format } from 'date-fns';

const TaskList = ({ tasks, onComplete, onRecover, isLoading }) => {
  const [completedToday, setCompletedToday] = useState({});

  if (isLoading) {
    return (
      <div className="card p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500 mb-4">Create your first task to start building discipline</p>
        <p className="text-sm text-gray-400">Click on the "Create New Task" form to add a task</p>
      </div>
    );
  }

  const handleComplete = (taskId) => {
    setCompletedToday(prev => ({ ...prev, [taskId]: true }));
    onComplete(taskId);
    setTimeout(() => {
      setCompletedToday(prev => ({ ...prev, [taskId]: false }));
    }, 2000);
  };

  const getTaskTypeColor = (type) => {
    const colors = {
      daily: 'bg-blue-100 text-blue-800',
      monthly: 'bg-purple-100 text-purple-800',
      yearly: 'bg-orange-100 text-orange-800',
      custom: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.custom;
  };

  const getTaskTypeIcon = (type) => {
    const icons = {
      daily: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      monthly: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      yearly: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
      custom: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    return icons[type] || icons.custom;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Your Active Tasks</h3>
        <span className="text-sm text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={task._id}
            className={`border rounded-lg p-4 transition-all duration-300 ${
              completedToday[task._id]
                ? 'bg-green-50 border-green-200 shadow-md'
                : 'border-gray-200 hover:shadow-md hover:border-blue-200'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    completedToday[task._id] ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    {completedToday[task._id] ? (
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                    )}
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 truncate">{task.title}</h4>
                </div>
                <div className="ml-10 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTaskTypeColor(task.taskType)}`}>
                    {getTaskTypeIcon(task.taskType)}
                    {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                  </span>
                  {task.plannedTime > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {task.plannedTime} min
                    </span>
                  )}
                  {task.duration && task.duration.value && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Every {task.duration.value} {task.duration.unit}{task.duration.value > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4 flex flex-col space-y-2">
                <button
                  onClick={() => handleComplete(task._id)}
                  disabled={completedToday[task._id]}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    completedToday[task._id]
                      ? 'bg-green-500 text-white cursor-default'
                      : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                  }`}
                >
                  {completedToday[task._id] ? (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Done
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Complete
                    </>
                  )}
                </button>
                <button
                  onClick={() => onRecover(task._id)}
                  className="btn-secondary text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-1"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Recover
                </button>
              </div>
            </div>
            <div className="ml-10 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created: {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
