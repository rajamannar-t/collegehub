import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader, StatusPill } from '../../components/Layout';
import { BRANCH_OPTIONS, SEMESTER_OPTIONS } from '../../data/mockData';
import { doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { addDoc} from "firebase/firestore";


/* ─── TIMETABLE ─────────────────────────────────────────────────── */
export const Timetable = () => {

  const { profile } = useAuth();
  const [pdf, setPdf] = useState(null);

  useEffect(() => {

    if (!profile) return;

    const fetch = async () => {

      const snap = await getDocs(collection(db, "timetables"));

      let found = null;

      snap.forEach(doc => {
        const data = doc.data();

        if (
          data.branch?.toLowerCase().trim() === profile.branch?.toLowerCase().trim() &&
          Number(data.semester) === Number(profile.semester)
        ) {
          found = data;
        }
      });

      // ✅ FIXED (no logic change, just correct object)
      if (found?.pdf) {
        setPdf(found);
      } else {
        setPdf(null);
      }

    };

    fetch();

  }, [profile]);

  return (
    <div className="main-content">

      <PageHeader title="Timetable" />

      {!pdf && (
        <div className="info-box info-box-info">
          No timetable available for your branch & semester
        </div>
      )}

      {pdf && (
        <div className="form-card" style={{ maxWidth: "100%" }}>

          <div className="list-item">

            <div className="list-icon">📅</div>

            <div className="list-main">
              <div className="list-title">
                {pdf?.title || "Timetable"}
              </div>
              <div className="list-sub">
                {profile?.branch} · Sem {profile?.semester}
              </div>
            </div>

            <a href={pdf?.pdf} target="_blank" rel="noreferrer">
              <button className="btn btn-primary btn-sm">
                Download
              </button>
            </a>

          </div>

        </div>
      )}

    </div>
  );
};
/* ─── SYLLABUS ──────────────────────────────────────────────────── */
export const Syllabus = () => {

  const { profile } = useAuth();
  const [pdf, setPdf] = useState(null);

  useEffect(() => {

    if (!profile) return;

    const fetch = async () => {

      const snap = await getDocs(collection(db, "syllabus"));

      let found = null;

      snap.forEach(doc => {
        const data = doc.data();

        if (
          data.branch?.toLowerCase().trim() === profile.branch?.toLowerCase().trim() &&
          Number(data.semester) === Number(profile.semester)
        ) {
          found = data;
        }
      });

      // ✅ FIXED
      if (found?.pdf) {
        setPdf(found);
      } else {
        setPdf(null);
      }

    };

    fetch();

  }, [profile]);

  return (
    <div className="main-content">

      <PageHeader title="Syllabus" />

      {!pdf && (
        <div className="info-box info-box-info">
          No syllabus available
        </div>
      )}

      {pdf && (
        <div className="form-card" style={{ maxWidth: "100%" }}>

          <div className="list-item">

            <div className="list-icon">📘</div>

            <div className="list-main">
              <div className="list-title">
                {pdf?.title || "Syllabus"}
              </div>
              <div className="list-sub">
                {profile?.branch} · Sem {profile?.semester}
              </div>
            </div>

            <a href={pdf?.pdf} target="_blank" rel="noreferrer">
              <button className="btn btn-primary btn-sm">
                Download
              </button>
            </a>

          </div>

        </div>
      )}

    </div>
  );
};
/* ─── EXAM SCHEDULE ─────────────────────────────────────────────── */

export default function Exams() {

  const { profile } = useAuth();
  const [exams, setExams] = useState([]);

  useEffect(() => {

    const loadExams = async () => {

      const snapshot = await getDocs(collection(db, "exams"));

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setExams(data);
    };

    loadExams();

  }, []);

  return (
  <div className="main-content">

    <PageHeader title="Exam Schedule" />

    {exams.length === 0 && (
      <div className="info-box info-box-info">
        No exams available for your branch & semester
      </div>
    )}

    <div className="form-card" style={{ maxWidth: "100%" }}>

      {exams
        .filter(e =>
          e.branch?.toLowerCase().trim() === profile?.branch?.toLowerCase().trim() &&
          Number(e.semester) === Number(profile?.semester)
        )
        .map(exam => (

          <div key={exam.id} className="list-item">

            {/* ICON */}
            <div className="list-icon">📄</div>

            {/* CONTENT */}
            <div className="list-main">
              <div className="list-title">{exam.title}</div>
              <div className="list-sub">
                {exam.branch} · Sem {exam.semester}
              </div>
            </div>

            {/* DOWNLOAD */}
            <a href={exam.pdfLink} target="_blank" rel="noreferrer">
              <button className="btn btn-primary btn-sm">
                Download
              </button>
            </a>

          </div>

      ))}

    </div>

  </div>
);
}
/* ─── MY REGISTRATIONS ──────────────────────────────────────────── */
export const MyRegistrations = () => {
  const { profile } = useAuth();
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const snap = await getDocs(collection(db, 'registrations'));
        const mine = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(r => r.userId === profile?.uid || r.studentId === profile?.uid);
        setRegs(mine);
      } catch (err) {
        console.error('Registrations fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (profile) fetchRegs();
  }, [profile]);

  // ✅ ADDED: status logic
  const getEventStatus = (r) => {
    const now = new Date();
    const eventDate = new Date(r.date);

    if (eventDate.toDateString() === now.toDateString()) {
      return "live";
    } else if (eventDate > now) {
      return "upcoming";
    } else {
      return "attended";
    }
  };

  const upcoming = regs.filter(r => r.status !== 'attended');
  const past = regs.filter(r => r.status === 'attended');

  return (
    <div>
      <PageHeader title="My Registrations" route="/my-registrations" />

      {loading && (
        <div className="list-item">
          <div className="list-main">
            <div className="list-title">Loading...</div>
          </div>
        </div>
      )}

      {!loading && regs.length === 0 && (
        <div className="info-box info-box-info">
          <span>ℹ</span>
          <div>You have not registered for any events yet. Browse events on the Home page.</div>
        </div>
      )}

      {/* 🔹 Upcoming + Live */}
      {upcoming.length > 0 && (
        <>
          <div className="section-title">Upcoming</div>

          {upcoming.map(r => (
            <div key={r.id} className="ticket-card animate-slide">
              <div className="ticket-stub">
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎟️</div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--primary)', fontWeight: 800 }}>Admit One</div>
                <div style={{ fontSize: 9, marginTop: 4, opacity: 0.6 }}>#{r.id.slice(0,6).toUpperCase()}</div>
              </div>

              <div className="ticket-main">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div className="list-title" style={{ fontSize: 18, fontWeight: 800 }}>
                      {r.eventName || r.title || 'Event'}
                    </div>
                    <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 4, display: 'flex', gap: 12 }}>
                      <span>📅 {r.date || 'TBA'}</span> 
                      {r.venue && <span>📍 {r.venue}</span>}
                    </div>
                  </div>
                  <StatusPill status={getEventStatus(r)} />
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Holder: {profile?.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>Digital Pass Ready</span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* 🔹 Past */}
      {past.length > 0 && (
        <>
          <div className="section-title">Past</div>

          {past.map(r => (
            <div key={r.id} className="ticket-card animate-slide" style={{ opacity: 0.7 }}>
              <div className="ticket-stub" style={{ background: '#f8fafc', borderRightColor: '#e2e8f0' }}>
                <div style={{ fontSize: 32, marginBottom: 8, filter: 'grayscale(1)' }}>🏆</div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', fontWeight: 800 }}>Archived</div>
              </div>

              <div className="ticket-main">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div className="list-title" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-2)' }}>
                      {r.eventName || r.title || 'Event'}
                    </div>
                    <div style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>
                      <span>📅 {r.date || 'Concluded'}</span> 
                    </div>
                  </div>
                  <StatusPill status={getEventStatus(r)} />
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
/* ─── PROFILE ───────────────────────────────────────────────────── */
export const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const toast = useToast();

  const [name,     setName]     = useState('');
  const [branch,   setBranch]   = useState('');
  const [semester, setSemester] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name       || '');
      setBranch(profile.branch   || '');
      setSemester(profile.semester || '');
    }
  }, [profile]);

  if (!profile) return null;

  const handleSave = async () => {
    try {
      // Only update Firestore if it is a real uid (not mock)
      if (profile.uid && !profile.uid.startsWith('uid_')) {
        await updateDoc(doc(db, 'users', profile.uid), {
          name,
          ...(profile.role === 'student' && {
            branch,
            semester: Number(semester),
          }),
        });
      }
      updateProfile({ name, branch, semester: Number(semester) });
      toast.success('Profile updated!');
    } catch (err) {
      console.error('Profile save error:', err);
      toast.error('Failed to save. Check your connection.');
    }
  };

  const roleLabel = {
    student:       'Student',
    management:    'Management',
    club_president:'Club President',
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        route="/profile"
        action={<button className="btn btn-primary" onClick={handleSave}>Save changes</button>}
      />

      {/* Profile card */}
      <div className="list-item" style={{ marginBottom: 20, padding: 16 }}>
        <div className="list-icon" style={{
          width: 52, height: 52, borderRadius: '50%',
          background: '#eff6ff', color: 'var(--primary)',
          fontSize: 18, fontWeight: 700,
        }}>
          {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div className="list-main">
          <div className="list-title" style={{ fontSize: 16 }}>{profile.name}</div>
          <div className="list-sub">{profile.email}</div>
          <div style={{
            display: 'inline-block', marginTop: 5,
            background: '#f0fdf4', border: '1px solid #86efac',
            borderRadius: 20, padding: '2px 10px',
            fontSize: 11, color: 'var(--green)',
          }}>
            ✓ {roleLabel[profile.role]}
            {profile.role === 'student' && ` · ${profile.branch} Sem ${profile.semester}`}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="form-card">
        <div className="form-row">
          <label className="form-label">Full name</label>
          <input
            className="form-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        {profile.role === 'student' && (
          <div className="form-row-2">
            <div className="form-row">
              <label className="form-label">Branch</label>
              <select
                className="form-select"
                value={branch}
                disabled
                onChange={e => setBranch(e.target.value)}
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              >
                {BRANCH_OPTIONS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Semester</label>
              <select
                className="form-select"
                value={semester}
                onChange={e => setSemester(e.target.value)}
              >
                {SEMESTER_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        <button className="btn btn-primary" onClick={handleSave}>
          Save changes
        </button>
      </div>
    </div>
  );
};

/* ─── NOTIFICATIONS ─────────────────────────────────────────────── */
export const Notifications = () => {
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const snap = await getDocs(collection(db, 'notifications'));
        const mine = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(n => n.userId === profile?.uid || n.role === profile?.role || n.role === 'all');
        // Sort newest first
        mine.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setNotifs(mine);
      } catch (err) {
        console.error('Notifications fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (profile) fetchNotifs();
  }, [profile]);

  const dotColor = (type) => ({
    reminder: '#dc2626',
    exam:     '#d97706',
    event:    '#16a34a',
    info:     '#2563eb',
  }[type] || '#94a3b8');

  return (
    <div>
      <PageHeader title="Notifications" route="/notifications" />

      {loading && <div className="list-item"><div className="list-main"><div className="list-title">Loading...</div></div></div>}

      {!loading && notifs.length === 0 && (
        <div className="info-box info-box-info">
          <span>🔔</span>
          <div>No notifications yet. You will receive exam reminders and event alerts here.</div>
        </div>
      )}

      {notifs.length > 0 && (
        <div className="form-card" style={{ maxWidth: '100%' }}>
          {notifs.map(n => (
            <div key={n.id} style={{
              display: 'flex', gap: 10, padding: '10px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: dotColor(n.type),
                flexShrink: 0, marginTop: 6,
              }} />
              <div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                  <strong>{n.title}</strong> {n.body && `— ${n.body}`}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>
                  {n.createdAt?.toDate
                    ? n.createdAt.toDate().toLocaleString('en-IN')
                    : 'Recently'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
