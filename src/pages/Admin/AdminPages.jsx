import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { PageHeader } from '../../components/Layout';
/* ─── ADMIN DASHBOARD (UNCHANGED) ─── */
export const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome Admin 👋</p>
    </div>
  );
};

/* ─── APPROVE EVENTS (FIXED) ─── */
export const AdminApproveEvents = () => {

  const [events, setEvents] = useState([]);

  useEffect(() => {

    const fetchEvents = async () => {

      const snap = await getDocs(collection(db, "events"));

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const pending = data.filter(e => e.status === "pending");

      setEvents(pending);
    };

    fetchEvents();

  }, []);

  const handleApprove = async (id) => {

    await updateDoc(doc(db, "events", id), {
      status: "approved"
    });

    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div>

      <PageHeader
        title="Approve Events"
        subtitle="Review and approve club events"
      />

      <div className="events-grid">

        {events.length === 0 && (
          <div style={{ padding: 20 }}>
            No pending events
          </div>
        )}

        {events.map(event => (

          <div key={event.id} className="event-card">

            {/* Banner */}
            <div className="event-banner">
              <span style={{ fontSize: 40 }}>🎯</span>
            </div>

            {/* Body */}
            <div className="event-body">

              <div className="event-title">
                {event.title}
              </div>

              <div className="event-meta">
                <span>📅 {event.date}</span>
                <span>📍 {event.venue}</span>
              </div>

              <div className="event-footer">

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleApprove(event.id)}
                >
                  Approve
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}; // ✅ FIXED (this was missing)

/* ─── ADMIN TIMETABLE (UNCHANGED LOGIC) ─── */
export const AdminTimetable = () => {

  const [branch, setBranch] = useState('CSE');
  const [semester, setSemester] = useState(5);
  const [pdf, setPdf] = useState('');
  const [title, setTitle] = useState(''); // ✅ added

  const convert = (url) => {
    if (!url.includes("drive.google.com")) return url;
    const match = url.match(/\/d\/(.*?)\//);
    return match
      ? `https://drive.google.com/uc?export=preview&id=${match[1]}`
      : url;
  };

  const handleUpload = async () => {

    if (!pdf) return alert("Paste PDF link");

    await addDoc(collection(db, "timetables"), {
      branch,
      semester,
      pdf: convert(pdf),
      title // ✅ added
    });

    alert("Timetable uploaded!");
    setPdf('');
    setTitle('');
  };

  return (
    <div>

      <PageHeader
        title="Upload Timetable"
        subtitle="Upload timetable PDF for students"
      />

      <div className="form-card">

        <div className="form-row">
          <label className="form-label">Branch</label>
          <select
            className="form-select"
            value={branch}
            onChange={e => setBranch(e.target.value)}
          >
            <option>CSE</option>
            <option>ECE</option>
            <option>EEE</option>
            <option>AI</option>
            <option>DS</option>
            <option>AIML</option>
            <option>CS</option>
            <option>IT</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Semester</label>
          <select
            className="form-select"
            value={semester}
            onChange={e => setSemester(Number(e.target.value))}
          >
            {[1,2,3,4,5,6,7,8].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">PDF Link</label>
          <input
            className="form-input"
            placeholder="Paste Google Drive link"
            value={pdf}
            onChange={e => setPdf(e.target.value)}
          />
        </div>

        {/* ✅ ADDED TITLE FIELD */}
        <div className="form-row">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            placeholder="e.g. Mid Timetable 2026"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleUpload}>
          Upload Timetable
        </button>

      </div>

    </div>
  );
};
/* ─── ADMIN SYLLABUS (UNCHANGED LOGIC) ─── */
export const AdminSyllabus = () => {

  const [branch, setBranch] = useState('CSE');
  const [semester, setSemester] = useState(5);
  const [pdf, setPdf] = useState('');
  const [title, setTitle] = useState(''); // ✅ added

  const convert = (url) => {
    if (!url.includes("drive.google.com")) return url;
    const match = url.match(/\/d\/(.*?)\//);
    return match
      ? `https://drive.google.com/uc?export=preview&id=${match[1]}`
      : url;
  };

  const handleUpload = async () => {

    if (!pdf) return alert("Paste PDF link");

    await addDoc(collection(db, "syllabus"), {
      branch,
      semester,
      pdf: convert(pdf),
      title // ✅ added
    });

    alert("Syllabus uploaded!");
    setPdf('');
    setTitle('');
  };

  return (
    <div>

      <PageHeader
        title="Upload Syllabus"
        subtitle="Upload syllabus PDF for students"
      />

      <div className="form-card">

        <div className="form-row">
          <label className="form-label">Branch</label>
          <select
            className="form-select"
            value={branch}
            onChange={e => setBranch(e.target.value)}
          >
            <option>CSE</option>
            <option>ECE</option>
            <option>EEE</option>
            <option>AI</option>
            <option>DS</option>
            <option>AIML</option>
            <option>CS</option>
            <option>IT</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Semester</label>
          <select
            className="form-select"
            value={semester}
            onChange={e => setSemester(Number(e.target.value))}
          >
            {[1,2,3,4,5,6,7,8].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">PDF Link</label>
          <input
            className="form-input"
            placeholder="Paste Google Drive link"
            value={pdf}
            onChange={e => setPdf(e.target.value)}
          />
        </div>

        {/* ✅ ADDED TITLE FIELD */}
        <div className="form-row">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            placeholder="e.g. Unit-wise Syllabus"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleUpload}>
          Upload Syllabus
        </button>

      </div>

    </div>
  );
};
/* ─── ADMIN exam schedules ─── */
export default function ExamUpload() {

  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [title, setTitle] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [date, setDate] = useState("");

  const uploadExam = async () => {
    try {

      // ✅ validation
      if (!branch || !semester || !title || !pdfLink || !date) {
        alert("Fill all fields ❌");
        return;
      }

      // 🔥 MAIN LOGIC (REMINDER READY)
      await addDoc(collection(db, "exams"), {
        branch,
        semester: Number(semester),
        title,
        pdfLink,

        
        date: new Date(date).toISOString(),

       
        notified7: false,
        notified3: false,

        createdAt: new Date()
      });

      alert("Exam Schedule Uploaded ✅");

      // ✅ reset form
      setBranch("");
      setSemester("");
      setTitle("");
      setPdfLink("");
      setDate("");

    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  return (
    <div>

      <PageHeader title="Upload Exam Schedule" />

      <div className="form-card">

        {/* Branch */}
        <div className="form-row">
          <label className="form-label">Branch</label>
          <select
            className="form-select"
            value={branch}
            onChange={e => setBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="IT">IT</option>
            <option value="AI">AI</option>
            <option value="AIML">AIML</option>
            <option value="CS">CS</option>
            <option value="DS">DS</option>
          </select>
        </div>

        {/* Semester */}
        <div className="form-row">
          <label className="form-label">Semester</label>
          <select
            className="form-select"
            value={semester}
            onChange={e => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="form-row">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            placeholder="Mid Exams 2026"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="form-row">
          <label className="form-label">Date</label>
          <input
            className="form-input"
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        {/* PDF Link */}
        <div className="form-row">
          <label className="form-label">PDF Link</label>
          <input
            className="form-input"
            placeholder="Paste Google Drive PDF Link"
            value={pdfLink}
            onChange={e => setPdfLink(e.target.value)}
          />
        </div>

        {/* Button */}
        <button className="btn btn-primary" onClick={uploadExam}>
          Upload Exam Schedule
        </button>

      </div>

    </div>
  );
}