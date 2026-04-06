import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: '📢', name: 'Event Aggregator',   desc: 'All college events in one feed — no more scattered WhatsApp announcements.' },
    { icon: '✅', name: 'Approval Workflow',   desc: 'Club events go through management review before reaching students.' },
    { icon: '🔔', name: 'Smart Reminders',     desc: '15-min event alerts + 1-week and 3-day exam notifications automatically.' },
    { icon: '📅', name: 'Live Timetable',      desc: 'Branch and semester-specific timetables always up to date.' },
    { icon: '📚', name: 'Syllabus Access',     desc: 'Download subject-wise PDFs anytime from any device.' },
    { icon: '🔒', name: 'College Emails Only', desc: 'Domain-validated signup ensures only real students get access.' },
  ];

  return (
    <div className="landing-page">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-logo">College<span>Hub</span></div>
        <div className="topbar-spacer" />
        <div className="topbar-right">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login/student')}>Student login</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/login/admin')}>Admin login</button>
        </div>
      </div>

      {/* Hero */}
      <div className="landing-hero">
        <div className="landing-badge">✦ Version 2.0 — Web Platform</div>
        <h1 className="landing-h1">
          Your college,<br />
          <em>all in one place</em>
        </h1>
        <p className="landing-p">
          CollegeHub replaces scattered WhatsApp groups and Instagram posts with a single, organised, role-aware platform for events, academics and notifications.
        </p>

        <div className="landing-btns">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login/student')}>
            Student login →
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login/admin')}>
            Admin / Club login
          </button>

          {/* 🔥 ADDED BUTTON */}
          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => navigate('/clubs')}
          >
            View Clubs →
          </button>
        </div>

        <div className="landing-stats">
          <div className="landing-stat">
            <div className="landing-stat-num">24</div>
            <div className="landing-stat-lbl">Events live</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-num">8</div>
            <div className="landing-stat-lbl">Active clubs</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-num">1.2k</div>
            <div className="landing-stat-lbl">Students</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-num">100%</div>
            <div className="landing-stat-lbl">Free</div>
          </div>
        </div>
      </div>

      {/* Role Cards */}
      <div className="role-cards-section">
        <h2 className="role-cards-title">Three roles, one platform</h2>

        <div className="role-cards">

          <div className="role-card" onClick={() => navigate('/login/admin')}>
            <div className="role-card-icon">🏫</div>
            <div className="role-card-title">College Management</div>
            <div className="role-card-desc">Post events, approve club submissions, upload timetables and syllabus, send targeted notifications.</div>
            <div className="role-card-cta">Login as Management →</div>
          </div>

          <div className="role-card" onClick={() => navigate('/login/club')}>
            <div className="role-card-icon">🎯</div>
            <div className="role-card-title">Club President</div>
            <div className="role-card-desc">Submit club events for approval, track registration counts, view who is attending your events.</div>
            <div className="role-card-cta">Login as Club President →</div>
          </div>

          <div className="role-card" onClick={() => navigate('/login/student')}>
            <div className="role-card-icon">🎓</div>
            <div className="role-card-title">Student</div>
            <div className="role-card-desc">Browse events, register with one click, view your timetable, download syllabus and get exam reminders.</div>
            <div className="role-card-cta">Login as Student →</div>
          </div>

          {/* 🔥 ADDED CLUBS CARD */}
          <div className="role-card" onClick={() => navigate('/clubs')}>
            <div className="role-card-icon">📚</div>
            <div className="role-card-title">Clubs</div>
            <div className="role-card-desc">
              Explore all clubs in the college, view details and join your favorite clubs.
            </div>
            <div className="role-card-cta">View Clubs →</div>
          </div>

        </div>
      </div>

      {/* Features */}
      <div className="features-section">
        <h2 className="features-title">Everything your college needs</h2>
        <div className="features-grid">
          {features.map(f => (
            <div key={f.name} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-name">{f.name}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px', borderTop: '1px solid var(--border)', color: 'var(--text-3)', fontSize: 13 }}>
        CollegeHub v2.0 — Built with React.js + Firebase · 2026
      </div>
    </div>
  );
};

export default Landing;