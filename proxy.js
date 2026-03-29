const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const ANTHROPIC_KEY = process.env.CLAUDE_API_KEY; // ✅ paste your key here

app.post('/claude', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('Proxy error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log('✅ Proxy server running on http://localhost:4000');
});