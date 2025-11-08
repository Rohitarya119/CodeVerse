// components/ProblemDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaCode, FaPlay, FaCheckCircle, FaLightbulb, FaBookmark, 
  FaThumbsUp, FaThumbsDown, FaClock, FaChartBar, FaArrowLeft,
  FaExpand, FaCompress, FaCopy, FaRedo
} from 'react-icons/fa';
import { getProblemById, executeCode } from '../service/problemApi';
import './ProblemDetailPage.css';

const ProblemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [activeTestTab, setActiveTestTab] = useState('testcase');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('light');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock problem data
  const [problem, setProblem] = useState({
    id: id,
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptance: '49.5%',
    description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.

You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: null
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        explanation: null
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
      'So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x.',
      'Can we change our array somehow so that this search becomes faster?',
      'The second train of thought is, without changing the array, can we use additional space somehow?'
    ],
    topics: ['Array', 'Hash Table'],
    similarQuestions: ['3Sum', '4Sum', 'Two Sum II'],
    submissions: 6234567,
    accepted: 3084321,
    likes: 45678,
    dislikes: 1234
  });

  const starterCode = {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    // Load starter code based on selected language
    setCode(starterCode[selectedLanguage]);
    // Set default test input
    setTestInput('[2,7,11,15]\n9');
  }, [selectedLanguage]);

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTestTab('result');
    try {
      const payload = {
        code,
        language: selectedLanguage,
        stdin: testInput
      };
      const response = await executeCode(payload);
      const data = response?.data ?? {};
      const stdout = data.output || data.stdout || '';
      const stderr = data.error || data.stderr || '';
      const combined = [
        stderr ? `Errors:\n${stderr}` : null,
        stdout ? `Output:\n${stdout}` : null
      ].filter(Boolean).join('\n\n');
      setTestOutput(combined || 'No output');
    } catch (err) {
      setTestOutput(`Execution failed: ${err?.response?.data?.message || err?.message || String(err)}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to submission result or show modal
      alert('Solution submitted successfully!');
    }, 2000);
  };

  const handleReset = () => {
    setCode(starterCode[selectedLanguage]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    // Show toast notification
  };

  return (
    <div className={`problem-detail-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="back-btn" onClick={() => navigate('/problems')}>
            <FaArrowLeft /> Problems
          </button>
          <div className="nav-links">
            <Link to="/problems">Problem List</Link>
            <Link to="/submissions">Submissions</Link>
            <Link to="/discuss">Discuss</Link>
            <Link to="/solution">Solutions</Link>
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

      {/* Main Content */}
      <div className="problem-content">
        {/* Left Panel - Problem Description */}
        <div className="left-panel">
          <div className="problem-header">
            <h1>{id}. {problem.title}</h1>
            <div className="problem-actions">
              <button 
                className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <FaBookmark />
              </button>
            </div>
          </div>

          <div className="problem-meta">
            <span className={`difficulty-tag ${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            <span className="meta-item">
              <FaCheckCircle /> {problem.acceptance} Acceptance
            </span>
            <span className="meta-item">
              <FaChartBar /> {(problem.submissions / 1000000).toFixed(1)}M Submissions
            </span>
          </div>

          <div className="problem-tabs">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'solutions' ? 'active' : ''}`}
              onClick={() => setActiveTab('solutions')}
            >
              Solutions
            </button>
            <button 
              className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
            >
              Submissions
            </button>
            <button 
              className={`tab-btn ${activeTab === 'discuss' ? 'active' : ''}`}
              onClick={() => setActiveTab('discuss')}
            >
              Discuss
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <div className="problem-description" 
                     dangerouslySetInnerHTML={{ __html: problem.description }}>
                </div>

                <div className="examples-section">
                  <h3>Examples:</h3>
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="example-box">
                      <div className="example-header">Example {idx + 1}:</div>
                      <div className="example-content">
                        <div className="example-line">
                          <strong>Input:</strong> <code>{example.input}</code>
                        </div>
                        <div className="example-line">
                          <strong>Output:</strong> <code>{example.output}</code>
                        </div>
                        {example.explanation && (
                          <div className="example-line">
                            <strong>Explanation:</strong> {example.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="constraints-section">
                  <h3>Constraints:</h3>
                  <ul>
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx}><code>{constraint}</code></li>
                    ))}
                  </ul>
                </div>

                <div className="hints-section">
                  <div 
                    className="hints-header"
                    onClick={() => setShowHints(!showHints)}
                  >
                    <FaLightbulb /> Hints
                    <span className="hint-count">({problem.hints.length})</span>
                  </div>
                  {showHints && (
                    <div className="hints-content">
                      <div className="hint-box">
                        <div className="hint-nav">
                          <button 
                            disabled={currentHint === 0}
                            onClick={() => setCurrentHint(currentHint - 1)}
                          >
                            Previous
                          </button>
                          <span>Hint {currentHint + 1} of {problem.hints.length}</span>
                          <button 
                            disabled={currentHint === problem.hints.length - 1}
                            onClick={() => setCurrentHint(currentHint + 1)}
                          >
                            Next
                          </button>
                        </div>
                        <p>{problem.hints[currentHint]}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="topics-section">
                  <h3>Related Topics:</h3>
                  <div className="topic-tags">
                    {problem.topics.map(topic => (
                      <span key={topic} className="topic-tag">{topic}</span>
                    ))}
                  </div>
                </div>

                <div className="similar-section">
                  <h3>Similar Questions:</h3>
                  <div className="similar-links">
                    {problem.similarQuestions.map(q => (
                      <Link key={q} to="#" className="similar-link">{q}</Link>
                    ))}
                  </div>
                </div>

                <div className="problem-stats">
                  <button className="stat-btn">
                    <FaThumbsUp /> {(problem.likes / 1000).toFixed(1)}K
                  </button>
                  <button className="stat-btn">
                    <FaThumbsDown /> {(problem.dislikes / 1000).toFixed(1)}K
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'solutions' && (
              <div className="solutions-content">
                <p>Solutions will be shown here after submission...</p>
              </div>
            )}
            
            {activeTab === 'submissions' && (
              <div className="submissions-content">
                <p>Your previous submissions will appear here...</p>
              </div>
            )}
            
            {activeTab === 'discuss' && (
              <div className="discuss-content">
                <p>Community discussions...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="right-panel">
          <div className="editor-header">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            
            <div className="editor-actions">
              <button onClick={handleReset} className="editor-btn" title="Reset Code">
                <FaRedo />
              </button>
              <button onClick={copyCode} className="editor-btn" title="Copy Code">
                <FaCopy />
              </button>
              <select 
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="font-size-select"
              >
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
              </select>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="editor-btn"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>

          <div className="code-editor">
            <div className="editor-lines">
              {code.split('\n').map((_, idx) => (
                <div key={idx} className="line-number">{idx + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="code-textarea"
              style={{ fontSize: `${fontSize}px` }}
              spellCheck="false"
            />
          </div>

          <div className="test-section">
            <div className="test-tabs">
              <button 
                className={`test-tab ${activeTestTab === 'testcase' ? 'active' : ''}`}
                onClick={() => setActiveTestTab('testcase')}
              >
                Test Case
              </button>
              <button 
                className={`test-tab ${activeTestTab === 'result' ? 'active' : ''}`}
                onClick={() => setActiveTestTab('result')}
              >
                Test Result
              </button>
            </div>

            <div className="test-content">
              {activeTestTab === 'testcase' && (
                <div className="testcase-input">
                  <label>Input:</label>
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Enter test input..."
                    rows="3"
                  />
                </div>
              )}
              
              {activeTestTab === 'result' && (
                <div className="test-result">
                  {testOutput ? (
                    <pre>{testOutput}</pre>
                  ) : (
                    <p className="no-result">Run your code to see results</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-run"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? (
                <>Running...</>
              ) : (
                <><FaPlay /> Run</>
              )}
            </button>
            <button 
              className="btn-submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>Submit</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;