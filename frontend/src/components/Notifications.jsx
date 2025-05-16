// Notifications component

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
export function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('tpToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/tp/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('tpToken');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('tpToken');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put(`http://localhost:8000/tp/notifications/${notificationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the notification in the state
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-3xl font-bold mb-4">Notifications</h2>
        <div className="text-gray-400">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Notifications</h2>
      
      {notifications.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-800 border-gray-700' : 'bg-gray-800 border-blue-600'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg">{notification.message}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

