import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { authAPI } from '../services/api';
import { useAuthContext } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext(); // We'll use the login function to set the token after registration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    publicProfile: {
      alias: '',
      showOnLeaderboard: true,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('publicProfile.')) {
      const profileField = name.split('.')[1];
      setFormData({
        ...formData,
        publicProfile: {
          ...formData.publicProfile,
          [profileField]: type === 'checkbox' ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Prepare user data
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        publicProfile: {
          alias: formData.publicProfile.alias || formData.name,
          showOnLeaderboard: formData.publicProfile.showOnLeaderboard,
        },
      };

      const response = await authAPI.register(userData);
      const { token, user } = response.data.data;

      // Manually set the token (similar to login)
      localStorage.setItem('token', token);

      toast.success(`Welcome, ${user.name}! Your account has been created.`);
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Full Name"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Email address"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Password"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Public Profile</h3>

            <div className="mb-4">
              <label htmlFor="publicProfile.alias" className="block text-sm font-medium text-gray-700 mb-1">
                Alias (for leaderboard)
              </label>
              <input
                id="publicProfile.alias"
                name="publicProfile.alias"
                type="text"
                value={formData.publicProfile.alias}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter an alias (optional)"
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be shown on public leaderboards instead of your name
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="publicProfile.showOnLeaderboard"
                name="publicProfile.showOnLeaderboard"
                type="checkbox"
                checked={formData.publicProfile.showOnLeaderboard}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="publicProfile.showOnLeaderboard"
                className="ml-2 block text-sm text-gray-900"
              >
                Show on public leaderboard
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <span>Create account</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;