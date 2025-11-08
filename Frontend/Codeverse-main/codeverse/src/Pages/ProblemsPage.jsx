// components/ProblemsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCode, FaSearch, FaFilter, FaChartBar, FaCheckCircle, FaClock } from 'react-icons/fa';
import { getProblems } from '../service/problemApi';
import './ProblemsPage.css';

const ProblemsPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [topicFilter, setTopicFilter] = useState('all');

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        solved: 0
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchProblems();
    }, []);

    useEffect(() => {
        filterProblems();
        calculateStats();
    }, [problems, searchTerm, difficultyFilter, statusFilter, topicFilter]);

    const fetchProblems = async () => {
        setLoading(true);
        try {
            const response = await getProblems();
            // Adding mock data to existing problems for demonstration
            const enhancedProblems = response.data.map((problem, index) => ({
                ...problem,
                acceptance: `${(Math.random() * 50 + 30).toFixed(1)}%`,
                status: index % 3 === 0 ? 'solved' : index % 5 === 0 ? 'attempted' : null,
                topic: ['Arrays', 'Strings', 'Dynamic Programming', 'Trees', 'Graphs'][index % 5],
                submissions: Math.floor(Math.random() * 100000) + 10000
            }));
            setProblems(enhancedProblems);
            setFilteredProblems(enhancedProblems);
        } catch (err) {
            console.error("Failed to fetch problems:", err);
            setError('Failed to load problems. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filterProblems = () => {
        let filtered = [...problems];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(problem =>
                problem.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Difficulty filter
        if (difficultyFilter !== 'all') {
            filtered = filtered.filter(problem =>
                problem.difficulty?.toLowerCase() === difficultyFilter
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(problem => {
                if (statusFilter === 'solved') return problem.status === 'solved';
                if (statusFilter === 'attempted') return problem.status === 'attempted';
                if (statusFilter === 'todo') return !problem.status;
                return true;
            });
        }

        // Topic filter
        if (topicFilter !== 'all') {
            filtered = filtered.filter(problem =>
                problem.topic === topicFilter
            );
        }

        setFilteredProblems(filtered);
    };

    const calculateStats = () => {
        const total = problems.length;
        const easy = problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
        const medium = problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
        const hard = problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;
        const solved = problems.filter(p => p.status === 'solved').length;
        
        setStats({ total, easy, medium, hard, solved });
    };

    const topics = ['all', 'Arrays', 'Strings', 'Dynamic Programming', 'Trees', 'Graphs'];

    return (
        <div className="problems-page-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="nav-left">
                    <div className="logo" onClick={() => navigate('/')}>
                        <FaCode className="logo-icon" />
                        <span>CodeVerse</span>
                    </div>
                    <div className="nav-links">
                        <Link to="/problems" className="active">Problems</Link>
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

            {/* Header Section */}
            <section className="problems-hero">
                <div className="problems-hero-content">
                    <h1>Problem Set</h1>
                    <p>Practice makes perfect. Solve problems to improve your skills</p>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="problems-stats">
                <div className="stats-grid">
                    <div className="stat-item">
                        <FaChartBar className="stat-icon" />
                        <div>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Problems</div>
                        </div>
                    </div>
                    <div className="stat-item solved">
                        <FaCheckCircle className="stat-icon" />
                        <div>
                            <div className="stat-value">{stats.solved}</div>
                            <div className="stat-label">Solved</div>
                        </div>
                    </div>
                    <div className="stat-item easy">
                        <div className="stat-value">{stats.easy}</div>
                        <div className="stat-label">Easy</div>
                    </div>
                    <div className="stat-item medium">
                        <div className="stat-value">{stats.medium}</div>
                        <div className="stat-label">Medium</div>
                    </div>
                    <div className="stat-item hard">
                        <div className="stat-value">{stats.hard}</div>
                        <div className="stat-label">Hard</div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="filters-section">
                <div className="filters-container">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <select 
                            value={difficultyFilter} 
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="solved">Solved</option>
                            <option value="attempted">Attempted</option>
                            <option value="todo">To Do</option>
                        </select>

                        <select 
                            value={topicFilter} 
                            onChange={(e) => setTopicFilter(e.target.value)}
                            className="filter-select"
                        >
                            {topics.map(topic => (
                                <option key={topic} value={topic}>
                                    {topic === 'all' ? 'All Topics' : topic}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Error Alert */}
            {error && (
                <div className="error-alert" role="alert">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Problems Table */}
            <section className="problems-table-section">
                <div className="table-container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading problems...</p>
                        </div>
                    ) : (
                        <table className="problems-table">
                            <thead>
                                <tr>
                                    <th className="th-status">Status</th>
                                    <th className="th-title">Title</th>
                                    <th className="th-topic">Topic</th>
                                    <th className="th-acceptance">Acceptance</th>
                                    <th className="th-difficulty">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProblems.map((problem) => (
                                    <tr key={problem.id} className="problem-row">
                                        <td className="td-status">
                                            {problem.status === 'solved' && 
                                                <span className="status-icon solved">✓</span>
                                            }
                                            {problem.status === 'attempted' && 
                                                <span className="status-icon attempted">○</span>
                                            }
                                        </td>
                                        <td className="td-title">
                                            <Link to={`/problems/${problem.id}`} className="problem-link">
                                                {problem.id}. {problem.title}
                                            </Link>
                                        </td>
                                        <td className="td-topic">
                                            <span className="topic-tag">{problem.topic}</span>
                                        </td>
                                        <td className="td-acceptance">{problem.acceptance}</td>
                                        <td className="td-difficulty">
                                            <span className={`difficulty-badge ${String(problem.difficulty || '').toLowerCase()}`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProblems.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="empty-state">
                                            <div className="empty-content">
                                                <FaSearch size={48} />
                                                <p>No problems found</p>
                                                <small>Try adjusting your filters</small>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {filteredProblems.length > 0 && (
                    <div className="pagination">
                        <button className="page-btn">← Previous</button>
                        <div className="page-numbers">
                            <button className="page-num active">1</button>
                            <button className="page-num">2</button>
                            <button className="page-num">3</button>
                            <span>...</span>
                            <button className="page-num">10</button>
                        </div>
                        <button className="page-btn">Next →</button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProblemsPage;