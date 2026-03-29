import React, { useState, useEffect } from 'react';
import useNews from './useNews';
import personalizeNews, { generateBriefing, askFollowUp } from './claudeAgent';

// 🎥 Map videos based on article
const getVideoForArticle = (article) => {
  const title = article.title?.toLowerCase() || '';

  if (title.includes('market') || title.includes('stock'))
    return '/videos/market.mp4';

  if (title.includes('tech') || title.includes('ai'))
    return '/videos/tech.mp4';

  if (title.includes('startup'))
    return '/videos/startup.mp4';

  return '/videos/market.mp4';
};

function Newsroom({ profile }) {
  const rawNews = useNews();

  const [rankedNews, setRankedNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatAnswer, setChatAnswer] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!rawNews || rawNews.length === 0) return;

    setLoadingNews(true);

    personalizeNews(profile, rawNews)
      .then(ranked => {
        const merged = ranked.map(r => ({
          ...rawNews[r.index],
          ...r
        }));
        setRankedNews(merged);
        setLoadingNews(false);
      })
      .catch(() => {
        setRankedNews(rawNews.map((a, i) => ({
          ...a,
          index: i,
          relevanceScore: 80,
          rewrittenHeadline: a.title,
          tag: 'FOR-YOU'
        })));
        setLoadingNews(false);
      });

  }, [rawNews, profile]);

  const handleArticleClick = async (article) => {
    setSelectedArticle(article);
    setBriefing(null);
    setChatHistory([]);
    setChatAnswer('');
    setUserQuestion('');
    setLoadingBriefing(true);

    const result = await generateBriefing(article, profile);
    setBriefing(result);

    setLoadingBriefing(false);
  };

  const handleQuestion = async (q) => {
    if (!q.trim() || !selectedArticle) return;

    setChatLoading(true);
    setChatAnswer('');

    const answer = await askFollowUp(q, selectedArticle, chatHistory);

    setChatAnswer(answer);
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: q },
      { role: 'assistant', content: answer }
    ]);

    setUserQuestion('');
    setChatLoading(false);
  };

  return (
    <div>

      {/* Ticker */}
      <div className="ticker-bar">
        <span className="ticker-text">
          📈 SENSEX +1.2% &nbsp;&nbsp;&nbsp;
          💰 RBI HOLDS RATES AT 6.5% &nbsp;&nbsp;&nbsp;
          🚀 TATA MOTORS Q4 RECORD PROFIT &nbsp;&nbsp;&nbsp;
        </span>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 42px)' }}>

        {/* LEFT PANEL */}
        <div className="left-panel">

          <div className="masthead">
            <div className="masthead-title">THE LIVING NEWSPAPER</div>
            <div className="masthead-sub">AI PERSONALIZED EDITION</div>
          </div>

          {loadingNews && (
            <p className="loading-text">✦ Personalizing your news... ✦</p>
          )}

          {rankedNews.map((article, i) => (
            <div
              key={i}
              className={`news-card ${
                selectedArticle?.title === article.title ? 'active' : ''
              }`}
              onClick={() => handleArticleClick(article)}
            >

              {/* 🎥 MOVING COVER */}
              <div className="news-media">
                <video
                  className="news-video"
                  src={getVideoForArticle(article)}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>

              <span className={`card-tag tag-${article.tag}`}>
                {article.tag}
              </span>

              <h3 className="card-title">
                {article.rewrittenHeadline}
              </h3>

              <p className="card-desc">
                {article.description?.slice(0, 100)}...
              </p>

            </div>
          ))}

        </div>

        {/* RIGHT PANEL */}
        <div className="briefing-panel">

          {!selectedArticle && <p>👈 Click a story</p>}

          {loadingBriefing && <p>Generating briefing...</p>}

          {briefing && (
            <>
              <h2>{selectedArticle.title}</h2>

              <div className="summary-box">
                {briefing.summary}
              </div>

              {(briefing.keyFacts || []).map((f, i) => (
                <div key={i} className="fact-item">{f}</div>
              ))}

              <textarea
                className="qa-input"
                value={userQuestion}
                onChange={e => setUserQuestion(e.target.value)}
              />

              <button
                className="qa-button"
                onClick={() => handleQuestion(userQuestion)}
              >
                Ask
              </button>

              {chatAnswer && (
                <div className="chat-answer">{chatAnswer}</div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default Newsroom;