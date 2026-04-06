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
    <div>

      <PageHeader
        title="Upcoming Events"
        subtitle="Browse and register for college events"
        route="/home"
      />

      {/* Filters */}
      <div className="chips">
        {['All', ...CATEGORY_OPTIONS].map(cat => (
          <button
            key={cat}
            className={`chip ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="events-grid">

        {filtered.length === 0 && (
          <div style={{ padding: 20 }}>
            No approved events yet
          </div>
        )}

        {filtered.map(event => {

          const isReg = registered[event.id];

          return (
            <div key={event.id} className="event-card">

              {/* Banner */}
              <div className="event-banner">
                🎉
                <div className={`event-cat ${getCatClass(event.category)}`}>
                  {event.category}
                </div>
              </div>

              {/* Body */}
              <div className="event-body">

                <div className="event-title">{event.title}</div>

                <div className="event-meta">
                  <span>
                    📅 {event.date} · {event.time}
                  </span>
                  <span>📍 {event.venue}</span>
                </div>

                <div className="event-footer">

                  <SeatsBar
                    filled={0}
                    total={event.capacity || 100}
                  />
                  {isReg ? (
  <button className="btn btn-success btn-sm">
    ✓ Registered
  </button>
) : (
  <button
    className="btn btn-primary btn-sm"
    onClick={() => handleRegister(event)}
  >
    Register
  </button>
)}

                 
                </div>

              </div>

            </div>
          );

        })}

      </div>

    </div>
  );
};

export default StudentHome;