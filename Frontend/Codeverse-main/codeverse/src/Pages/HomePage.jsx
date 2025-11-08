// components/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCode, FaBrain, FaTrophy, FaChartLine, FaRobot, FaBook, FaUsers, FaClock } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      // Fetch user stats
      fetchUserStats();
    }
  }, []);

  const fetchUserStats = async () => {
    // Fetch stats from backend
    // For now using mock data
    setStats({
      totalSolved: 42,
      easySolved: 25,
      mediumSolved: 15,
      hardSolved: 2
    });
  };

  const problems = [
    { id: 1, title: "Two Sum", difficulty: "Easy", acceptance: "47.3%", status: "solved" },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", acceptance: "35.4%", status: "attempted" },
    { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", acceptance: "33.8%", status: null },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "35.4%", status: null },
    { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", acceptance: "32.4%", status: "solved" },
  ];

  const topics = [
    { name: "Arrays", count: 150, icon: "📊" },
    { name: "Strings", count: 120, icon: "📝" },
    { name: "Dynamic Programming", count: 200, icon: "🎯" },
    { name: "Trees", count: 140, icon: "🌳" },
    { name: "Graphs", count: 110, icon: "🔗" },
    { name: "Sorting", count: 80, icon: "📈" }
  ];

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <FaCode className="logo-icon" />
            <span>CodeVerse</span>
          </div>
          <div className="nav-links">
            <Link to="/problems">Problems</Link>
            <Link to="/contests">Contests</Link>
            <Link to="/discuss">Discuss</Link>
            <Link to="/learn">Learn</Link>
          </div>
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <span className="username">{user.username}</span>
              </div>
              <button className="btn-logout" onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Sign In</Link>
              <Link to="/register" className="btn-register">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Master Data Structures & Algorithms</h1>
          <p>Practice coding problems, prepare for interviews, and enhance your skills with AI-powered learning</p>
          <div className="hero-buttons">
            {user ? (
              <button className="btn-primary" onClick={() => navigate('/problems')}>
                Continue Practicing
              </button>
            ) : (
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Get Started Free
              </button>
            )}
            <button className="btn-secondary">
              <FaRobot /> Try AI Assistant
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {user && (
        <section className="stats-section">
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-number">{stats.totalSolved}</div>
              <div className="stat-label">Problems Solved</div>
            </div>
            <div className="stat-card easy">
              <div className="stat-number">{stats.easySolved}</div>
              <div className="stat-label">Easy</div>
            </div>
            <div className="stat-card medium">
              <div className="stat-number">{stats.mediumSolved}</div>
              <div className="stat-label">Medium</div>
            </div>
            <div className="stat-card hard">
              <div className="stat-number">{stats.hardSolved}</div>
              <div className="stat-label">Hard</div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose CodeVerse?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaBrain className="feature-icon" />
            <h3>AI-Powered Hints</h3>
            <p>Get intelligent hints and explanations powered by advanced AI</p>
          </div>
          <div className="feature-card">
            <FaTrophy className="feature-icon" />
            <h3>Weekly Contests</h3>
            <p>Compete with developers worldwide in timed challenges</p>
          </div>
          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3>Progress Tracking</h3>
            <p>Monitor your improvement with detailed analytics</p>
          </div>
          <div className="feature-card">
            <FaBook className="feature-icon" />
            <h3>Learning Paths</h3>
            <p>Structured courses for systematic learning</p>
          </div>
        </div>
      </section>

      {/* Problem List Preview */}
      <section className="problems-preview">
        <div className="section-header">
          <h2>Popular Problems</h2>
          <Link to="/problems">View All →</Link>
        </div>
        <div className="problems-table">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {problems.map(problem => (
                <tr key={problem.id}>
                  <td>
                    {problem.status === 'solved' && <span className="status-icon solved">✓</span>}
                    {problem.status === 'attempted' && <span className="status-icon attempted">○</span>}
                  </td>
                  <td className="problem-title">
                    <Link to={`/problems/${problem.id}`}>{problem.title}</Link>
                  </td>
                  <td>
                    <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>{problem.acceptance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Topics Section */}
      <section className="topics-section">
        <h2>Explore Topics</h2>
        <div className="topics-grid">
          {topics.map(topic => (
            <div key={topic.name} className="topic-card">
              <span className="topic-icon">{topic.icon}</span>
              <div className="topic-info">
                <h4>{topic.name}</h4>
                <span>{topic.count} problems</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;