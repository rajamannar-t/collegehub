# CollegeHub Frontend

React.js web application for the CollegeHub college event aggregator and academic portal.

## Project Structure

```
src/
├── App.jsx                          ← Root app with all routes
├── index.js                         ← Entry point
├── index.css                        ← Global design system styles
│
├── context/
│   ├── AuthContext.jsx              ← Auth state (login/logout/register)
│   └── ToastContext.jsx             ← Toast notification system
│
├── components/
│   └── Layout.jsx                   ← Topbar, Sidebar, shared components
│
├── data/
│   └── mockData.js                  ← All sample data (replace with Firebase)
│
└── pages/
    ├── Auth/
    │   ├── Landing.jsx              ← /  — Landing page
    │   └── Login.jsx                ← /login/:role — Login + Register
    │
    ├── Student/
    │   ├── Home.jsx                 ← /home — Events feed
    │   └── StudentPages.jsx         ← Timetable, Syllabus, Exams,
    │                                   MyRegistrations, Profile, Notifications
    ├── Admin/
    │   └── AdminPages.jsx           ← Dashboard, PostEvent, ApproveEvents,
    │                                   Timetable, Syllabus, Exams,
    │                                   BadgeRequests, Registrations, Notifications
    └── Club/
        └── ClubPages.jsx            ← Dashboard, PostEvent, Registrations, RequestBadge
```

## Routes

| Route | Role | Page |
|---|---|---|
| `/` | Public | Landing page |
| `/login/student` | Public | Student login / register |
| `/login/admin` | Public | Management login |
| `/login/club` | Public | Club President login |
| `/home` | Student | Event feed |
| `/timetable` | Student | Semester timetable |
| `/syllabus` | Student | Syllabus PDFs |
| `/exam-schedule` | Student | Exam dates |
| `/my-registrations` | Student | My registered events |
| `/admin/dashboard` | Management | Admin overview |
| `/admin/post-event` | Management | Create event |
| `/admin/approve-events` | Management | Review club posts |
| `/admin/timetable` | Management | Upload timetables |
| `/admin/syllabus` | Management | Upload syllabus |
| `/admin/exam-schedule` | Management | Manage exams |
| `/admin/badge-requests` | Management | Approve club badges |
| `/admin/registrations` | Management | All registrations |
| `/admin/notifications` | Management | Send broadcast |
| `/club/dashboard` | Club President | Club overview |
| `/club/post-event` | Club President | Submit event |
| `/club/registrations` | Club President | Event attendees |
| `/notifications` | All | Notification inbox |
| `/profile` | All | User profile |
| `/request-badge` | Student/Club | Request CP badge |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm start
```

App runs at `http://localhost:3000`

### 3. Connect Firebase (for production)

Replace the mock functions in `src/context/AuthContext.jsx` with real Firebase calls:

```js
// Replace this mock:
await new Promise(r => setTimeout(r, 800));

// With real Firebase:
const cred = await signInWithEmailAndPassword(auth, email, password);
const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
```

Replace mock data in `src/data/mockData.js` with Firestore queries from your backend.

### 4. Build for production
```bash
npm run build
firebase deploy --only hosting
```

## Design System

- **Fonts**: Syne (display/headings) + DM Sans (body)
- **Colors**: CSS custom properties in `index.css`
- **Components**: All shared UI in `src/components/Layout.jsx`
- **No UI library** — pure custom CSS for full control

## Demo Login Credentials

All logins use any email + any password in the mock version:

| Role | Login URL | Email |
|---|---|---|
| Student | `/login/student` | anything@college.edu |
| Management | `/login/admin` | anything |
| Club President | `/login/club` | anything |

Note: Student login validates the `@college.edu` domain.
>>>>>>> bc3d257 (Initial commit)
