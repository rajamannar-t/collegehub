import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// ─── Topbar ──────────────────────────────────────────────────────
export const Topbar = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const toast    = useToast();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const roleLabel = {
    student:       'Student',
    management:    'Management',
    club_president:'Club President',
  };

  return (
    <div className="topbar">
      <div className="topbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        College<span>Hub</span>
      </div>

      {profile && (
        <div className={`role-badge ${
          profile.role === 'management'    ? 'admin' :
          profile.role === 'club_president'? 'club'  : 'student'
        }`}>
          {roleLabel[profile.role]}
        </div>
      )}

      <div className="topbar-spacer" />

      {profile && (
        <div className="topbar-right">
          <button
            className="icon-btn"
            onClick={() => navigate('/notifications')}
            title="Notifications"
          >
            🔔
            <span className="badge">3</span>
          </button>

          <div
            className="user-pill"
            onClick={() => navigate('/profile')}
            title="My Profile"
          >
            <div className={`user-avatar ${
              profile.role === 'management'    ? 'admin' :
              profile.role === 'club_president'? 'club'  : 'student'
            }`}>
              {getInitials(profile.name)}
            </div>
            <span className="user-pill-name">
              {profile.name.split(' ')[0]} {profile.name.split(' ')[1]?.[0]}.
            </span>
          </div>

          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Sidebar ─────────────────────────────────────────────────────
const STUDENT_NAV = [
  { id: 'home',          label: 'Home / Events',  icon: '🏠', path: '/home' },
  { id: 'timetable',     label: 'Timetable',       icon: '📅', path: '/timetable' },
  { id: 'syllabus',      label: 'Syllabus',         icon: '📚', path: '/syllabus' },
  { id: 'exams',         label: 'Exam Schedule',    icon: '📝', path: '/exams' },
  { id: 'clubs', label: 'Clubs', icon: '🏫', path: '/clubs' },
  { id: 'my-regs',       label: 'My Registrations', icon: '✅', path: '/my-registrations' },
  { id: 'notifications', label: 'Notifications',    icon: '🔔', path: '/notifications', badge: 3 },
  { id: 'profile',       label: 'Profile',          icon: '👤', path: '/profile' },
];

const ADMIN_NAV = [
  { id: 'dashboard',     label: 'Dashboard',      icon: '📊', path: '/admin/dashboard',    badge: 3 },
 
  { id: 'approve',       label: 'Approve Events',  icon: '✅', path: '/admin/approve-events', badge: 2 },
  { id: 'timetable',     label: 'Timetable',       icon: '📅', path: '/admin/timetable' },
  { id: 'syllabus',      label: 'Syllabus',         icon: '📚', path: '/admin/syllabus' },
  { id: 'exams',         label: 'Exam Schedule',    icon: '📝', path: '/admin/exams' },
  { id: 'add-club', label: 'Add Club', icon: '🏫', path: '/admin/add-club' },
  { id: 'badges',        label: 'Badge Requests',   icon: '🏅', path: '/admin/badge-requests', badge: 2 },
   
];

const CLUB_NAV = [
  { id: 'dashboard', label: 'Dashboard',     icon: '📊', path: '/club/dashboard' },
  { id: 'post',      label: 'Post Event',    icon: '📋', path: '/club/post-event' },
  { id: 'notif',     label: 'Notifications', icon: '🔔', path: '/notifications' },
  { id: 'profile',   label: 'Profile',       icon: '👤', path: '/profile' },
];

export const Sidebar = () => {
  const { profile, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const toast     = useToast();

  if (!profile) return null;

  const navItems = profile.role === 'management'     ? ADMIN_NAV
                 : profile.role === 'club_president'  ? CLUB_NAV
                 : STUDENT_NAV;

  const sectionLabel = profile.role === 'management'     ? 'Management'
                     : profile.role === 'club_president'  ? 'Club Portal'
                     : 'Student';

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">{sectionLabel}</div>

      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="nav-item" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </div>
      </div>
    </div>
  );
};

// ─── App Layout ───────────────────────────────────────────────────
// Uses <Outlet /> so React Router renders child pages inside layout
export const AppLayout = () => (
  <div className="app-shell">
    <Topbar />
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  </div>
);

// ─── Page Header ──────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, route, action }) => (
  <div>
    {route && <div className="route-pill">{route}</div>}
    <div className="page-header">
      <div className="page-header-left">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  </div>
);

// ─── Category Color Helper ────────────────────────────────────────
export const getCatClass = (cat) => ({
  Technical: 'cat-technical',
  Cultural:  'cat-cultural',
  Sports:    'cat-sports',
  Workshop:  'cat-workshop',
})[cat] || 'cat-other';

// ─── Status Pill ──────────────────────────────────────────────────
export const StatusPill = ({ status }) => {
  const map = {
    pending:  { cls: 'status-pending',  label: 'Pending'  },
    approved: { cls: 'status-approved', label: 'Approved' },
    rejected: { cls: 'status-rejected', label: 'Rejected' },
    upcoming: { cls: 'status-upcoming', label: 'Upcoming' },
    attended: { cls: 'status-attended', label: 'Attended' },
  };
  const s = map[status] || map.pending;
  return <span className={`status ${s.cls}`}>{s.label}</span>;
};

// ─── Seats Bar ────────────────────────────────────────────────────
export const SeatsBar = ({ filled, total }) => {
  const pct   = Math.round((filled / total) * 100);
  const color = pct >= 90 ? 'full' : pct >= 70 ? 'almost-full' : '';
  return (
    <div className="seats-wrap">
      <div className="seats-label">{filled}/{total} seats</div>
      <div className="seats-bar">
        <div className={`seats-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ─── Section Title ────────────────────────────────────────────────
export const SectionTitle = ({ children }) => (
  <div className="section-title">{children}</div>
);

// ─── Info Box ─────────────────────────────────────────────────────
export const InfoBox = ({ type = 'info', icon, children }) => (
  <div className={`info-box info-box-${type}`}>
    {icon && <span>{icon}</span>}
    <div>{children}</div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────
export const EmptyState = ({ icon = '📭', title, subtitle }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-3)' }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>{title}</div>
    {subtitle && <div style={{ fontSize: 13 }}>{subtitle}</div>}
  </div>
);

// ─── Protected Route ──────────────────────────────────────────────
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { profile } = useAuth();
  const navigate    = useNavigate();

  React.useEffect(() => {
    if (!profile) { navigate('/'); return; }
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
      navigate(
        profile.role === 'management'     ? '/admin/dashboard' :
        profile.role === 'club_president'  ? '/club/dashboard'  : '/home'
      );
    }
  }, [profile, allowedRoles, navigate]);

  if (!profile) return null;
  return children;
};
