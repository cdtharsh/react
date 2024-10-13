// src/components/Login.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import { Toaster, toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';
import Layout from './Layout';

export default function Login() {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsername(values.username);

      // Sending the data to the API for login
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: values.username, password: values.password }),
        });

        if (response.ok) {
          const responseData = await response.json();
          localStorage.setItem('token', responseData.token); // Store the token
          localStorage.setItem('loginTime', responseData.loginTime); // Store the login time
          localStorage.setItem('username', responseData.username); // Store the username

          navigate('/'); // Redirect to the profile page
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to login.');
        }
      } catch (error) {
        toast.error('An error occurred while logging in.');
      }
    },
  });

  return (
    <Layout>
      <div className={`${styles['login-background']} min-h-screen flex items-center justify-center`}>
        <Toaster position="top-center" reverseOrder={false}></Toaster>
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold text-gray-800">Hello!!!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps('username')}
                className={styles.textbox}
                type="text"
                placeholder="Username"
              />
              <input
                {...formik.getFieldProps('password')}
                className={styles.textbox}
                type="password"
                placeholder="Password"
              />
              <button className={styles.btn} type="submit">
                Let's Go
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a Member? <Link className="text-red-500" to="/register">Register Now</Link>
              </span>
            </div>

            <div className="text-center py-2">
              <span className="text-gray-500">
                Forgot your password? <Link className="text-red-500" to="/recovery">Recover Now</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
