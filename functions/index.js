const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// 📧 OUTLOOK CONFIG (or Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "your_@pragat.ac.in",   // 🔴 your email
    pass: "your_app_password"         // 🔴 app password
  }
});

// ⏰ RUN EVERY DAY
exports.examReminder = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {

    try {

      const now = new Date();

      const examsSnapshot = await db.collection("exams").get();
      const usersSnapshot = await db.collection("users").get();

      const users = usersSnapshot.docs.map(doc => doc.data());

      for (let examDoc of examsSnapshot.docs) {

        const exam = examDoc.data();

        const examDate = new Date(exam.date);

        const diffTime = examDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
              from: "CollegeHub <your_email@outlook.com>",
              to: user.email,
              subject: "📢 Exam in 1 Week",
              text: `Hello ${user.name || "Student"},
              
Your exam "${exam.title}" is in 7 days.

📅 Date: ${examDate.toLocaleString()}

Prepare well!

- CollegeHub`
            });
          }

          await examDoc.ref.update({ notified7: true });
        }

        // 🔔 3 DAY REMINDER
        if (diffDays === 3 && !exam.notified3) {

          for (let user of targetUsers) {

            if (!user.email) continue;

            await transporter.sendMail({
              from: "CollegeHub <your_email@outlook.com>",
              to: user.email,
              subject: "⚠️ Exam in 3 Days",
              text: `Hello ${user.name || "Student"},
              
Your exam "${exam.title}" is in 3 days.

📅 Date: ${examDate.toLocaleString()}

Revise all topics!

- CollegeHub`
            });
          }

          await examDoc.ref.update({ notified3: true });
        }

      }

      console.log("✅ Reminder check completed");
      return null;

    } catch (err) {
      console.error("❌ Error:", err);
      return null;
    }
  });