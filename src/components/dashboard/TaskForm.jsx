import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { taskAPI } from '../../services/api';

const TaskForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    taskType: 'daily',
    plannedTime: '',
    durationValue: 1,
    durationUnit: 'day',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const createTaskMutation = useMutation(
    (taskData) => taskAPI.createTask(taskData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        setFormData({
          title: '',
          taskType: 'daily',
          plannedTime: '',
          durationValue: 1,
          durationUnit: 'day',
        });
        setShowAdvanced(false);
        toast.success('Task created successfully! Start building discipline 🚀');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create task';
        toast.error(message);
      },
      onSettled: () => {
        queryClient.invalidateQueries('stats');
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      taskType: formData.taskType,
      plannedTime: parseInt(formData.plannedTime) || 0,
      duration: {
        value: parseInt(formData.durationValue),
        unit: formData.durationUnit,
      },
    };

    createTaskMutation.mutate(taskData);
  };

  const getTaskTypeDescription = (type) => {
    const descriptions = {
      daily: 'Complete every day',
      monthly: 'Complete every month',
      yearly: 'Complete every year',
      custom: 'Custom frequency',
    };
    return descriptions[type] || '';
  };

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Create New Task</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field border-2 focus:border-blue-500"
            placeholder="e.g., Morning meditation, Exercise, Reading"
            disabled={createTaskMutation.isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">Be specific about what you want to accomplish</p>
        </div>

        <div>
          <label htmlFor="taskType" className="block text-sm font-semibold text-gray-700 mb-1">
            Frequency
          </label>
          <select
            id="taskType"
            name="taskType"
            value={formData.taskType}
            onChange={handleChange}
            className="input-field border-2 focus:border-blue-500"
            disabled={createTaskMutation.isLoading}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">{getTaskTypeDescription(formData.taskType)}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          {showAdvanced ? 'Hide' : 'Show'} advanced options
        </button>

        {showAdvanced && (
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="durationValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Repeat Every
                </label>
                <input
                  type="number"
                  id="durationValue"
                  name="durationValue"
                  value={formData.durationValue}
                  onChange={handleChange}
                  min="1"
                  max="365"
                  className="input-field"
                  disabled={createTaskMutation.isLoading}
                />
              </div>
              <div>
                <label htmlFor="durationUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  id="durationUnit"
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  className="input-field"
                  disabled={createTaskMutation.isLoading}
                >
                  <option value="day">Day(s)</option>
                  <option value="week">Week(s)</option>
                  <option value="month">Month(s)</option>
                  <option value="year">Year(s)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="plannedTime" className="block text-sm font-medium text-gray-700 mb-1">
                Planned Time (minutes)
              </label>
              <input
                type="number"
                id="plannedTime"
                name="plannedTime"
                value={formData.plannedTime}
                onChange={handleChange}
                min="0"
                max="1440"
                className="input-field"
                placeholder="e.g., 15, 30, 60"
                disabled={createTaskMutation.isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">Optional: How long you plan to spend on this task</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={createTaskMutation.isLoading || !formData.title.trim()}
          className="btn-primary w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {createTaskMutation.isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
