import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function NotFound() {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] text-center px-4">
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        to={user?.role === 'parent' ? '/parent' : user?.role === 'specialist' ? '/specialist' : '/child'}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

