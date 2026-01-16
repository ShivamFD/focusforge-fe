import React from 'react';
import { format } from 'date-fns';

const TaskList = ({ tasks, onComplete, onRecover, isLoading }) => {
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Create your first task to start building discipline</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Active Tasks</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-medium text-gray-900 truncate">{task.title}</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                  </span>
                  {task.plannedTime > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {task.plannedTime} min
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4 flex flex-col space-y-2">
                <button
                  onClick={() => onComplete(task._id)}
                  className="btn-success text-sm px-3 py-1"
                >
                  Complete
                </button>
                <button
                  onClick={() => onRecover(task._id)}
                  className="btn-secondary text-sm px-3 py-1"
                >
                  Recover
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;