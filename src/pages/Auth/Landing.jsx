import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import AnimatedBackground from '../../components/AnimatedBackground';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: '📢', name: 'Event Aggregator',   desc: 'All college events in one feed — no more scattered WhatsApp announcements.' },
    { icon: '✅', name: 'Approval Workflow',   desc: 'Club events go through HOD review before reaching students.' },
    { icon: '🔔', name: 'Smart Reminders',     desc: '15-min event alerts + 1-week and 3-day exam notifications automatically.' },
    { icon: '📅', name: 'Live Timetable',      desc: 'Branch and semester-specific timetables always up to date.' },
    { icon: '📚', name: 'Syllabus Access',     desc: 'Download subject-wise PDFs anytime from any device.' },
    { icon: '🔒', name: 'College Emails Only', desc: 'Domain-validated signup ensures only real students get access.' },
  ];

  return (
    <div className="landing-page animate-fade">
      <AnimatedBackground />
      <PublicNavbar />

      {/* Hero */}
      <div className="landing-hero animate-slide">
        <div className="landing-badge">✦ Version 2.0 — Premium Experience</div>
        <h1 className="landing-h1">
          Your college,<br />
          <em>elevated</em>
        </h1>
        <p className="landing-p animate-slide delay-1">
          CollegeHub replaces scattered WhatsApp groups and Instagram posts with a single, organised, premium platform for events, academics and notifications.
        </p>

        <div className="landing-btns animate-slide delay-2">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login/student')} style={{ padding: '14px 28px', fontSize: '15px' }}>
            Get Started →
          </button>
          
          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => navigate('/clubs')}
            style={{ padding: '14px 28px', fontSize: '15px', background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            Explore Clubs
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
        <h2 className="role-cards-title animate-slide delay-1">Three roles, one platform</h2>

        <div className="role-cards animate-slide delay-2">

          <div className="role-card" onClick={() => navigate('/login/admin')}>
            <div className="role-card-icon">🏛️</div>
            <div className="role-card-title">Head of Department</div>
            <div className="role-card-desc">Approve events, manage clubs, and distribute syllabus centrally.</div>
            <div className="role-card-cta">HOD Panel</div>
          </div>

          <div className="role-card" onClick={() => navigate('/login/club')}>
            <div className="role-card-icon">🎯</div>
            <div className="role-card-title">Club Presidents</div>
            <div className="role-card-desc">Track registrations and publish events to all students.</div>
            <div className="role-card-cta">Club Dashboard</div>
          </div>

          <div className="role-card" onClick={() => navigate('/login/student')}>
            <div className="role-card-icon">🎓</div>
            <div className="role-card-title">Students</div>
            <div className="role-card-desc">Get your timetable, explore clubs, and never miss an event.</div>
            <div className="role-card-cta">Student Hub</div>
          </div>

          <div className="role-card" onClick={() => navigate('/clubs')}>
            <div className="role-card-icon">✨</div>
            <div className="role-card-title">Explore Clubs</div>
            <div className="role-card-desc">Join diverse communities and request badges for entry.</div>
            <div className="role-card-cta">View Collection</div>
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