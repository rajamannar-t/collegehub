import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { PageHeader, getCatClass, SeatsBar } from '../../components/Layout';
import { CATEGORY_OPTIONS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

import {
  collection,
  getDocs,
  addDoc
} from "firebase/firestore";

import { db } from "../../firebase";

const StudentHome = () => {

  const toast = useToast();
  const { profile } = useAuth();

  const [filter, setFilter] = useState('All');
  const [events, setEvents] = useState([]);
  const [registered, setRegistered] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* ───────── FETCH EVENTS ───────── */

  useEffect(() => {

    const fetchEvents = async () => {

      const snap = await getDocs(collection(db, "events"));

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // ONLY APPROVED EVENTS
    const today = new Date();

const approved = data.filter(e => {
  const eventDate = new Date(e.date);
  return e.status === "approved" && eventDate >= today;
});

      setEvents(approved);
    };

    fetchEvents();

  }, []);

  /* ───────── FETCH USER REGISTRATIONS ───────── */

  useEffect(() => {

  const fetchRegistered = async () => {

    const snap = await getDocs(collection(db, "registrations"));

    const map = {};

    snap.docs.forEach(doc => {
      const data = doc.data();
      if (data.userId === profile.uid) {
        map[data.eventId] = true;
      }
    });

    setRegistered(map);

  };

  if (profile) fetchRegistered();

}, [profile]);
  /* ───────── FILTER ───────── */

  const filtered =
    filter === 'All'
      ? events
      : events.filter(e => e.category === filter);

  /* ───────── REGISTER ───────── */
const handleRegister = async (event) => {

  if (registered[event.id]) return;

  try {

    // check already registered
    const snap = await getDocs(collection(db, "registrations"));

    const already = snap.docs.find(d =>
      d.data().userId === profile.uid &&
      d.data().eventId === event.id
    );

    if (already) {
      toast.error("Already registered");
      return;
    }

    // save registration
    await addDoc(collection(db, "registrations"), {
      userId: profile.uid,
      eventId: event.id,
      eventName: event.title,
      createdAt: new Date()
    });

    setRegistered(prev => ({
      ...prev,
      [event.id]: true
    }));

    toast.success("Registered successfully!");

  } catch (err) {
    console.log(err);
  }

};
  /* ───────── UI ───────── */

  return (
    <div className="animate-fade" style={{ paddingTop: 10 }}>

      <div className="animate-slide">
        <PageHeader
          title="Campus Life & Events"
          subtitle="Discover and register for upcoming college activities"
          route="/home"
        />
      </div>

      {/* Filters */}
      <div className="chips animate-slide delay-1" style={{ marginBottom: 24, marginTop: 12 }}>
        {['All', ...CATEGORY_OPTIONS].map(cat => (
          <button
            key={cat}
            className={`chip ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
            style={{ padding: '8px 18px', fontSize: 13 }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="events-grid animate-slide delay-2" style={{ gap: 20 }}>

        {filtered.length === 0 && (
          <div className="form-card" style={{ padding: 40, textAlign: 'center', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🗓️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>No Events Found</h3>
            <p style={{ color: 'var(--text-3)' }}>There are no upcoming events in this category yet.</p>
          </div>
        )}

        {filtered.map(event => {
          return (
            <div 
              key={event.id} 
              className="role-card" 
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => setSelectedEvent(event)}
            >

              {/* Banner */}
              <div className="event-banner" style={{ height: 120, background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)', fontSize: 40 }}>
                🎉
                <div className={`event-cat ${getCatClass(event.category)}`} style={{ top: 12, right: 12 }}>
                  {event.category}
                </div>
              </div>

              {/* Body */}
              <div className="event-body" style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                <div>
                  <div className="event-title" style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{event.title}</div>

                  <div className="event-meta" style={{ gap: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      📅 <span>{event.date} · {event.time}</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      📍 <span>{event.venue}</span>
                    </span>
                  </div>
                </div>

                <div className="event-footer" style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                    View Event Details →
                  </span>
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* EVENT MODAL */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            
            <div style={{ height: 160, background: 'linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>
              ✨
              <button 
                onClick={() => setSelectedEvent(null)}
                style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '30px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span className={`event-cat ${getCatClass(selectedEvent.category)}`} style={{ position: 'relative', margin: 0, padding: '4px 12px', fontSize: 12 }}>{selectedEvent.category}</span>
                <span style={{ color: 'var(--text-3)', fontSize: 13 }}>Hosted by {selectedEvent.createdByName}</span>
              </div>
              
              <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text)', lineHeight: 1.2 }}>{selectedEvent.title}</h2>
              
              <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 12, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-2)', fontSize: 14 }}>
                  <div style={{ width: 36, height: 36, background: '#e0e7ff', color: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🗓️</div>
                  <div><strong>{selectedEvent.date}</strong> at {selectedEvent.time}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-2)', fontSize: 14 }}>
                  <div style={{ width: 36, height: 36, background: '#fce7f3', color: '#ec4899', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📍</div>
                  <div>{selectedEvent.venue}</div>
                </div>
              </div>

              <div style={{ marginBottom: 30 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>About this Event</h3>
                <p style={{ color: 'var(--text-2)', fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedEvent.description || "No description provided for this event."}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6, fontWeight: 600 }}>Capacity</div>
                  <SeatsBar filled={0} total={selectedEvent.capacity || 100} />
                </div>
                
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  {registered[selectedEvent.id] ? (
                    <button className="btn btn-success" style={{ fontWeight: 600, width: '100%', padding: '14px 20px' }}>
                      ✓ Ticket Secured
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ fontWeight: 600, width: '100%', padding: '14px 20px', background: 'linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)' }}
                      onClick={() => { handleRegister(selectedEvent); setSelectedEvent(null); }}
                    >
                      🎟️ Get Ticket
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentHome;