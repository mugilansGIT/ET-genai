import React, { useState, useEffect } from 'react';
import Profiling from './Profiling';
import Newsroom from './Newsroom';
import './index.css';

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const sf = document.createElement('div');
    sf.className = 'starfield';
    sf.id = 'starfield';
    document.body.appendChild(sf);

    for (let i = 0; i < 80; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const size = Math.random() * 2 + 0.5;
      s.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        --dur:${2+Math.random()*4}s;
        animation-delay:${Math.random()*4}s;
      `;
      sf.appendChild(s);
    }

    const colors = ['#FFD700','#c0b0ff','#60cc90','#ffa040'];

    const interval = setInterval(() => {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left:${Math.random()*100}%;
        bottom:0;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        --dur:${3+Math.random()*4}s;
      `;
      document.body.appendChild(p);

      const timeout = setTimeout(() => p.remove(), 7000);

      // Cleanup timeout if needed
      return () => clearTimeout(timeout);
    }, 800);

    return () => {
      clearInterval(interval);
      if (sf && sf.parentNode) {
        sf.parentNode.removeChild(sf);
      }
    };
  }, []);

  if (!profile) {
    return <Profiling onComplete={setProfile} />;
  }

  return <Newsroom profile={profile} />;
}

export default App;