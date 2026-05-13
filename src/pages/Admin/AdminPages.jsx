import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { PageHeader } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { BRANCH_OPTIONS } from '../../data/mockData';
/* ─── HOD DASHBOARD ─── */
export const AdminDashboard = () => {
  const { profile } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState("");

  const handleAssignBranch = async () => {
    if (!selectedBranch) return alert("Select a branch first");
    
    // Update the user's profile with the new branch constraint
    await updateDoc(doc(db, "users", profile.uid || require('../../firebase').auth.currentUser.uid), {
      branch: selectedBranch
    });
    
    alert("Department successfully assigned! You can now manage records.");
    window.location.reload(); // Quick refresh to pull the new profile state
  };

  return (
    <div>
      <PageHeader title="HOD Dashboard" subtitle="College Management Admin" />
      
      {!profile?.branch ? (
        <div className="form-card" style={{ border: '2px solid var(--amber)' }}>
          <h3 style={{ marginBottom: 10, color: 'var(--amber)' }}>⚠ Department Assignment Required</h3>
          <p style={{ marginBottom: 15 }}>Your account is not assigned to a department yet. Please lock in your department. You cannot change this later.</p>
          
          <div className="form-row">
            <label className="form-label">Select Your Department</label>
            <select
              className="form-select"
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
            >
              <option value="">-- Choose Branch --</option>
              {BRANCH_OPTIONS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleAssignBranch}>Lock Department</button>
        </div>
      ) : (
        <div className="form-card">
          <h2>Welcome head of {profile.branch} 👋</h2>
          <p style={{ marginTop: 10, color: 'var(--text-2)' }}>You have secure management access isolated to the {profile.branch} department.</p>
        </div>
      )}
    </div>
  );
};

/* ─── APPROVE EVENTS (FIXED) ─── */
export const AdminApproveEvents = () => {
  const { profile } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!profile?.branch) return;

      // HOD Privilege: Only fetch events that belong to CLUBS inside the HOD's branch
      const clubsSnap = await getDocs(collection(db, "clubs"));
      const myDepartmentClubs = clubsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(club => club.department === profile.branch)
        .map(club => club.id);

      const snap = await getDocs(collection(db, "events"));
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter: event must be pending AND it must belong to a club in this HOD's branch
      const pending = data.filter(e => e.status === "pending" && myDepartmentClubs.includes(e.clubId));
      setEvents(pending);
    };

    fetchEvents();
  }, [profile]);

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

  const { profile } = useAuth();
  const [semester, setSemester] = useState(5);
  const [pdf, setPdf] = useState('');
  const [title, setTitle] = useState('');

  const convert = (url) => {
    if (!url.includes("drive.google.com")) return url;
    const match = url.match(/\/d\/(.*?)\//);
    return match
      ? `https://drive.google.com/uc?export=preview&id=${match[1]}`
      : url;
  };

  const handleUpload = async () => {

    if (!pdf) return alert("Paste PDF link");
    if (!profile?.branch) return alert("HOD branch not found");

    await addDoc(collection(db, "timetables"), {
      branch: profile.branch, 
      semester,
      pdf: convert(pdf),
      title
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
          <label className="form-label">Branch (HOD Locked)</label>
          <select
            className="form-select"
            value={profile?.branch || ""}
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          >
            <option value={profile?.branch || ""}>{profile?.branch || "Loading..."}</option>
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

  const { profile } = useAuth();
  const [semester, setSemester] = useState(5);
  const [pdf, setPdf] = useState('');
  const [title, setTitle] = useState('');

  const convert = (url) => {
    if (!url.includes("drive.google.com")) return url;
    const match = url.match(/\/d\/(.*?)\//);
    return match
      ? `https://drive.google.com/uc?export=preview&id=${match[1]}`
      : url;
  };

  const handleUpload = async () => {

    if (!pdf) return alert("Paste PDF link");
    if (!profile?.branch) return alert("HOD branch not found");

    await addDoc(collection(db, "syllabus"), {
      branch: profile.branch, 
      semester,
      pdf: convert(pdf),
      title
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
          <label className="form-label">Branch (HOD Locked)</label>
          <select
            className="form-select"
            value={profile?.branch || ""}
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          >
            <option value={profile?.branch || ""}>{profile?.branch || "Loading..."}</option>
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

  const { profile } = useAuth();
  const [semester, setSemester] = useState("");
  const [title, setTitle] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [date, setDate] = useState("");

  const uploadExam = async () => {
    try {
      
      // ✅ validation
      if (!profile?.branch || !semester || !title || !pdfLink || !date) {
        alert("Fill all fields ❌");
        return;
      }

      // 🔥 MAIN LOGIC (REMINDER READY)
      await addDoc(collection(db, "exams"), {
        branch: profile.branch, 
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
          <label className="form-label">Branch (HOD Locked)</label>
          <select
            className="form-select"
            value={profile?.branch || ""}
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          >
            <option value={profile?.branch || ""}>{profile?.branch || "Loading..."}</option>
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

/* ─── STUDENTS LIST ─── */
export const AdminStudentsList = () => {
  const { profile } = useAuth();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!profile?.branch) return;
      const snap = await getDocs(collection(db, "users"));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const branchStudents = data.filter(u => u.role === 'student' && u.branch === profile.branch);
      setStudents(branchStudents);
    };
    fetchStudents();
  }, [profile]);

  const downloadCSV = () => {
    // Determine the columns we want to export
    const headers = ["Name", "Year", "Semester", "Mobile", "Email"];
    
    // Convert each student object into a CSV formatted row string
    const csvRows = students.map(s => {
      return `"${s.name}","${s.year || ''}","${s.semester || ''}","${s.mobile || ''}","${s.email}"`;
    });
    
    // Combine headers and rows
    const csvData = [headers.join(","), ...csvRows].join("\n");
    
    // Create an invisible hyperlink to trigger the file download
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${profile.branch}_Students.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader
          title="Department Students"
          subtitle={`All registered ${profile?.branch || ''} students`}
        />
        {students.length > 0 && (
          <button 
            onClick={downloadCSV}
            style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            Export CSV 📥
          </button>
        )}
      </div>
      <div className="form-card" style={{ overflowX: 'auto' }}>
        {students.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 20 }}>No students found for this department.</p>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '12px' }}>Student Name</th>
                <th style={{ padding: '12px' }}>Year & Sem</th>
                <th style={{ padding: '12px' }}>Mobile Number</th>
                <th style={{ padding: '12px' }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: '12px' }}>{s.year || '-'}<br/><small style={{ color: 'var(--text-3)' }}>Sem {s.semester}</small></td>
                  <td style={{ padding: '12px' }}>{s.mobile || '-'}</td>
                  <td style={{ padding: '12px' }}>{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};