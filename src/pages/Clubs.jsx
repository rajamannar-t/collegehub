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
  <div style={{ padding: 20 }}>

    <PageHeader 
      title="Clubs" 
      subtitle="Explore and join clubs in your college"
    />

    {/* EMPTY STATE */}
    {clubs.length === 0 && (
      <div className="form-card" style={{ textAlign: "center" }}>
        No clubs available
      </div>
    )}

    {/* CLUB GRID */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 20,
        marginTop: 20
      }}
    >

      {clubs.map(club => {

        const myReq = myRequests.find(r => r.clubId === club.id);

        return (
          <div
            key={club.id}
            className="form-card"
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 180
            }}
          >

            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {club.name}
              </div>

              <div style={{ color: "#666", marginTop: 6 }}>
                {club.description}
              </div>

              <div style={{ marginTop: 8, fontSize: 13 }}>
                Department: <b>{club.department}</b>
              </div>
            </div>

            <div style={{ marginTop: 15 }}>
              {myReq ? (
                <button className="btn btn-sm">
                  {myReq.status === "pending" && "⏳ Pending"}
                  {myReq.status === "approved" && "✅ Joined"}
                  {myReq.status === "rejected" && "❌ Rejected"}
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleJoin(club)}
                >
                  Join Club
                </button>
              )}
            </div>

          </div>
        );
      })}

    </div>

  </div>
);
}