require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin securely
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin Initialized successfully.");
} else {
  console.warn("⚠️ serviceAccountKey.json not found! Firebase operations will fail. Please place your Service Account JSON file in the backend folder.");
}

const db = admin.firestore?.() || null;

// 📧 OUTLOOK/GMAIL CONFIG
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.office365.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendReminders = async () => {
    if (!db) {
        console.log("Database not initialized, skipping reminder check.");
        return;
    }
    console.log("Running scheduled reminder check...");
    try {
      const now = new Date();
      const examsSnapshot = await db.collection("exams").get();
      const usersSnapshot = await db.collection("users").get();

      const users = usersSnapshot.docs.map(doc => doc.data());

      for (let examDoc of examsSnapshot.docs) {
        const exam = examDoc.data();
        if (!exam.date) continue;
        const examDate = new Date(exam.date);
        
        // Strip time segments to correctly capture pure day intervals
        const targetDate = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate());
        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffDays = Math.round((targetDate - todayDate) / (1000 * 60 * 60 * 24));

        // 🎯 FILTER STUDENTS
        const targetUsers = users.filter(
          u =>
            u.role === "student" &&
            u.branch === exam.branch &&
            Number(u.semester) === Number(exam.semester)
        );

        // 🔔 7 DAY REMINDER
        if (diffDays === 7 && !exam.notified7) {
          for (let user of targetUsers) {
            if (!user.email) continue;
            await transporter.sendMail({
              from: `"CollegeHub" <${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: `📢 Exam in 1 Week: ${exam.title}`,
              text: `Hello ${user.name || "Student"},\n\nYour exam "${exam.title}" is scheduled in exactly 7 days.\n\n📅 Date: ${examDate.toLocaleString()}\n\nPrepare well!\n\n- CollegeHub`
            });
          }
          await examDoc.ref.update({ notified7: true });
          console.log(`✅ Sent 7-day reminders for ${exam.title}`);
        }

        // 🔔 3 DAY REMINDER
        if (diffDays === 3 && !exam.notified3) {
          for (let user of targetUsers) {
            if (!user.email) continue;
            await transporter.sendMail({
              from: `"CollegeHub" <${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: `⚠️ Exam in 3 Days: ${exam.title}`,
              text: `Hello ${user.name || "Student"},\n\nThis is a quick reminder that your exam "${exam.title}" is in 3 days.\n\n📅 Date: ${examDate.toLocaleString()}\n\nRevise all topics completely!\n\n- CollegeHub`
            });
          }
          await examDoc.ref.update({ notified3: true });
          console.log(`✅ Sent 3-day reminders for ${exam.title}`);
        }
      }
      console.log("✅ Reminder check completed successfully");
    } catch (err) {
      console.error("❌ Error running reminder check:", err);
    }
};

// ⏰ RUN EVERY DAY at 8:00 AM
cron.schedule('0 8 * * *', () => {
    sendReminders();
}, {
    timezone: "Asia/Kolkata"
});

// Manual trigger API endpoint
app.get('/api/test-reminders', async (req, res) => {
    await sendReminders();
    res.json({ message: "Reminder check executed. Check backend console logs for details." });
});

// 🤖 AI CHATBOT ENDPOINT
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body; 
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Gemini API Key missing in backend" });
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        let liveDataContext = "";
        try {
            if (db) {
                // Fetch basic live data concurrently
                const [examsSnap, eventsSnap, clubsSnap] = await Promise.all([
                    db.collection("exams").get(),
                    db.collection("events").get(),
                    db.collection("clubs").get()
                ]);
                
                const exams = examsSnap.docs.map(d => Object.assign({id: d.id}, d.data()));
                const events = eventsSnap.docs.map(d => Object.assign({id: d.id}, d.data()));
                const clubs = clubsSnap.docs.map(d => Object.assign({id: d.id}, d.data()));

                liveDataContext = `\n\n--- LIVE COLLEGE DATA (Use this to answer queries) ---\n`;
                liveDataContext += `Exams: ${JSON.stringify(exams.map(e => ({ title: e.title, date: e.date, branch: e.branch })))}\n`;
                liveDataContext += `Events: ${JSON.stringify(events.map(e => ({ title: e.title, date: e.date, type: e.type, time: e.time })))}\n`;
                liveDataContext += `Clubs: ${JSON.stringify(clubs.map(c => ({ name: c.name, category: c.category, president: c.presidentInfo?.name || c.presidentName })))}\n`;
            }
        } catch (dbErr) {
            console.error("⚠️ Failed to fetch live data for AI context:", dbErr);
        }
        
        const contents = Array.isArray(messages) ? messages.map(m => ({
            role: m.role === 'bot' ? 'model' : 'user',
            parts: [{ text: m.text }]
        })) : [{ role: 'user', parts: [{ text: "Hello" }] }];
        
        const systemPrompt = `You are the CollegeHub Assistant, a friendly and helpful AI for a college management platform. You answer student questions about college events, scheduled exams, coding clubs, syllabus, and general queries in a concise, encouraging manner. Keep your answers brief, modern, and engaging with emojis.` + liveDataContext;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
            }
        });
        
        res.json({ reply: response.text });
    } catch (err) {
        console.error("❌ Chat API Error:", err);
        res.status(500).json({ error: "AI failed to respond. Please try again later." });
    }
});

app.get('/', (req, res) => {
    res.send("CollegeHub Reminder Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
});
