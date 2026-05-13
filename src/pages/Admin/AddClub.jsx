import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { PageHeader } from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

export default function AddClub() {
  const { profile } = useAuth();
  
  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const handleAdd = async () => {

    if (!form.name || !form.description || !profile?.branch) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "clubs"), {
      ...form,
      department: profile.branch, // ✅ rigidly assigned to HOD's branch
      createdAt: Date.now()
    });

    alert("Club added ✅");

    setForm({
      name: "",
      description: ""
    });
  };

  return (
    <div>

      <PageHeader
        title="Add Club"
        subtitle="Create and manage clubs"
      />

      <div className="form-card">

        {/* Club Name */}
        <div className="form-row">
          <label className="form-label">Club Name</label>
          <input
            className="form-input"
            placeholder="e.g. Coding Club"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="form-row">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            placeholder="About the club"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Department (READ ONLY FOR HOD) */}
        <div className="form-row">
          <label className="form-label">Department (HOD Locked)</label>
          <select
            className="form-select"
            value={profile?.branch || ""}
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          >
            <option value={profile?.branch || ""}>{profile?.branch || "Loading..."}</option>
          </select>
        </div>

        {/* Button */}
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add Club
        </button>

      </div>

    </div>
  );
}