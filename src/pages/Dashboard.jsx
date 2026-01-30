import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { authAPI, taskAPI, streakAPI, reportAPI } from '../services/api';
import { useAuthContext } from '../contexts/AuthContext.jsx';
import TaskForm from '../components/dashboard/TaskForm';
import TaskList from '../components/dashboard/TaskList';
import StreakCard from '../components/dashboard/StreakCard';
import Heatmap from '../components/dashboard/Heatmap';

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState(null);

  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext();

  // Fetch tasks
  const { data: tasksData, isLoading: tasksLoading } = useQuery(
    'tasks',
    () => taskAPI.getTasks({ isActive: true }).then(res => res.data.data.tasks),
    {
      enabled: !!isAuthenticated,
    }
  );

  // Fetch streaks
  const { data: streaksData, isLoading: streaksLoading } = useQuery(
    'streaks',
    () => streakAPI.getUserStreaks().then(res => res.data.data.streaks),
    {
      enabled: !!isAuthenticated,
    }
  );

  // Fetch stats
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'stats',
    () => reportAPI.getUserStats().then(res => res.data.data.stats),
    {
      enabled: !!isAuthenticated,
    }
  );

  // Fetch heatmap data
  const { data: heatmapData, isLoading: heatmapLoading } = useQuery(
    'heatmap',
    () => reportAPI.getHeatmap().then(res => res.data.data.heatmapData),
    {
      enabled: !!isAuthenticated,
    }
  );

  // Mutation for completing tasks
  const completeTaskMutation = useMutation(
    ({ taskId }) => taskAPI.completeTask(taskId),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('tasks');
        queryClient.invalidateQueries('streaks');
        queryClient.invalidateQueries('stats');
        queryClient.invalidateQueries('heatmap');
        toast.success('Task completed!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to complete task';
        toast.error(message);
      },
    }
  );

  // Mutation for recovering tasks
  const recoverTaskMutation = useMutation(
    ({ taskId }) => taskAPI.recoverTask(taskId),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('tasks');
        queryClient.invalidateQueries('streaks');
        queryClient.invalidateQueries('stats');
        queryClient.invalidateQueries('heatmap');
        toast.success('Task recovered for yesterday!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to recover task';
        toast.error(message);
      },
    }
  );

  const handleCompleteTask = (taskId) => {
    completeTaskMutation.mutate({ taskId });
  };

  const handleRecoverTask = (taskId) => {
    recoverTaskMutation.mutate({ taskId });
  };

  if (authLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="text-sm text-gray-500">
              Welcome back, {user?.publicProfile?.alias || user?.name}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{statsData?.activeTasks || 0}</div>
            <div className="text-sm text-gray-500">Active Tasks</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{statsData?.consistencyScore || 0}%</div>
            <div className="text-sm text-gray-500">Consistency</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{statsData?.completedLogs || 0}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{statsData?.recentConsistency || 0}%</div>
            <div className="text-sm text-gray-500">Recent (7d)</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setActiveTab('streaks')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'streaks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Streaks
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'heatmap'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activity
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TaskList
                tasks={tasksData || []}
                onComplete={handleCompleteTask}
                onRecover={handleRecoverTask}
                isLoading={tasksLoading}
              />
            </div>
            <div>
              <TaskForm />
            </div>
          </div>
        )}

        {activeTab === 'streaks' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Streaks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(streaksData || []).map((streak) => (
                <StreakCard
                  key={streak._id}
                  streak={streak}
                  task={streak.taskId}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Activity</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {heatmapLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <Heatmap data={heatmapData || []} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;