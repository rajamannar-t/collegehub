import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { COLLEGE_DOMAIN } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BRANCH_OPTIONS, SEMESTER_OPTIONS } from '../../data/mockData';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import { auth, db } from "../../firebase";

const Login = () => {

  const { role = 'student' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [semester, setSemester] = useState(5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const titles = {
    student: {
      title: 'Student login',
      sub: `Sign in with your ${COLLEGE_DOMAIN} email`
    },
    admin: {
      title: 'Management login',
      sub: 'College Management admin access'
    },
    club: {
      title: 'Club President login',
      sub: 'Access your club management portal'
    }
  };

  /* ───────── LOGIN ───────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        await signOut(auth);
        throw new Error("You are not registered. Please register first.");
      }

      const profile = userDoc.data();

      toast.success(`Welcome back, ${(profile.name || "").split(' ')[0]}!`);

      if (profile.role === 'management')
        navigate('/admin/dashboard');
      else if (profile.role === 'club_president')
        navigate('/club/dashboard');
      else
        navigate('/home');

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  /* ───────── FORGOT PASSWORD ───────── */
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent to your email");
    } catch (err) {
      setError(err.message);
    }
  };

  /* ───────── REGISTER ───────── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email.endsWith(COLLEGE_DOMAIN)) {
        throw new Error(`Use your college email (${COLLEGE_DOMAIN})`);
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userRole = "student";
      if (role === "admin") userRole = "management";
      if (role === "club") userRole = "club_president";

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: userRole,
        branch,
        semester
      });

      toast.success("Account created!");

      if (userRole === "management")
        navigate('/admin/dashboard');
      else if (userRole === "club_president")
        navigate('/club/dashboard');
      else
        navigate('/home');

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const { title, sub } = titles[role] || titles.student;
  const isStudent = role === 'student';

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          College<span>Hub</span>
        </div>

        <p className="auth-tagline">{sub}</p>

        {isStudent && (
          <div className="auth-tabs">
            <div className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>
              Login
            </div>
            <div className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>
              Register
            </div>
          </div>
        )}

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          {title}
        </h2>

        {error && <div className="auth-error">⚠ {error}</div>}

        <form onSubmit={tab === 'register' ? handleRegister : handleLogin}>

          {tab === 'register' && (
            <div className="form-row">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}

          <div className="form-row">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          {tab === 'register' && (
            <div className="form-row-2">
              <select value={branch} onChange={e => setBranch(e.target.value)}>
                {BRANCH_OPTIONS.map(b => <option key={b}>{b}</option>)}
              </select>
              <select value={semester} onChange={e => setSemester(Number(e.target.value))}>
                {SEMESTER_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* PASSWORD FIELD */}
          <div className="form-row">
            <label className="form-label">Password</label>

            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  cursor: "pointer"
                }}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          {tab === "login" && (
            <div style={{ textAlign: "right", marginBottom: 10 }}>
              <span
                onClick={handleForgotPassword}
                style={{ cursor: "pointer", color: "blue", fontSize: 13 }}
              >
                Forgot Password?
              </span>
            </div>
          )}

          <button className="auth-submit" disabled={loading}>
            {loading ? "Please wait…" : tab === "register" ? "Create Account" : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;