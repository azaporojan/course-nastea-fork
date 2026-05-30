import { useState } from "react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const initialStudents = [
  { id: 1, name: "Alice Johnson", email: "alice@uni.edu", group: "CS-101", gpa: 3.8, status: "Active" },
  { id: 2, name: "Bob Martinez", email: "bob@uni.edu", group: "CS-101", gpa: 3.2, status: "Active" },
  { id: 3, name: "Clara Nguyen", email: "clara@uni.edu", group: "CS-102", gpa: 3.9, status: "Active" },
  { id: 4, name: "David Kim", email: "david@uni.edu", group: "CS-102", gpa: 2.7, status: "Inactive" },
  { id: 5, name: "Eva Popescu", email: "eva@uni.edu", group: "CS-103", gpa: 3.5, status: "Active" },
];

const initialActivities = [
  { id: 1, title: "Math Lecture", type: "Lecture", date: "2026-06-02", group: "CS-101", instructor: "Dr. Smith", status: "Scheduled" },
  { id: 2, title: "Programming Lab", type: "Lab", date: "2026-06-03", group: "CS-102", instructor: "Prof. Lee", status: "Scheduled" },
  { id: 3, title: "Physics Seminar", type: "Seminar", date: "2026-05-28", group: "CS-103", instructor: "Dr. Brown", status: "Completed" },
  { id: 4, title: "Database Workshop", type: "Workshop", date: "2026-06-05", group: "CS-101", instructor: "Prof. Garcia", status: "Scheduled" },
  { id: 5, title: "Algorithm Exam", type: "Exam", date: "2026-05-25", group: "CS-102", instructor: "Dr. Wilson", status: "Completed" },
];

const initialAttendance = [
  { id: 1, studentName: "Alice Johnson", activity: "Math Lecture", date: "2026-05-20", status: "Present", grade: 9.5 },
  { id: 2, studentName: "Bob Martinez", activity: "Math Lecture", date: "2026-05-20", status: "Absent", grade: null },
  { id: 3, studentName: "Clara Nguyen", activity: "Physics Seminar", date: "2026-05-28", status: "Present", grade: 10 },
  { id: 4, studentName: "David Kim", activity: "Algorithm Exam", date: "2026-05-25", status: "Present", grade: 6.5 },
  { id: 5, studentName: "Eva Popescu", activity: "Database Workshop", date: "2026-06-05", status: "Present", grade: 8.0 },
  { id: 6, studentName: "Alice Johnson", activity: "Programming Lab", date: "2026-06-03", status: "Late", grade: 8.5 },
];

// ─── Icons (inline SVG) ────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    students: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    activities: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    attendance: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name]}
    </svg>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color }) => (
  <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,.08)", borderLeft: `4px solid ${color}` }}>
    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 32, fontWeight: 700, color: "#111827" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{sub}</div>}
  </div>
);

// ─── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ text, type }) => {
  const colors = {
    Active: { bg: "#d1fae5", text: "#065f46" },
    Inactive: { bg: "#fee2e2", text: "#991b1b" },
    Scheduled: { bg: "#dbeafe", text: "#1e40af" },
    Completed: { bg: "#d1fae5", text: "#065f46" },
    Present: { bg: "#d1fae5", text: "#065f46" },
    Absent: { bg: "#fee2e2", text: "#991b1b" },
    Late: { bg: "#fef3c7", text: "#92400e" },
    Lecture: { bg: "#ede9fe", text: "#4c1d95" },
    Lab: { bg: "#dbeafe", text: "#1e40af" },
    Seminar: { bg: "#fce7f3", text: "#831843" },
    Workshop: { bg: "#fef3c7", text: "#92400e" },
    Exam: { bg: "#fee2e2", text: "#991b1b" },
  };
  const c = colors[text] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
      {text}
    </span>
  );
};

// ─── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
    <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 480, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h3>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#6b7280" }}>
          <Icon name="close" size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8,
  fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
