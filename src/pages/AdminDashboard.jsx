import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import { useAuthContext } from '../contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch system stats
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'adminStats',
    () => adminAPI.getSystemStats().then(res => res.data.data.stats),
    {
      enabled: isAuthenticated && user?.role === 'admin',
    }
  );

  // Fetch all users
  const { data: usersData, isLoading: usersLoading } = useQuery(
    'allUsers',
    () => adminAPI.getAllUsers().then(res => res.data.data.users),
    {
      enabled: isAuthenticated && user?.role === 'admin',
    }
  );

  // Mutation for updating user role
  const updateUserRoleMutation = useMutation(
    ({ userId, role }) => adminAPI.updateUserRole(userId, role),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('allUsers');
        toast.success('User role updated successfully');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update user role';
        toast.error(message);
      },
    }
  );

  // Mutation for deleting user
  const deleteUserMutation = useMutation(
    ({ userId }) => adminAPI.deleteUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('allUsers');
        queryClient.invalidateQueries('adminStats');
        setSelectedUser(null);
        toast.success('User deleted successfully');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to delete user';
        toast.error(message);
      },
    }
  );

  const handleUpdateRole = (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateUserRoleMutation.mutate({ userId, role: newRole });
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate({ userId });
    }
  };

  // Redirect if not admin
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (statsLoading || usersLoading) {
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage users and view system statistics</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{statsData?.totalUsers || 0}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{statsData?.usersByRole?.admin || 0}</div>
            <div className="text-sm text-gray-500">Admins</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{statsData?.usersByRole?.user || 0}</div>
            <div className="text-sm text-gray-500">Regular Users</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{statsData?.totalLogs || 0}</div>
            <div className="text-sm text-gray-500">Total Task Logs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-indigo-600">{statsData?.overallConsistency || 0}%</div>
            <div className="text-sm text-gray-500">Overall Consistency</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recent Users
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Task Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Logs</span>
                      <span className="font-medium">{statsData?.totalLogs || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Logs</span>
                      <span className="font-medium">{statsData?.completedLogs || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overall Consistency</span>
                      <span className="font-medium">{statsData?.overallConsistency || 0}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">User Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admin Users</span>
                      <span className="font-medium">{statsData?.usersByRole?.admin || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Regular Users</span>
                      <span className="font-medium">{statsData?.usersByRole?.user || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Users</span>
                      <span className="font-medium">{statsData?.totalUsers || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks Completed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consistency
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersData?.map((userItem) => (
                    <tr key={userItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                        {userItem.publicProfile?.alias && (
                          <div className="text-sm text-gray-500">Alias: {userItem.publicProfile.alias}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{userItem.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={userItem.role}
                          onChange={(e) => handleUpdateRole(userItem._id, e.target.value)}
                          className={`text-sm font-medium px-2 py-1 rounded ${
                            userItem.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{userItem.stats?.totalTasksCompleted || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{userItem.stats?.consistencyScore || 0}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(userItem.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(userItem._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={userItem._id === user._id}
                        >
                          {userItem._id === user._id ? 'Cannot Delete' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statsData?.recentUsers?.map((userItem) => (
                    <tr key={userItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{userItem.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          userItem.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(userItem.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
