# 🎓 CollegeHub

A comprehensive college management and event aggregator platform built with **React**, **Express.js**, and **Firebase**. CollegeHub enables students, clubs, and administrators to manage academic activities, events, and notifications in one unified platform.

## ✨ Features

### 🎯 For Students
- **Event Discovery**: Browse and register for college events and club activities
- **Academic Portal**: Access timetables, syllabus, exam schedules
- **Event Registrations**: Manage registered events and view event details
- **Notifications**: Receive real-time updates about events and announcements
- **User Profile**: Update profile information and preferences
- **Staff Directory**: Find contact information for college staff

### 👥 For Club Presidents
- **Event Management**: Create and publish club events
- **Registration Tracking**: View attendee lists and manage registrations
- **Badge Requests**: Request club badges (CP - Club President)
- **Dashboard**: Overview of club activities and event statistics

### ⚙️ For Administrators
- **Dashboard**: System-wide overview and analytics
- **Event Approval**: Review and approve/reject club event postings
- **Academic Management**: Upload and manage timetables, syllabus, exam schedules
- **Student Management**: View and manage student data
- **Badge Management**: Approve or reject club badge requests
- **Bulk Actions**: Manage registrations and send broadcasts

## 🏗️ Project Structure

```
collegehub-frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx                    # Shared UI components (Topbar, Sidebar)
│   ├── context/
│   │   ├── AuthContext.jsx              # Authentication state management
│   │   └── ToastContext.jsx             # Toast notifications
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Landing.jsx              # Landing page
│   │   │   └── Login.jsx                # Login & registration
│   │   ├── Student/
│   │   │   ├── Home.jsx                 # Event feed
│   │   │   ├── StudentPages.jsx         # Academic pages
│   │   │   └── StaffDirectory.jsx       # Staff contacts
│   │   ├── Admin/
│   │   │   ├── AdminPages.jsx           # Admin dashboard & tools
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AddClub.jsx              # Club management
│   │   └── Club/
│   │       └── ClubPages.jsx            # Club president features
│   ├── data/
│   │   └── mockData.js                  # Sample data (Firebase integration ready)
│   ├── App.jsx                          # Main app with routing
│   ├── firebase.js                      # Firebase config
│   ├── index.jsx                        # React entry point
│   └── index.css                        # Global styles
│
├── backend/                             # Express.js API server
│   ├── package.json
│   └── index.js                         # Express server setup
│
├── functions/                           # Firebase Cloud Functions
│   ├── index.js
│   └── package.json
│
├── public/                              # Static assets
│   └── index.html
│
├── firebase.json                        # Firebase configuration
├── package.json                         # Frontend dependencies
└── README.md                            # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router 6.21.0** - Client-side routing
- **Firebase 10.7.0** - Backend services
  - **Firebase Auth** - User authentication
  - **Firestore** - Real-time database
  - **Cloud Functions** - Serverless functions
  - **Hosting** - Static site hosting

### Backend
- **Express.js 5.2.1** - REST API framework
- **Firebase Admin SDK 13.7.0** - Firebase server integration
- **Nodemailer 8.0.3** - Email notifications
- **Google GenAI 1.50.1** - AI integration for features
- **node-cron 4.2.1** - Scheduled tasks
- **CORS 2.8.6** - Cross-origin handling

### Cloud Functions
- **Firebase Functions 4.9.0** - Serverless compute
- **Firebase Admin 10.3.0** - Admin SDK
- **Nodemailer 8.0.4** - Email service
- **Node.js 24** - Runtime

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ installed
- **npm** or **yarn**
- **Firebase Account** with a project created
- **Firebase CLI** installed globally (`npm install -g firebase-tools`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajamannar-t/collegehub.git
   cd collegehub-frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install Cloud Functions dependencies**
   ```bash
   cd functions
   npm install
   cd ..
   ```

### Configuration

1. **Firebase Setup**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Set up Cloud Functions

2. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

3. **Backend Environment** (`backend/.env`)
   ```env
   PORT=5001
   FIREBASE_PROJECT_ID=your_project_id
   GOOGLE_GENAI_API_KEY=your_genai_key
   SMTP_USER=your_email
   SMTP_PASSWORD=your_password
   ```

### Running the Application

#### Development Mode

1. **Start frontend (React dev server)**
   ```bash
   npm start
   ```
   Frontend runs at `http://localhost:3000`

