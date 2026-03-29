import { useState, useEffect } from 'react';

function useNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // ✅ Free API, no CORS issues, works on localhost
    fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/in.json')
      .then(res => res.json())
      .then(data => {
        // filter out articles with no title or description
        const valid = data.articles.filter(
          a => a.title && a.description && a.title !== '[Removed]'
        );
        setNews(valid.slice(0, 12));
      })
      .catch(err => {
        console.error('News fetch error:', err);
        // ✅ Fallback demo data if API fails
        setNews([
          {
            title: 'RBI Holds Interest Rates Steady at 6.5%',
            description: 'The Reserve Bank of India kept benchmark interest rates unchanged for the sixth consecutive meeting, signaling caution amid global uncertainty.',
            url: '#', source: { name: 'Economic Times' }
          },
          {
            title: 'Tata Motors Reports Record Q4 Profits',
            description: 'Tata Motors posted its highest-ever quarterly profit driven by strong Jaguar Land Rover sales and growing EV demand in domestic markets.',
            url: '#', source: { name: 'Business Standard' }
          },
          {
            title: 'Reliance Jio Launches AI-Powered 6G Trials',
            description: 'Jio has begun testing next-generation 6G technology in partnership with global telecom firms, targeting commercial launch by 2028.',
            url: '#', source: { name: 'Mint' }
          },
          {
            title: 'Indian Startup Ecosystem Raises $3B in Q1 2026',
            description: 'Indian startups attracted over $3 billion in funding in the first quarter of 2026, with fintech and AI sectors leading the charge.',
            url: '#', source: { name: 'Inc42' }
          },
          {
            title: 'Sensex Crosses 80,000 Mark for First Time',
            description: 'The BSE Sensex breached the historic 80,000 level on strong foreign institutional investor inflows and positive global cues.',
            url: '#', source: { name: 'Economic Times' }
          },
          {
            title: 'Budget 2026: Major Tax Relief for Middle Class',
            description: 'The Union Budget announced significant income tax relief for individuals earning up to Rs 15 lakh annually under the new tax regime.',
            url: '#', source: { name: 'NDTV Profit' }
          }
        ]);
      });
  }, []);

  return news;
}

export default useNews;