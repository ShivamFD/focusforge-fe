import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiPlus, FiCalendar, FiTrendingUp, FiAward, FiUser } from 'react-icons/fi';

const FocusForgeApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Morning Meditation', completed: false, streak: 5, type: 'daily' },
    { id: 2, title: 'Exercise', completed: true, streak: 12, type: 'daily' },
    { id: 3, title: 'Read 30 mins', completed: false, streak: 8, type: 'daily' },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiUser },
    { id: 'tasks', label: 'Tasks', icon: FiCheck },
    { id: 'streaks', label: 'Streaks', icon: FiTrendingUp },
    { id: 'leaderboard', label: 'Leaderboard', icon: FiAward },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <FiCheck className="text-white" />
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FocusForge
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <FiCalendar className="text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2">Today's Goal</h3>
                <p className="text-sm text-gray-600">Complete 3 out of 3 tasks</p>
                <div className="mt-3 bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center">
                  <FiPlus className="mr-2" />
                  Add Task
                </button>
              </div>

              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">Current Streak</p>
                          <p className="text-3xl font-bold">12</p>
                        </div>
                        <FiTrendingUp className="w-8 h-8 text-blue-200" />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">Completed Today</p>
                          <p className="text-3xl font-bold">3/3</p>
                        </div>
                        <FiCheck className="w-8 h-8 text-green-200" />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">Consistency</p>
                          <p className="text-3xl font-bold">95%</p>
                        </div>
                        <FiAward className="w-8 h-8 text-purple-200" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Tasks</h2>
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all ${
                                task.completed
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-green-400'
                              }`}
                            >
                              {task.completed && <FiCheck className="w-4 h-4" />}
                            </button>
                            <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{task.streak} day streak</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {task.type}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Tasks</h2>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <span className="text-gray-900">{task.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {task.type}
                          </span>
                          <button className="text-red-500 hover:text-red-700">
                            <FiX />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'streaks' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Streaks</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <span className="text-2xl font-bold text-blue-600">{task.streak}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(task.streak * 10, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard</h2>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((rank) => (
                      <div key={rank} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                            rank === 1 ? 'bg-yellow-500' : 
                            rank === 2 ? 'bg-gray-400' : 
                            rank === 3 ? 'bg-orange-600' : 'bg-gray-300'
                          }`}>
                            {rank}
                          </div>
                          <span className="text-gray-900">User {rank}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{rank === 1 ? '25' : 30 - rank * 4} day streak</div>
                          <div className="text-sm text-gray-500">{95 - rank * 2}% consistency</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusForgeApp;