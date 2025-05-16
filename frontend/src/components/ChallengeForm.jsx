import React, { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const ChallengeForm = ({ onBack, onChallengeCreated, buddy, challengeToEdit = null }) => {
  const initialFormState = challengeToEdit ? {
    title: challengeToEdit.title,
    description: challengeToEdit.description,
    deadline: format(new Date(challengeToEdit.deadline), 'yyyy-MM-dd\'T\'HH:mm'),
    category: challengeToEdit.category,
    points: challengeToEdit.points
  } : {
    title: '',
    description: '',
    deadline: '',
    category: 'programming',
    points: 10
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'points' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const url = challengeToEdit 
        ? `http://localhost:8000/challenge/${challengeToEdit._id}`
        : 'http://localhost:8000/challenge';
      
      const method = challengeToEdit ? 'put' : 'post';
      
      const payload = {
        ...formData,
        assignedTo: buddy._id
      };

      const response = await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onChallengeCreated();
      } else {
        setError(response.data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error creating/updating challenge:', error);
      setError(error.response?.data?.message || 'Failed to save challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {challengeToEdit ? 'Edit Challenge' : 'Create New Challenge'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
            Challenge Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Give your challenge a clear, specific title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Challenge Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the challenge in detail. What needs to be done? How will success be measured?"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="deadline">
              Deadline *
            </label>
            <input
              type="datetime-local"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="programming">Programming</option>
              <option value="dsa">Data Structures & Algorithms</option>
              <option value="dbms">Database Management</option>
              <option value="theory">Theory & Concepts</option>
              <option value="project">Project Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="points">
              Points *
            </label>
            <input
              type="number"
              id="points"
              name="points"
              value={formData.points}
              onChange={handleChange}
              required
              min={1}
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : challengeToEdit ? 'Update Challenge' : 'Create Challenge'}
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Assigning To:</span> {buddy.fullname} ({buddy.usn})
        </p>
      </div>
    </div>
  );
};

export default ChallengeForm;