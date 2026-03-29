const PROXY_URL = 'http://localhost:4000/claude';

// Helper to safely extract text
function extractText(data) {
  return data?.content?.[0]?.text || '';
}

// Helper to safely parse JSON
function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('JSON Parse Error:', e, text);
    return null;
  }
}

// ==============================
// AGENT 1: Personalize News Feed
// ==============================
async function personalizeNews(profile, articles) {
  const headlines = articles
    .map((a, i) => `${i}. "${a.title}" — ${a.description?.slice(0, 100)}`)
    .join('\n');

  const prompt = `...same prompt...`;

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    const text = extractText(data).replace(/```json|```/g, '').trim();

    const parsed = safeJSONParse(text);
    if (!parsed) throw new Error('Invalid JSON');

    return parsed;

  } catch (err) {
    console.error('Personalization error:', err);

    return articles.map((_, i) => ({
      index: i,
      relevanceScore: 80 - i * 5,
      rewrittenHeadline: articles[i].title,
      tag: i === 0 ? 'URGENT' : i < 3 ? 'TRENDING' : 'FOR-YOU'
    }));
  }
}

// ==============================
// AGENT 2: Generate Smart Briefing
// ==============================
export async function generateBriefing(article, profile) {
  const prompt = `...same prompt...`;

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    const text = extractText(data).replace(/```json|```/g, '').trim();

    const parsed = safeJSONParse(text);
    if (!parsed) throw new Error('Invalid JSON');

    return parsed;

  } catch (err) {
    console.error('Briefing error:', err);

    return {
      keyFacts: ['Could not load briefing. Please try again.'],
      whyItMatters: 'Please check your proxy server is running.',
      connectedTopics: ['Error'],
      followUpQuestions: ['Is the proxy server running on port 4000?'],
      summary: 'Error generating briefing. Ensure proxy is running.'
    };
  }
}

// ==============================
// AGENT 3: Answer Follow-up Q&A
// ==============================
export async function askFollowUp(question, article, chatHistory) {
  const systemContext = `...same prompt...`;

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4',
        max_tokens: 1000,
        system: systemContext,
        messages: [...chatHistory, { role: 'user', content: question }]
      })
    });

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    return extractText(data) || 'No response received.';

  } catch (err) {
    console.error('Q&A error:', err);
    return 'Sorry, could not get an answer. Check proxy server.';
  }
}

export default personalizeNews;