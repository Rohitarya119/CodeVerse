const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const JUDGE0_URL = 'https://ce.judge0.com';
// Map frontend language → Judge0 language_id
// You can confirm IDs via GET /languages on Judge0
const LANGUAGE_ID = {
  javascript: 63, // Node.js 18
  python: 71,     // Python 3.8+
  java: 62,       // Java (OpenJDK)
  cpp: 54         // C++ (GCC)
};

app.post('/api/execute', async (req, res) => {
  try {
    const { code, language, stdin } = req.body || {};
    const language_id = LANGUAGE_ID[language];
    if (!code || !language_id) {
      return res.status(400).json({ message: 'code and supported language are required' });
    }

    const { data } = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id,
        stdin: stdin || '',
        redirect_stderr_to_stdout: false
      },
      { timeout: 30000 }
    );

    // Normalize for your frontend
    return res.json({
      stdout: data.stdout || '',
      stderr: data.stderr || (data.compile_output || ''),
      status: data.status?.description || '',
      time: data.time,
      memory: data.memory
    });
  } catch (err) {
    return res.status(500).json({ message: err?.response?.data || err.message });
  }
});

// Quick health check to verify Judge0 connectivity
app.get('/api/health', async (req, res) => {
  try {
    const { data } = await axios.get(`${JUDGE0_URL}/languages`, { timeout: 5000 });
    res.json({ ok: true, judge0Languages: Array.isArray(data) ? data.length : 0 });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

// List languages from Judge0 (useful for mapping/diagnostics)
app.get('/api/languages', async (req, res) => {
  try {
    const { data } = await axios.get(`${JUDGE0_URL}/languages`, { timeout: 5000 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e?.message || String(e) });
  }
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));