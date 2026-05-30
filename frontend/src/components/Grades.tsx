import { useEffect, useState } from "react";
import { Grade, Student, Course } from "../types";
import * as api from "../api";
import { ApiError } from "../api";
import { Badge, Btn, Empty, ErrorBar, Field, Input, Modal, SearchBar, Select, Spinner, Table, Td, Th, Tr, useConfirm } from "./ui";

type Form = { value: string; studentId: string; courseId: string; date: string };
type FE = Partial<Record<keyof Form, string>>;
const today = new Date().toISOString().slice(0, 10);
const blank: Form = { value: "", studentId: "", courseId: "", date: today };

function validate(f: Form): FE {
  const e: FE = {};
  if (!f.studentId) e.studentId = "Please select a student.";
  if (!f.courseId)  e.courseId  = "Please select a course.";
  if (!f.date)      e.date      = "Required.";
  if (!f.value.trim()) {
    e.value = "Required.";
  } else {
    const v = Number(f.value);
    if (!Number.isInteger(v))  e.value = "Must be a whole number.";
    else if (v < 1 || v > 10) e.value = "Must be between 1 and 10.";
  }
  return e;
}

const gradeColor = (v: number) => (v >= 8 ? "green" : v >= 5 ? "yellow" : "red") as "green" | "yellow" | "red";

export default function Grades() {
  const [grades, setGrades]     = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses]   = useState<Course[]>([]);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<null | "add" | Grade>(null);
  const [form, setForm]         = useState<Form>(blank);
  const [fe, setFe]             = useState<FE>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]   = useState(true);
  const { confirm, dialog }     = useConfirm();

  const load = () => {
    setLoading(true);
    Promise.all([api.getGrades(), api.getStudents(), api.getCourses()])
      .then(([g, s, c]) => { setGrades(g); setStudents(s); setCourses(c); })
      .catch((e: ApiError) => setServerError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const sName = (id: number | null) => { const s = students.find(x => x.id === id); return s ? `${s.firstName} ${s.lastName}` : "—"; };
  const cName = (id: number | null) => courses.find(x => x.id === id)?.name ?? "—";
  const filtered = grades.filter(g =>
    `${sName(g.studentId)} ${cName(g.courseId)}`.toLowerCase().includes(search.toLowerCase())
  );
  const avg = filtered.length ? (filtered.reduce((s, g) => s + g.value, 0) / filtered.length).toFixed(1) : null;

  const setField = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setFe(prev => ({ ...prev, [k]: undefined }));
    setServerError("");
  };

  const openAdd  = () => { setForm(blank); setFe({}); setServerError(""); setModal("add"); };
  const openEdit = (g: Grade) => {
    setForm({ value: String(g.value), studentId: String(g.studentId ?? ""), courseId: String(g.courseId ?? ""), date: g.date });
    setFe({}); setServerError(""); setModal(g);
  };

  const save = async () => {
    const errors = validate(form);
    if (Object.keys(errors).length) { setFe(errors); return; }
    const body = { value: Number(form.value), studentId: Number(form.studentId), courseId: Number(form.courseId), date: form.date };
    try {
      modal === "add" ? await api.createGrade(body) : await api.updateGrade((modal as Grade).id, body);
      setModal(null); load();
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.fields).length) setFe(e.fields as FE);
      else setServerError(e instanceof ApiError ? e.message : "Unexpected error.");
    }
  };

  const remove = async (g: Grade) => {
    const ok = await confirm(
      "Delete grade",
      `Delete grade ${g.value}/10 for ${sName(g.studentId)} in ${cName(g.courseId)}?`,
      "Delete",
      "danger"
    );
    if (!ok) return;
    try { await api.deleteGrade(g.id); load(); }
    catch (e) { setServerError(e instanceof ApiError ? e.message : "Delete failed."); }
  };

  return (
    <div>
      {dialog}
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold text-zinc-900">Grades</h1>
          <span className="text-sm text-zinc-400">{filtered.length}</span>
          {avg && <span className="text-sm text-zinc-400">· avg <span className="font-medium text-zinc-700">{avg}</span></span>}
        </div>
        <Btn onClick={openAdd}>+ Add grade</Btn>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by student or course…" />

      {loading ? <Spinner /> : (
        <Table>
          <thead><tr><Th>Student</Th><Th>Course</Th><Th>Grade</Th><Th>Date</Th><Th children={undefined} /></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={5}><Empty label="No grades yet." /></td></tr>
              : filtered.map(g => (
                <Tr key={g.id}>
                  <Td><span className="font-medium">{sName(g.studentId)}</span></Td>
                  <Td className="text-zinc-500">{cName(g.courseId)}</Td>
                  <Td><Badge text={String(g.value)} color={gradeColor(g.value)} /></Td>
                  <Td className="text-zinc-400">{g.date}</Td>
                  <Td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Btn variant="ghost" size="sm" onClick={() => openEdit(g)}>Edit</Btn>
                      <Btn variant="danger" size="sm" onClick={() => remove(g)}>Delete</Btn>
                    </div>
                  </Td>
                </Tr>
              ))
            }
          </tbody>
        </Table>
      )}

      {modal && (
        <Modal title={modal === "add" ? "New grade" : "Edit grade"} onClose={() => setModal(null)}>
          {serverError && <ErrorBar message={serverError} />}
          <Field label="Student" error={fe.studentId}>
            <Select value={form.studentId} onChange={setField("studentId")} error={!!fe.studentId}>
              <option value="">— select student —</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </Select>
          </Field>
          <Field label="Course" error={fe.courseId}>
            <Select value={form.courseId} onChange={setField("courseId")} error={!!fe.courseId}>
              <option value="">— select course —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <Field label="Grade (1–10)" error={fe.value}>
            <Input type="number" min={1} max={10} step={1} value={form.value} onChange={setField("value")} placeholder="e.g. 8" error={!!fe.value} />
          </Field>
          <Field label="Date" error={fe.date}>
            <Input type="date" value={form.date} onChange={setField("date")} error={!!fe.date} />
          </Field>
          <div className="flex gap-2 justify-end pt-1">
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
