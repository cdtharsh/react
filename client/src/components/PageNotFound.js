import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/PageNotFound.module.css';

export default function PageNotFound() {
  return (
    <div className={`flex items-center justify-center min-h-screen bg-gray-100`}>
      <div className={styles.container}>
        <div className="text-center">
          <h1 className={styles.heading}>404</h1>
          <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-500 mb-8">
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className={styles.homeButton}>
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
