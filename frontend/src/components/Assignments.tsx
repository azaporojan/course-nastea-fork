import { useEffect, useState } from "react";
import { Assignment, Course } from "../types";
import * as api from "../api";
import { ApiError } from "../api";
import { Badge, Btn, Empty, ErrorBar, Field, Input, Modal, PageHeader, SearchBar, Select, Spinner, Table, Td, Th, Tr, Textarea } from "./ui";

type Form = { title: string; description: string; dueDate: string; courseId: string };
type FE = Partial<Record<keyof Form, string>>;
const blank: Form = { title: "", description: "", dueDate: "", courseId: "" };

function validate(f: Form): FE {
  const e: FE = {};
  if (!f.title.trim()) e.title    = "Required.";
  if (!f.courseId)     e.courseId = "Please select a course.";
  return e;
}

function dueBadge(due: string | null): { text: string; color: "green" | "yellow" | "red" | "gray" } {
  if (!due) return { text: "No deadline", color: "gray" };
  const diff = Math.ceil((new Date(due).getTime() - Date.now()) / 86400000);
  if (diff < 0)   return { text: "Overdue",       color: "red" };
  if (diff === 0) return { text: "Due today",     color: "red" };
  if (diff <= 3)  return { text: `${diff}d left`, color: "yellow" };
  return { text: `${diff}d left`, color: "green" };
}

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses]         = useState<Course[]>([]);
  const [search, setSearch]           = useState("");
  const [modal, setModal]             = useState<null | "add" | Assignment>(null);
  const [form, setForm]               = useState<Form>(blank);
  const [fe, setFe]                   = useState<FE>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.getAssignments(), api.getCourses()])
      .then(([a, c]) => { setAssignments(a); setCourses(c); })
      .catch((e: ApiError) => setServerError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const courseName = (id: number | null) => courses.find(c => c.id === id)?.name ?? "—";
  const filtered = assignments.filter(a =>
    `${a.title} ${a.description}`.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setFe(prev => ({ ...prev, [k]: undefined }));
    setServerError("");
  };

  const openAdd  = () => { setForm(blank); setFe({}); setServerError(""); setModal("add"); };
  const openEdit = (a: Assignment) => {
    setForm({ title: a.title, description: a.description, dueDate: a.dueDate ?? "", courseId: String(a.courseId ?? "") });
    setFe({}); setServerError(""); setModal(a);
  };

  const save = async () => {
    const errors = validate(form);
    if (Object.keys(errors).length) { setFe(errors); return; }
    const body = { title: form.title.trim(), description: form.description.trim(), dueDate: form.dueDate || null, courseId: Number(form.courseId) };
    try {
      modal === "add" ? await api.createAssignment(body) : await api.updateAssignment((modal as Assignment).id, body);
      setModal(null); load();
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.fields).length) setFe(e.fields as FE);
      else setServerError(e instanceof ApiError ? e.message : "Unexpected error.");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this assignment?")) return;
    try { await api.deleteAssignment(id); load(); }
    catch (e) { alert(e instanceof ApiError ? e.message : "Delete failed."); }
  };

  return (
    <div>
      <PageHeader title="Assignments" count={filtered.length} action={<Btn onClick={openAdd}>+ Add assignment</Btn>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search assignments…" />

      {loading ? <Spinner /> : (
        <Table>
          <thead><tr><Th>Title</Th><Th>Course</Th><Th>Due date</Th><Th>Status</Th><Th children={undefined} /></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={5}><Empty label="No assignments yet." /></td></tr>
              : filtered.map(a => {
                  const { text, color } = dueBadge(a.dueDate);
                  return (
                    <Tr key={a.id}>
                      <Td>
                        <div className="font-medium">{a.title}</div>
                        {a.description && <div className="text-xs text-zinc-400 mt-0.5 truncate max-w-[220px]">{a.description}</div>}
                      </Td>
                      <Td className="text-zinc-500">{courseName(a.courseId)}</Td>
                      <Td className="text-zinc-500">{a.dueDate ?? "—"}</Td>
                      <Td><Badge text={text} color={color} /></Td>
                      <Td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Btn variant="ghost" size="sm" onClick={() => openEdit(a)}>Edit</Btn>
                          <Btn variant="danger" size="sm" onClick={() => remove(a.id)}>Delete</Btn>
                        </div>
                      </Td>
                    </Tr>
                  );
                })
            }
          </tbody>
        </Table>
      )}

      {modal && (
        <Modal title={modal === "add" ? "New assignment" : "Edit assignment"} onClose={() => setModal(null)}>
          {serverError && <ErrorBar message={serverError} />}
          <Field label="Title" error={fe.title}>
            <Input value={form.title} onChange={setField("title")} placeholder="e.g. Lab #3 — Sorting" error={!!fe.title} />
          </Field>
          <Field label="Description (optional)">
            <Textarea value={form.description} onChange={setField("description")} placeholder="What students need to do…" />
          </Field>
          <Field label="Due date (optional)">
            <Input type="date" value={form.dueDate} onChange={setField("dueDate")} />
          </Field>
          <Field label="Course" error={fe.courseId}>
            <Select value={form.courseId} onChange={setField("courseId")} error={!!fe.courseId}>
              <option value="">— select course —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
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
