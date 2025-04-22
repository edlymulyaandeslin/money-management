// src/LoginPage.jsx
import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy login logic
    if (
      (username === 'edlymulyaandeslin' && password === '159357') ||
      (username === 'fadzil' && password === 'uya')
    ) {
      localStorage.setItem('isLoggedIn', 'true');
      onLogin();
    } else {
      alert('Username atau password salah!');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-green-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-green-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Money Management
        </h2>
        <div className="mb-4">
          <label className="block text-green-900 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-green-300 p-2 rounded focus:ring-green-300 focus:border-green-300"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-green-900 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-green-300 p-2 rounded focus:ring-green-300 focus:border-green-300"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
