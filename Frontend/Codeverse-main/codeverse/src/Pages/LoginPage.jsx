// components/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCode, FaGithub, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css';
import axios from 'axios';
import { config } from '../config';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [githubLoginHint, setGithubLoginHint] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setErrors({ submit: 'Please enter username and password' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${config.API_BASE}/auth/login`, {
        username: formData.username,
        password: formData.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
      }
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Invalid username or password' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <FaCode className="logo-icon" />
              <h1>CodeVerse</h1>
            </div>
            <h2>Welcome Back!</h2>
            <p>Continue your coding journey</p>
          </div>

          {errors.submit && (
            <div className="error-alert">{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username or Email</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username or email"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Replaced the previous divider + social-buttons with the provided styled buttons */}
            <div style={{ margin: '20px 0', textAlign: 'center' }}>
              <p>— OR —</p>
            </div>

            <button 
              type="button"
              onClick={() => window.location.href = `${config.BACKEND_BASE}/api/auth/oauth2/google`}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#4285f4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Continue with Google
            </button>

            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label>GitHub username (optional)</label>
              <input
                type="text"
                name="githubLoginHint"
                value={githubLoginHint}
                onChange={(e) => setGithubLoginHint(e.target.value)}
                placeholder="Use/switch to this GitHub account"
                autoComplete="off"
              />
            </div>

            <button 
              type="button"
              onClick={() => {
                const base = `${config.BACKEND_BASE}/api/auth/oauth2/github`;
                const url = githubLoginHint && githubLoginHint.trim().length > 0
                  ? `${base}?login=${encodeURIComponent(githubLoginHint.trim())}`
                  : base;
                window.location.href = url;
              }}
              style={{ width: '100%', padding: '10px', backgroundColor: '#24292e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Continue with GitHub
            </button>

            <div className="signup-link">
              New to CodeVerse? <Link to="/register">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;