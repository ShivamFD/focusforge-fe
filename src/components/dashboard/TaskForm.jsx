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
        toast.success('Task created successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create task';
        toast.error(message);
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

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      duration: {
        ...formData.duration,
        [name.replace('duration', '').toLowerCase()]: value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const taskData = {
      title: formData.title,
      taskType: formData.taskType,
      plannedTime: parseInt(formData.plannedTime) || 0,
      duration: {
        value: parseInt(formData.durationValue),
        unit: formData.durationUnit,
      },
    };
    
    createTaskMutation.mutate(taskData);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="e.g., Morning meditation"
          />
        </div>

        <div>
          <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 mb-1">
            Task Type
          </label>
          <select
            id="taskType"
            name="taskType"
            value={formData.taskType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="durationValue" className="block text-sm font-medium text-gray-700 mb-1">
              Duration Value
            </label>
            <input
              type="number"
              id="durationValue"
              name="durationValue"
              value={formData.durationValue}
              onChange={handleChange}
              min="1"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="durationUnit" className="block text-sm font-medium text-gray-700 mb-1">
              Duration Unit
            </label>
            <select
              id="durationUnit"
              name="durationUnit"
              value={formData.durationUnit}
              onChange={handleChange}
              className="input-field"
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
            className="input-field"
            placeholder="e.g., 15"
          />
        </div>

        <button
          type="submit"
          disabled={createTaskMutation.isLoading}
          className="btn-primary w-full"
        >
          {createTaskMutation.isLoading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;