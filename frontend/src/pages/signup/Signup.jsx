import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar2 from '../../components/Navbar2';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [nameError, setNameError] = useState(false); // Track if the username exceeds the limit

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert('All fields are required');
      return;
    }

    if (name.length > 13) {
      setNameError(true); // Show error if name exceeds 13 characters
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      if (response.data.message === 'User registered successfully') {
        setSuccessModal(true); // Trigger success modal
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorModal(true); // Trigger error modal
      } else {
        alert('Something went wrong, please try again later');
      }
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="pt-2">
        <motion.div
          className="font-[sans-serif] bg-white max-w-4xl flex items-center mx-auto md:-screen p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="grid md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
            <div className="max-md:order-1 flex flex-col justify-center space-y-16 max-md:mt-16 min-h-full bg-gradient-to-r from-purple-600 to-blue-600 lg:px-8 px-4 py-4">
              <div>
                <h4 className="text-white text-lg font-semibold">Create Your Account</h4>
                <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">
                  Welcome to our registration page! Get started by creating your account.
                </p>
              </div>
            </div>

            <motion.form
              className="md:col-span-2 w-full py-6 px-6 sm:px-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              onSubmit={handleSubmit}
            >
              <div className="mb-6">
                <h3 className="text-gray-800 text-2xl font-bold">Create an account</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.length > 13) {
                        setNameError(true); // Show error if name exceeds 13 characters
                      } else {
                        setNameError(false); // Remove error if name is within limit
                      }
                    }}
                    required
                    className={`text-gray-800 bg-white border w-full text-sm px-4 py-2.5 rounded-md outline-blue-500 ${
                      nameError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter name"
                  />
                  {nameError && <p className="text-red-500 text-sm">Username must be 13 characters or less</p>}
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 tracking-wider text-sm rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none mt-6"
              >
                Create an account
              </button>
              <p className="text-gray-800 text-sm mt-6 text-center">
                Already have an account?{' '}
                <a href="/" className="text-blue-600 font-semibold hover:underline ml-1">
                  Login here
                </a>
              </p>
            </motion.form>
          </div>
        </motion.div>

        {/* Error Modal */}
        <AnimatePresence>
          {errorModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-11/12 max-w-md scale-100 transform rounded-lg bg-white p-6 shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-4 text-lg font-semibold text-blue-700">User Already Exists</h2>
                <p className="text-gray-600">
                  This user is already registered. Please use a different email or username.
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                    onClick={() => setErrorModal(false)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {successModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-11/12 max-w-md scale-100 transform rounded-lg bg-white p-6 shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="mb-4 text-center text-lg font-semibold text-blue-700">
                  Sign Up Successful
                </h2>
                <p className="text-center text-gray-600">
                  Congratulations! Your account has been successfully created. You can now log in and and use Inotes App.
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                    onClick={() => setSuccessModal(false)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Signup;
