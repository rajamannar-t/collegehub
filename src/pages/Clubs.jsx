import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/Layout";
import PublicNavbar from "../components/PublicNavbar";

export default function Clubs() {

  const { profile } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  // 🔥 FETCH CLUBS
  useEffect(() => {

    const fetchClubs = async () => {
      const snap = await getDocs(collection(db, "clubs"));

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("🔥 Clubs fetched:", data); // ✅ DEBUG

      setClubs(data);
    };

    fetchClubs();

  }, []);

  // 🔥 FETCH MY REQUESTS
  useEffect(() => {

    const fetchRequests = async () => {

      const snap = await getDocs(collection(db, "club_join_requests"));

      const data = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() })) // ✅ FIX (important)
        .filter(r => r.userId === profile?.uid);

      setMyRequests(data);
    };

    if (profile) fetchRequests();

  }, [profile]);

  // 🔥 JOIN FUNCTION (WITH DUPLICATE CHECK)
  const handleJoin = async (club) => {

    try {

      const q = query(
        collection(db, "club_join_requests"),
        where("clubId", "==", club.id),
        where("userId", "==", profile.uid)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        alert("Already requested ⚠️");
        return;
      }

      await addDoc(collection(db, "club_join_requests"), {
        clubId: club.id,
        clubName: club.name,
        userId: profile.uid,
        userName: profile.name,
        branch: profile.branch,
        semester: profile.semester,
        status: "pending",
        createdAt: Date.now()
      });

      alert("Request sent ✅");

      window.location.reload(); // ✅ refresh UI (temporary fix)

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="landing-page animate-fade" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <PublicNavbar />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <PageHeader 
          title="Clubs & Communities" 
          subtitle="Explore and join vibrant clubs in your college"
        />

        {/* EMPTY STATE */}
        {clubs.length === 0 && (
          <div className="form-card animate-slide delay-1" style={{ textAlign: "center", margin: "40px auto", maxWidth: 600, padding: 60 }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>🔭</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>No Clubs Found</h3>
            <p style={{ color: 'var(--text-2)' }}>It looks like there are no active clubs right now. Keep an eye out for interesting new communities coming soon!</p>
          </div>
        )}

    {/* CLUB GRID */}
    <div
      className="animate-slide delay-2"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 24,
        marginTop: 30
      }}
    >

      {clubs.map(club => {

        const myReq = myRequests.find(r => r.clubId === club.id);

        return (
          <div
            key={club.id}
            className="role-card"
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 220,
              background: "var(--surface)"
            }}
          >

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {club.icon || "✨"}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>
                    {club.name}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>
                    {club.department}
                  </div>
                </div>
              </div>

              <div style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.6 }}>
                {club.description}
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              {myReq ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: myReq.status === 'pending' ? 'var(--amber)' : myReq.status === 'approved' ? 'var(--green)' : 'var(--red)' }}>
                  {myReq.status === "pending" && "⏳ Request Pending"}
                  {myReq.status === "approved" && "✅ Member"}
                  {myReq.status === "rejected" && "❌ Request Rejected"}
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: 12, fontWeight: 600 }}
                  onClick={() => handleJoin(club)}
                >
                  Request to Join
                </button>
              )}
            </div>

          </div>
        );
      })}

    </div>

      </div>
    </div>
  );
}