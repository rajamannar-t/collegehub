import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { PageHeader, EmptyState, InfoBox } from "../../components/Layout";

export const StaffDirectory = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "management")
      );
      const snapshot = await getDocs(q);
      const staffMembers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStaffList(staffMembers);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="page-container fade-in">
      <PageHeader
        title="College Staff Directory"
        subtitle="Identify and reach out to your Heads of Department and Management staff."
        route="Home > Staff Directory"
      />

      <InfoBox type="info" icon="ℹ️">
        Only approved management staff and Heads of Department are listed here. For general inquiries, email them at their listed college addresses.
      </InfoBox>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-3)" }}>
          Loading staff network...
        </div>
      ) : staffList.length === 0 ? (
        <EmptyState
          icon="👩‍🏫"
          title="No Staff Listed"
          subtitle="It looks like no management staff have registered yet."
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
            marginTop: "24px",
          }}
        >
          {staffList.map((staff) => (
            <div
              key={staff.id}
              style={{
                background: "var(--bg-1)",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)";
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                  boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)",
                }}
              >
                {getInitials(staff.name)}
              </div>
              <h3 style={{ margin: "0 0 8px 0", color: "var(--text-1)", fontSize: "20px" }}>
                {staff.name}
              </h3>
              
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "var(--primary-light)",
                  color: "white",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  opacity: 0.9
                }}
              >
                HOD • {staff.branch || "General"}
              </div>

              <div style={{ color: "var(--text-2)", fontSize: "14px", marginBottom: "8px" }}>
                <span style={{ marginRight: "8px" }}>📧</span>
                <a href={`mailto:${staff.email}`} style={{ color: "var(--primary)", textDecoration: "none" }}>
                  {staff.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
