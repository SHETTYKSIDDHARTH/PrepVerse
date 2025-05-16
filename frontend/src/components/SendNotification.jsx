
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export function SendNotification() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentIds, setStudentIds] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [sendToAll, setSendToAll] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const token = localStorage.getItem('tpToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/tp/students', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAllStudents(response.data);
      setStudentsLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('tpToken');
        navigate('/login');
      }
      setStudentsLoading(false);
    }
  };

  const toggleStudentSelection = (studentId) => {
    setStudentIds(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    if (!message.trim()) {
      setError('Please enter a notification message');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('tpToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const payload = {
        message,
        studentIds: sendToAll ? [] : studentIds // Empty array means send to all students
      };

      await axios.post('http://localhost:8000/tp/notify', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setMessage('');
      setStudentIds([]);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending notification:', error);
      setError('Failed to send notification. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Send Notification</h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-600 rounded-lg">
          <p className="text-white">Notification sent successfully!</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-600 rounded-lg">
          <p className="text-white">{error}</p>
        </div>
      )}
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Notification Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded text-white h-32"
              placeholder="Enter your notification message here..."
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Send To</label>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="sendToAll"
                checked={sendToAll}
                onChange={() => setSendToAll(true)}
                className="mr-2"
              />
              <label htmlFor="sendToAll">All Students</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="sendToSelected"
                checked={!sendToAll}
                onChange={() => setSendToAll(false)}
                className="mr-2"
              />
              <label htmlFor="sendToSelected">Selected Students Only</label>
            </div>
          </div>
          
          {!sendToAll && (
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Select Students</label>
              {studentsLoading ? (
                <p className="text-gray-400">Loading students...</p>
              ) : allStudents.length === 0 ? (
                <p className="text-gray-400">No students available</p>
              ) : (
                <div className="max-h-64 overflow-y-auto p-2 bg-gray-700 rounded">
                  {allStudents.map(student => (
                    <div key={student._id} className="flex items-center mb-2 p-2 hover:bg-gray-600 rounded">
                      <input
                        type="checkbox"
                        id={`student-${student._id}`}
                        checked={studentIds.includes(student._id)}
                        onChange={() => toggleStudentSelection(student._id)}
                        className="mr-2"
                      />
                      <label htmlFor={`student-${student._id}`} className="flex-1">
                        <div>{student.fullname}</div>
                        <div className="text-sm text-gray-400">{student.usn} - {student.branch}</div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {!studentsLoading && studentIds.length > 0 && (
                <p className="mt-2 text-blue-400">{studentIds.length} students selected</p>
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>
    </div>
  );
}
