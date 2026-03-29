import React, { useState } from 'react';

const roles = ['Investor', 'Startup Founder', 'Student', 'Professional'];
const sectors = ['Tech', 'Finance', 'Markets', 'Startups', 'Policy', 'Global'];
const depths = ['Quick Bites', 'Full Briefings'];

function Profiling({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    role: '',
    interests: [],
    depth: ''
  });

  const toggleInterest = (s) => {
    const updated = profile.interests.includes(s)
      ? profile.interests.filter(x => x !== s)
      : [...profile.interests, s];

    setProfile(prev => ({ ...prev, interests: updated }));
  };

  return (
    <div className="profiling-wrapper">
      <h1 className="profiling-title">📰 The Living Newspaper</h1>
      <p className="profiling-subtitle">
        Business news that knows who you are
      </p>

      {/* Step 0: Role */}
      {step === 0 && (
        <>
          <p className="profiling-question">Who are you?</p>
          {roles.map(r => (
            <button
              key={r}
              className={`option-btn ${profile.role === r ? 'selected' : ''}`}
              onClick={() => {
                setProfile(prev => ({ ...prev, role: r }));
                setStep(1);
              }}
            >
              {r}
            </button>
          ))}
        </>
      )}

      {/* Step 1: Interests */}
      {step === 1 && (
        <>
          <p className="profiling-question">
            What interests you? (pick all that apply)
          </p>

          {sectors.map(s => (
            <button
              key={s}
              className={`option-btn ${
                profile.interests.includes(s) ? 'selected' : ''
              }`}
              onClick={() => toggleInterest(s)}
            >
              {s}
            </button>
          ))}

          <br />

          <button
            className="next-btn"
            onClick={() => {
              if (profile.interests.length === 0) {
                alert('Please select at least one interest!');
                return;
              }
              setStep(2);
            }}
          >
            Next →
          </button>
        </>
      )}

      {/* Step 2: Depth */}
      {step === 2 && (
        <>
          <p className="profiling-question">
            How deep do you want your news?
          </p>

          {depths.map(d => (
            <button
              key={d}
              className={`option-btn ${profile.depth === d ? 'selected' : ''}`}
              onClick={() => {
                const finalProfile = { ...profile, depth: d };
                setProfile(finalProfile);
                onComplete(finalProfile);
              }}
            >
              {d}
            </button>
          ))}
        </>
      )}

      {/* Progress dots */}
      <div className="progress-dots">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`dot ${step === i ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Profiling;