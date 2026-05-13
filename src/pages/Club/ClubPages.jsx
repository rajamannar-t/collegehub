import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, SectionTitle, InfoBox } from '../../components/Layout';
import { CATEGORY_OPTIONS } from '../../data/mockData';

import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  doc
} from "firebase/firestore";
/* ───────── CLUB DASHBOARD ───────── */
export const ClubDashboard = () => {

  const { profile } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {

    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const myEvents = data.filter(
        e => e.clubId === profile?.clubId
      );

      setEvents(myEvents);
    };

    const fetchMembers = async () => {
      const snap = await getDocs(collection(db, "club_members"));

      const data = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(m => m.clubId === profile?.clubId);

      setMembers(data);
    };

    const fetchRequests = async () => {
      const snap = await getDocs(collection(db, "club_join_requests"));

      const data = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(
          r =>
            r.clubId === profile?.clubId &&
            r.status === "pending"
        );

      setRequests(data);
    };

    if (profile) {
      fetchEvents();
      fetchMembers();
      fetchRequests();
    }

  }, [profile]);

  // ✅ APPROVE
  const handleApprove = async (req) => {

    await addDoc(collection(db, "club_members"), {
      clubId: req.clubId,
      userId: req.userId,
      userName: req.userName,
      role: "member"
    });

    await updateDoc(doc(db, "club_join_requests", req.id), {
      status: "approved"
    });

    setRequests(prev => prev.filter(r => r.id !== req.id));
  };

  // ❌ REJECT
  const handleReject = async (req) => {

    await updateDoc(doc(db, "club_join_requests", req.id), {
      status: "rejected"
    });

    setRequests(prev => prev.filter(r => r.id !== req.id));
  };

  // 🗑️ REMOVE MEMBER
  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to completely remove this member?")) {
      try {
        await deleteDoc(doc(db, "club_members", memberId));
        setMembers(prev => prev.filter(m => m.id !== memberId));
      } catch (err) {
        console.error("Error removing member:", err);
      }
    }
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Club Dashboard"
        subtitle={`${profile?.clubName || 'Club'} · ${profile?.name}`}
        route="/club/dashboard"
        action={
          <button
            className="btn btn-primary"
            onClick={() => navigate('/club/post-event')}
          >
            + Post Event
          </button>
        }
      />

      {/* KPI STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", background: "linear-gradient(135deg, var(--primary), var(--primary-light))", borderRadius: "16px", color: "white", boxShadow: "0 4px 12px rgba(79,70,229,0.3)" }}>
           <h2 style={{ fontSize: "32px", margin: "0 0 4px 0" }}>{members.length}</h2>
           <p style={{ margin: 0, opacity: 0.9, fontWeight: 500 }}>Active Members</p>
        </div>
        <div style={{ padding: "20px", background: "var(--bg-1)", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
           <h2 style={{ fontSize: "32px", margin: "0 0 4px 0", color: "var(--text-1)" }}>{events.length}</h2>
           <p style={{ margin: 0, color: "var(--text-2)", fontWeight: 500 }}>Upcoming Events</p>
        </div>
        <div style={{ padding: "20px", background: "var(--bg-1)", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
           <h2 style={{ fontSize: "32px", margin: "0 0 4px 0", color: "var(--text-1)" }}>{requests.length}</h2>
           <p style={{ margin: 0, color: "var(--text-2)", fontWeight: 500 }}>Pending Requests</p>
        </div>
      </div>

      {/* EVENTS */}
      <SectionTitle>My Events</SectionTitle>
      {events.length === 0 ? <p style={{color: "var(--text-3)", marginBottom: "32px"}}>No events posted yet.</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {events.map(ev => (
            <div key={ev.id} style={{ background: "var(--bg-1)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 600, fontSize: "18px", color: "var(--text-1)", marginBottom: "4px" }}>{ev.title}</div>
              <div style={{ fontSize: "14px", color: "var(--text-2)", marginBottom: "16px" }}>{ev.category} · {ev.venue}</div>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ width: "100%" }}
                onClick={() => navigate(`/club/registrations/${encodeURIComponent(ev.title)}`)}
              >
                View Registrations
              </button>
            </div>
          ))}
        </div>
      )}

      {/* JOIN REQUESTS */}
      <SectionTitle>Join Requests</SectionTitle>
      {requests.length === 0 ? <p style={{color: "var(--text-3)", marginBottom: "32px"}}>No pending join requests.</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {requests.map(req => (
            <div key={req.id} className="list-item" style={{ background: "var(--bg-1)" }}>
              <div className="list-main">
                <div className="list-title">{req.userName}</div>
                <div className="list-sub">{req.branch} · Sem {req.semester}</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn btn-primary btn-sm" onClick={() => handleApprove(req)}>Approve</button>
                <button className="btn btn-sm" style={{ background: "var(--danger, #ef4444)", color: "white" }} onClick={() => handleReject(req)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MEMBERS */}
      <SectionTitle>Club Members</SectionTitle>
      {members.length === 0 ? <p style={{color: "var(--text-3)"}}>No active members.</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {members.map((m) => (
            <div key={m.id} className="list-item" style={{ background: "var(--bg-1)" }}>
              <div className="list-main">
                <div className="list-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ background: "var(--bg-3)", padding: "4px 8px", borderRadius: "50%", fontSize: "14px" }}>👤</span>
                  {m.userName}
                </div>
                <div className="list-sub" style={{ marginLeft: "40px" }}>{m.role === 'member' ? 'Member' : m.role}</div>
              </div>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ color: "var(--danger, #ef4444)", borderColor: "var(--danger, #ef4444)" }}
                onClick={() => handleRemoveMember(m.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
/* ───────── CLUB POST EVENT (YOUR UI PRESERVED) ───────── */

export const ClubPostEvent = () => {

  const { profile } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Technical',
    date: '',
    time: '',
    venue: '',
    capacity: '',
    description: '',
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Profile check
    if (!profile || !profile.uid) {
      toast.error("User not loaded. Please login again.");
      return;
    }

    // ✅ Required fields
    if (!form.title || !form.date || !form.venue) {
      toast.error("Please fill all required fields");
      return;
    }

    // ✅ Prevent past date/time
    const selectedDateTime = new Date(`${form.date}T${form.time || "00:00"}`);
    const now = new Date();

    if (selectedDateTime < now) {
      toast.error("Cannot create event in the past");
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting event:", form);

      await addDoc(collection(db, "events"), {
        title: form.title,
        category: form.category,
        date: form.date,
        time: form.time || "",
        venue: form.venue,
        capacity: form.capacity ? Number(form.capacity) : 0, // ✅ fix
        description: form.description || "",

        status: "pending",

        createdBy: profile.uid,
        createdByName: profile.name || "Unknown",
        clubId: profile.clubId || null,

        createdAt: serverTimestamp(), // ✅ correct
      });

      toast.success("Event submitted successfully!");

      // ✅ Reset form
      setForm({
        title: '',
        category: 'Technical',
        date: '',
        time: '',
        venue: '',
        capacity: '',
        description: ''
      });

    } catch (err) {
      console.error("Error adding event:", err);

      if (err.code === "permission-denied") {
        toast.error("Permission denied. Check Firestore rules.");
      } else {
        toast.error("Error posting event");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <PageHeader
        title="Post Event"
        subtitle="Submit event for approval"
        route="/club/post-event"
      />

      <form className="form-card" onSubmit={handleSubmit}>

        {/* Title */}
        <div className="form-row">
          <label className="form-label">Event Title *</label>
          <input
            className="form-input"
            value={form.title}
            onChange={e => set('title', e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="form-row">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {CATEGORY_OPTIONS.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Date + Time */}
        <div className="form-row-2">
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]} // ✅ prevent past date
            className="form-input"
            value={form.date}
            onChange={e => set('date', e.target.value)}
          />
          <input
            type="time"
            className="form-input"
            value={form.time}
            onChange={e => set('time', e.target.value)}
          />
        </div>

        {/* Venue */}
        <div className="form-row">
          <input
            className="form-input"
            placeholder="Venue *"
            value={form.venue}
            onChange={e => set('venue', e.target.value)}
          />
        </div>

        {/* Capacity */}
        <div className="form-row">
          <input
            type="number"
            className="form-input"
            placeholder="Capacity"
            value={form.capacity}
            onChange={e => set('capacity', e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="form-row">
          <textarea
            className="form-textarea"
            placeholder="Description"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        {/* Info */}
        <InfoBox type="warn">
          Event will be pending until admin approval
        </InfoBox>

        {/* Submit */}
        <button
          className="btn btn-primary"
          disabled={loading || !profile}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>

    </div>
  );
};

/* ───────── CLUB REGISTRATIONS ───────── */

export const ClubRegistrations = () => {

  const { id } = useParams();
  const eventName = decodeURIComponent(id);

  const [data, setData] = useState([]);

  useEffect(() => {

    const fetch = async () => {

      const snap = await getDocs(collection(db, "registrations"));

      const list = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(r => r.eventName === eventName);

      setData(list);

    };

    fetch();

  }, [eventName]);

  return (
    <div>

      <PageHeader
        title="Registered Students"
        subtitle={`Event: ${eventName}`}
        route={`/club/registrations/${id}`}
      />

      {data.length === 0 && (
        <div style={{ padding: 20 }}>No students registered</div>
      )}

      {data.map(reg => (
        <div key={reg.id} className="list-item">
          <div className="list-main">
            <div className="list-title">{reg.userName}</div>
            <div className="list-sub">
              {reg.branch} · Sem {reg.semester}
            </div>
          </div>
        </div>
      ))}

    </div>
  );
};

/* ───────── BADGE REQUEST ───────── */

export const RequestBadge = () => {

  const { profile } = useAuth();
  const toast = useToast();

  const [clubName, setClubName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clubName) {
      toast.error("Enter club name");
      return;
    }

    toast.success("Request sent");
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">

      <input value={profile?.name} disabled className="form-input" />
      <input value={profile?.email} disabled className="form-input" />

      <input
        placeholder="Club Name"
        value={clubName}
        onChange={e => setClubName(e.target.value)}
        className="form-input"
      />

      <button className="btn btn-primary">Submit</button>

    </form>
  );
};