2. **Start backend (Express API)**
   ```bash
   cd backend
   npm start
   ```
   Backend runs at `http://localhost:5001`

3. **Start Firebase emulator** (optional)
   ```bash
   firebase emulators:start
   ```

#### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy
   ```

## 🔐 Authentication & Authorization

### User Roles
- **Student** - Access to events, academics, and personal profile
- **Club President** - Event management and club operations
- **Administrator** - Full system management

### Login Credentials (Demo)
```
Student:     email@pragati.ac.in + any password
Admin:       admin-email + any password
Club Pres:   club-email + any password
```

**Note:** Domain validation for students: `@pragati.ac.in` (configurable in `AuthContext.jsx`)

## 📱 Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Landing | Landing page |
| `/login/student` | Login | Student login |
| `/login/admin` | Login | Admin login |
| `/login/club` | Login | Club President login |

### Student Routes (`/student/`)
| Route | Component | Description |
|-------|-----------|-------------|
| `/home` | Home | Event feed |
| `/timetable` | Timetable | Class schedule |
| `/syllabus` | Syllabus | Course materials |
| `/exam-schedule` | Exams | Exam dates |
| `/my-registrations` | MyRegistrations | Registered events |
| `/profile` | Profile | User profile |
| `/notifications` | Notifications | Event updates |
| `/staff-directory` | StaffDirectory | Staff contacts |

### Admin Routes (`/admin/`)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | AdminDashboard | System overview |
| `/approve-events` | AdminApproveEvents | Event approval |
| `/timetable` | AdminTimetable | Manage timetables |
| `/syllabus` | AdminSyllabus | Manage syllabus |
| `/students` | AdminStudentsList | Student management |
| `/add-club` | AddClub | Club management |

### Club Routes (`/club/`)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | ClubDashboard | Club overview |
| `/post-event` | ClubPostEvent | Create event |
| `/registrations` | ClubRegistrations | Manage attendees |
| `/request-badge` | RequestBadge | Request badge |

## 💾 Firestore Database Schema

### Collections
- **users** - User profiles with role and metadata
- **events** - Event documents with details
- **registrations** - Event registration records
- **clubs** - Club information
- **notifications** - Notification logs
- **badge_requests** - Club badge requests

## 🔧 Backend API

The Express backend provides REST endpoints for:
- User management
- Event CRUD operations
- Registration handling
- Email notifications
- Cloud Functions integration
- Scheduled tasks (via node-cron)

## 📧 Email Notifications

Configured via **Nodemailer** with support for:
- Event creation notifications
- Registration confirmations
- Badge approval emails
- Broadcast messages

## 🤖 AI Integration

Google GenAI integration for:
- Smart event recommendations
- Content generation
- Query assistance

## 📦 Deployment

### Deploy to Firebase Hosting
```bash
npm run build
firebase deploy
```

### Deploy Cloud Functions
```bash
firebase deploy --only functions
```

### Deploy Backend (Express)
Options:
- **Heroku** - `git push heroku main`
- **Google Cloud Run** - `gcloud run deploy`
- **Cloud Functions** - `firebase deploy --only functions`
- **AppEngine** - Deploy as a managed application

## 🧪 Testing

```bash
npm test
```

## 📝 Available Scripts

### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (⚠️ irreversible)

### Backend
- `npm start` - Start Express server
- `npm test` - Run tests

### Functions
- `npm run serve` - Start emulator
- `npm start` - Firebase shell
- `npm run deploy` - Deploy functions
- `npm run logs` - View function logs

## 🎨 Design System

- **Fonts**: Syne (headers) + DM Sans (body)
- **Custom CSS** - No UI frameworks, full control over design
- **Global Styles** - `src/index.css`
- **Color Scheme** - Defined as CSS variables
- **Responsive Design** - Mobile-first approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Rajamannar** - [GitHub](https://github.com/rajamannar-t)

## 🆘 Support

For issues, questions, or suggestions:
- Open an [GitHub Issue](https://github.com/rajamannar-t/collegehub/issues)
- Check existing documentation
- Review Firebase documentation

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with Google Calendar
- [ ] Video call support for events
- [ ] Social features (comments, likes)
- [ ] Advanced search and filtering
- [ ] Dark mode
- [ ] Multilingual support

## 🔗 Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Documentation](https://expressjs.com)
- [React Router Documentation](https://reactrouter.com)

---

**⭐ If you find this project helpful, please give it a star!**
