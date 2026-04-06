import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { PageHeader } from "../../components/Layout";

export default function AddClub() {

  const [form, setForm] = useState({
    name: "",
    description: "",
    department: ""
  });

  const handleAdd = async () => {

    if (!form.name || !form.description || !form.department) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "clubs"), {
      ...form,
      createdAt: Date.now()
    });

    alert("Club added ✅");

    setForm({
      name: "",
      description: "",
      department: ""
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

        {/* Department */}
        <div className="form-row">
          <label className="form-label">Department</label>
          <select
            className="form-select"
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })}
          >
            <option value="">Select</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>EEE</option>
            <option>MECH</option>
            <option>CIVIL</option>
            <option>IT</option>
            <option>AI</option>
            <option>AIML</option>
            <option>DS</option>
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