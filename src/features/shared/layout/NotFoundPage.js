// src/features/shared/pages/NotFoundPage.js

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-md">
      <div className="text-primary-500 text-8xl font-bold mb-md">404</div>
      <h1 className="text-3xl font-bold mb-md">Page Not Found</h1>
      <p className="text-text-secondary max-w-md mb-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/dashboard"
        className="px-lg py-md bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;