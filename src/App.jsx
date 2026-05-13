import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ── Contexts ─────────────────────────────────────────────────────
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// ── Layout ───────────────────────────────────────────────────────
import { AppLayout } from './components/Layout';

// ── Auth Pages ───────────────────────────────────────────────────
import Landing from './pages/Auth/Landing';
import Login from './pages/Auth/Login';

// ── Student Pages ────────────────────────────────────────────────
import StudentHome from './pages/Student/Home';
import {
  Timetable,
  Syllabus,
  MyRegistrations,
  Notifications,
  Profile,
} from './pages/Student/StudentPages';
import Exams from './pages/Student/StudentPages';
import { StaffDirectory } from './pages/Student/StaffDirectory';

// ── Admin Pages ──────────────────────────────────────────────────
import {
  AdminDashboard,
  AdminApproveEvents,
  AdminTimetable,
  AdminSyllabus,
  AdminStudentsList,
} from './pages/Admin/AdminPages';
import AddClub from "./pages/Admin/AddClub";

import ExamUpload from "./pages/Admin/AdminPages";

// ── Club Pages ───────────────────────────────────────────────────
import {
  ClubDashboard,
  ClubPostEvent,
  ClubRegistrations,
  RequestBadge,
} from './pages/Club/ClubPages';

// 🔥 IMPORT CLUBS PAGE
import Clubs from "./pages/Clubs";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>

          <Routes>

            {/* ── Public ── */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Navigate to="/login/student" replace />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/request-badge" element={<RequestBadge />} />

            {/* 🔥 FIXED: Clubs route moved OUTSIDE */}
            <Route path="/clubs" element={<Clubs />} />

            {/* ── Student ── */}
            <Route path="/" element={<AppLayout />}>
              <Route path="home" element={<StudentHome />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="syllabus" element={<Syllabus />} />
              <Route path="exams" element={<Exams />} />
              <Route path="my-registrations" element={<MyRegistrations />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="staff" element={<StaffDirectory />} />
            </Route>

            {/* ── Admin ── */}
            <Route path="/admin" element={<AppLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="approve-events" element={<AdminApproveEvents />} />
              <Route path="timetable" element={<AdminTimetable />} />
              <Route path="syllabus" element={<AdminSyllabus />} />
              <Route path="exams" element={<ExamUpload />} />
              <Route path="add-club" element={<AddClub />} />
              <Route path="students" element={<AdminStudentsList />} />
            </Route>

            {/* ── Club ── */}
            <Route path="/club" element={<AppLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ClubDashboard />} />
              <Route path="post-event" element={<ClubPostEvent />} />
              <Route path="registrations" element={<ClubRegistrations />} />
              <Route path="registrations/:id" element={<ClubRegistrations />} />
            </Route>

            {/* ── Catch All ── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>

        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;