const labelStyle = { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 };
const btnPrimary = {
  background: "#6366f1", color: "#fff", border: "none", borderRadius: 8,
  padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
};
const btnSecondary = {
  background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8,
  padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
};

// ─── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = ({ students, activities, attendance }) => {
  const active = students.filter(s => s.status === "Active").length;
  const avgGpa = (students.reduce((a, s) => a + s.gpa, 0) / students.length).toFixed(2);
  const scheduled = activities.filter(a => a.status === "Scheduled").length;
  const presentRate = Math.round(attendance.filter(a => a.status === "Present").length / attendance.length * 100);

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 700, color: "#111827" }}>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Students" value={students.length} sub={`${active} active`} color="#6366f1" />
        <StatCard label="Average GPA" value={avgGpa} sub="across all students" color="#10b981" />
        <StatCard label="Upcoming Activities" value={scheduled} sub="scheduled" color="#f59e0b" />
        <StatCard label="Attendance Rate" value={`${presentRate}%`} sub="present overall" color="#3b82f6" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Students */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Recent Students</h3>
          {students.slice(0, 4).map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.group}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: "#6366f1", fontSize: 14 }}>GPA {s.gpa}</div>
                <Badge text={s.status} />
              </div>
            </div>
          ))}
        </div>
        {/* Upcoming Activities */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Upcoming Activities</h3>
          {activities.filter(a => a.status === "Scheduled").map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{a.instructor} · {a.group}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{a.date}</div>
                <Badge text={a.type} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Students ──────────────────────────────────────────────────────────────────
const Students = ({ students, setStudents }) => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | student obj
  const [form, setForm] = useState({ name: "", email: "", group: "", gpa: "", status: "Active" });

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.group.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm({ name: "", email: "", group: "", gpa: "", status: "Active" }); setModal("add"); };
  const openEdit = (s) => { setForm({ ...s, gpa: String(s.gpa) }); setModal(s); };

  const save = () => {
    if (!form.name || !form.email) return;
    if (modal === "add") {
      setStudents(prev => [...prev, { ...form, id: Date.now(), gpa: parseFloat(form.gpa) || 0 }]);
    } else {
      setStudents(prev => prev.map(s => s.id === modal.id ? { ...form, id: s.id, gpa: parseFloat(form.gpa) || 0 } : s));
    }
    setModal(null);
  };

  const remove = (id) => setStudents(prev => prev.filter(s => s.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Students</h2>
        <button style={btnPrimary} onClick={openAdd}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="plus" size={16} /> Add Student</span>
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
          <Icon name="search" size={16} />
        </span>
        <input placeholder="Search by name or group..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 36 }} />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Name", "Email", "Group", "GPA", "Status", "Actions"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>{s.name}</td>
                <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 14 }}>{s.email}</td>
                <td style={{ padding: "14px 16px", color: "#374151", fontSize: 14 }}>{s.group}</td>
                <td style={{ padding: "14px 16px", fontWeight: 700, color: s.gpa >= 3.5 ? "#059669" : s.gpa >= 2.5 ? "#d97706" : "#dc2626" }}>{s.gpa}</td>
                <td style={{ padding: "14px 16px" }}><Badge text={s.status} /></td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(s)} style={{ border: "none", background: "#ede9fe", color: "#7c3aed", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>
                      <Icon name="edit" size={14} />
                    </button>
                    <button onClick={() => remove(s.id)} style={{ border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No students found.</div>}
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add Student" : "Edit Student"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gap: 14 }}>
            {[["Full Name", "name", "text"], ["Email", "email", "email"], ["Group", "group", "text"], ["GPA", "gpa", "number"]].map(([lbl, key, type]) => (
              <div key={key}>
                <label style={labelStyle}>{lbl}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button style={btnSecondary} onClick={() => setModal(null)}>Cancel</button>
              <button style={btnPrimary} onClick={save}>Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Activities ────────────────────────────────────────────────────────────────
const Activities = ({ activities, setActivities }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", type: "Lecture", date: "", group: "", instructor: "", status: "Scheduled" });

  const types = ["All", "Lecture", "Lab", "Seminar", "Workshop", "Exam"];
  const filtered = activities.filter(a =>
    (filter === "All" || a.type === filter) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || a.group.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setForm({ title: "", type: "Lecture", date: "", group: "", instructor: "", status: "Scheduled" }); setModal("add"); };
  const openEdit = (a) => { setForm({ ...a }); setModal(a); };

  const save = () => {
    if (!form.title) return;
    if (modal === "add") setActivities(prev => [...prev, { ...form, id: Date.now() }]);
    else setActivities(prev => prev.map(a => a.id === modal.id ? { ...form, id: a.id } : a));
    setModal(null);
  };

  const remove = (id) => setActivities(prev => prev.filter(a => a.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Activities</h2>
        <button style={btnPrimary} onClick={openAdd}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="plus" size={16} /> Add Activity</span>
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={16} /></span>
          <input placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ border: "none", borderRadius: 20, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: filter === t ? "#6366f1" : "#f3f4f6", color: filter === t ? "#fff" : "#374151" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {filtered.map(a => (
          <div key={a.id} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.08)", borderTop: `3px solid ${a.status === "Completed" ? "#10b981" : "#6366f1"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <Badge text={a.type} />
              <Badge text={a.status} />
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#111827" }}>{a.title}</h3>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>👤 {a.instructor}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>👥 {a.group}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>📅 {a.date}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEdit(a)} style={{ flex: 1, border: "1.5px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "7px", cursor: "pointer", color: "#7c3aed", fontWeight: 600, fontSize: 13 }}>
                Edit
              </button>
              <button onClick={() => remove(a.id)} style={{ border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 8, padding: "7px 12px", cursor: "pointer" }}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#9ca3af", padding: 32 }}>No activities found.</div>}
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add Activity" : "Edit Activity"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gap: 14 }}>
            {[["Title", "title", "text"], ["Date", "date", "date"], ["Group", "group", "text"], ["Instructor", "instructor", "text"]].map(([lbl, key, type]) => (
              <div key={key}>
                <label style={labelStyle}>{lbl}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                {["Lecture", "Lab", "Seminar", "Workshop", "Exam"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                <option>Scheduled</option><option>Completed</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button style={btnSecondary} onClick={() => setModal(null)}>Cancel</button>
              <button style={btnPrimary} onClick={save}>Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Attendance ────────────────────────────────────────────────────────────────
const Attendance = ({ attendance, setAttendance }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ studentName: "", activity: "", date: "", status: "Present", grade: "" });

  const statuses = ["All", "Present", "Absent", "Late"];
  const filtered = attendance.filter(a =>
    (filter === "All" || a.status === filter) &&
    (a.studentName.toLowerCase().includes(search.toLowerCase()) || a.activity.toLowerCase().includes(search.toLowerCase()))
  );

  const presentCount = attendance.filter(a => a.status === "Present").length;
  const absentCount = attendance.filter(a => a.status === "Absent").length;
  const lateCount = attendance.filter(a => a.status === "Late").length;
  const avgGrade = (attendance.filter(a => a.grade).reduce((s, a) => s + a.grade, 0) / attendance.filter(a => a.grade).length).toFixed(1);

  const openAdd = () => { setForm({ studentName: "", activity: "", date: "", status: "Present", grade: "" }); setModal("add"); };
  const openEdit = (a) => { setForm({ ...a, grade: a.grade ?? "" }); setModal(a); };

  const save = () => {
    if (!form.studentName || !form.activity) return;
    const entry = { ...form, grade: form.grade !== "" ? parseFloat(form.grade) : null };
    if (modal === "add") setAttendance(prev => [...prev, { ...entry, id: Date.now() }]);
    else setAttendance(prev => prev.map(a => a.id === modal.id ? { ...entry, id: a.id } : a));
    setModal(null);
  };

  const remove = (id) => setAttendance(prev => prev.filter(a => a.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Attendance & Grades</h2>
        <button style={btnPrimary} onClick={openAdd}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="plus" size={16} /> Add Record</span>
        </button>
      </div>

      {/* Mini stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Present", val: presentCount, color: "#10b981" },
          { label: "Absent", val: absentCount, color: "#ef4444" },
          { label: "Late", val: lateCount, color: "#f59e0b" },
          { label: "Avg Grade", val: avgGrade, color: "#6366f1" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.08)", borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={16} /></span>
          <input placeholder="Search by student or activity..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ border: "none", borderRadius: 20, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: filter === s ? "#6366f1" : "#f3f4f6", color: filter === s ? "#fff" : "#374151" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Student", "Activity", "Date", "Status", "Grade", "Actions"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "13px 16px", fontWeight: 600, color: "#111827" }}>{a.studentName}</td>
                <td style={{ padding: "13px 16px", color: "#374151", fontSize: 14 }}>{a.activity}</td>
                <td style={{ padding: "13px 16px", color: "#6b7280", fontSize: 14 }}>{a.date}</td>
                <td style={{ padding: "13px 16px" }}><Badge text={a.status} /></td>
                <td style={{ padding: "13px 16px", fontWeight: 700, color: a.grade >= 8 ? "#059669" : a.grade >= 5 ? "#d97706" : a.grade ? "#dc2626" : "#9ca3af" }}>
                  {a.grade ?? "—"}
                </td>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(a)} style={{ border: "none", background: "#ede9fe", color: "#7c3aed", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>
                      <Icon name="edit" size={14} />
                    </button>
                    <button onClick={() => remove(a.id)} style={{ border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No records found.</div>}
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add Attendance Record" : "Edit Record"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gap: 14 }}>
            {[["Student Name", "studentName", "text"], ["Activity", "activity", "text"], ["Date", "date", "date"], ["Grade (0–10)", "grade", "number"]].map(([lbl, key, type]) => (
              <div key={key}>
                <label style={labelStyle}>{lbl}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                <option>Present</option><option>Absent</option><option>Late</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button style={btnSecondary} onClick={() => setModal(null)}>Cancel</button>
              <button style={btnPrimary} onClick={save}>Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [students, setStudents] = useState(initialStudents);
  const [activities, setActivities] = useState(initialActivities);
  const [attendance, setAttendance] = useState(initialAttendance);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "students", label: "Students", icon: "students" },
    { id: "activities", label: "Activities", icon: "activities" },
    { id: "attendance", label: "Attendance & Grades", icon: "attendance" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "#f3f4f6" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "#1e1b4b", color: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "28px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="users" size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>EduTrack</div>
              <div style={{ fontSize: 11, color: "#a5b4fc" }}>Student Manager</div>
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  border: "none", borderRadius: 10, cursor: "pointer", textAlign: "left",
                  background: page === item.id ? "#6366f1" : "transparent",
                  color: page === item.id ? "#fff" : "#a5b4fc",
                  fontWeight: page === item.id ? 600 : 400, fontSize: 14, transition: "all .15s",
                }}>
                <Icon name={item.icon} size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
              <div style={{ fontSize: 11, color: "#a5b4fc" }}>admin@uni.edu</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>
          {page === "dashboard" && <Dashboard students={students} activities={activities} attendance={attendance} />}
          {page === "students" && <Students students={students} setStudents={setStudents} />}
          {page === "activities" && <Activities activities={activities} setActivities={setActivities} />}
          {page === "attendance" && <Attendance attendance={attendance} setAttendance={setAttendance} />}
        </div>
      </main>
    </div>
  );
}
