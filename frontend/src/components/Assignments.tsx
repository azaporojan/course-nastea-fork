import { useEffect, useState } from "react";
import { Assignment, Course, Student, Grade } from "../types";
import * as api from "../api";
import { ApiError } from "../api";
import { useAuth } from "../context/AuthContext";
import { Badge, Btn, Empty, ErrorBar, Field, Input, Modal, PageHeader, SearchBar, Select, Spinner, Table, Td, Th, Tr, Textarea, useConfirm } from "./ui";

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

const gradeColor = (v: number) => (v >= 8 ? "green" : v >= 5 ? "yellow" : "red") as "green" | "yellow" | "red";

// ── Assignment students modal ─────────────────────────────────────────────────
interface AssignmentStudentsModalProps {
  assignment: Assignment;
  course: Course | undefined;
  students: Student[];
  grades: Grade[];
  onClose: () => void;
}

function AssignmentStudentsModal({ assignment, course, students, grades, onClose }: AssignmentStudentsModalProps) {
  const courseGrades = grades.filter(g => g.courseId === assignment.courseId);
  const enrolled = students.filter(s => courseGrades.some(g => g.studentId === s.id));
  const gradedCount = enrolled.filter(s => courseGrades.find(g => g.studentId === s.id)).length;
  const { text: dueText, color: dueColor } = dueBadge(assignment.dueDate);

  return (
    <Modal title={assignment.title} onClose={onClose}>
      {/* meta */}
      <div className="flex flex-wrap gap-3 -mt-1 mb-4">
        {course && <span className="text-sm text-zinc-500">{course.name} · {course.teacher}</span>}
      </div>
      {/* stats row */}
      <div className="flex gap-3 mb-5 text-sm flex-wrap">
        <div className="bg-zinc-50 rounded-lg px-3 py-2">
          <span className="text-zinc-400">Deadline </span>
          <span className={`font-semibold ${dueColor === "red" ? "text-red-500" : dueColor === "yellow" ? "text-yellow-600" : "text-green-600"}`}>
            {assignment.dueDate ? `${assignment.dueDate} · ${dueText}` : "No deadline"}
          </span>
        </div>
        <div className="bg-zinc-50 rounded-lg px-3 py-2">
          <span className="text-zinc-400">Graded </span>
          <span className="font-semibold text-zinc-800">{gradedCount}/{enrolled.length}</span>
        </div>
      </div>

      {enrolled.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-6">No students in this course yet.</p>
      ) : (
        <div className="rounded-lg border border-zinc-100 overflow-hidden max-h-[55vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0">
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="text-left px-4 py-2.5 font-medium text-zinc-500">Student</th>
                <th className="text-left px-4 py-2.5 font-medium text-zinc-500">Group</th>
                <th className="text-left px-4 py-2.5 font-medium text-zinc-500">Status</th>
                <th className="text-left px-4 py-2.5 font-medium text-zinc-500">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {enrolled.map(s => {
                const grade = courseGrades.find(g => g.studentId === s.id);
                const isGraded = !!grade;
                return (
                  <tr key={s.id}>
                    <td className="px-4 py-2.5 font-medium text-zinc-800">{s.firstName} {s.lastName}</td>
                    <td className="px-4 py-2.5 text-zinc-500">{s.groupName}</td>
                    <td className="px-4 py-2.5">
                      {isGraded
                        ? <Badge text="Graded" color="green" />
                        : <Badge text="Pending" color="gray" />}
                    </td>
                    <td className="px-4 py-2.5">
                      {grade
                        ? <Badge text={`${grade.value}/10`} color={gradeColor(grade.value)} />
                        : <span className="text-zinc-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Btn variant="ghost" onClick={onClose}>Close</Btn>
      </div>
    </Modal>
  );
}

interface CourseStudentsModalProps {
  course: Course;
  students: Student[];
  grades: Grade[];
  onClose: () => void;
}

function CourseStudentsModal({ course, students, grades, onClose }: CourseStudentsModalProps) {
  const courseGrades = grades.filter(g => g.courseId === course.id);
  const enrolled = students.filter(s => courseGrades.some(g => g.studentId === s.id));

  return (
    <Modal title={course.name} onClose={onClose}>
      <p className="text-sm text-zinc-500 -mt-1 mb-4">{course.teacher} · {enrolled.length} student{enrolled.length !== 1 ? "s" : ""}</p>
      {enrolled.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-6">No students assigned yet.</p>
      ) : (
        <div className="rounded-lg border border-zinc-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="text-left px-4 py-2.5 font-medium text-zinc-500">Student</th>
                <th className="text-left px-4 py-2.5 font-medium text-zinc-500">Group</th>
                <th className="text-left px-4 py-2.5 font-medium text-zinc-500">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {enrolled.map(s => {
                const grade = courseGrades.find(g => g.studentId === s.id);
                return (
                  <tr key={s.id}>
                    <td className="px-4 py-2.5 font-medium text-zinc-800">{s.firstName} {s.lastName}</td>
                    <td className="px-4 py-2.5 text-zinc-500">{s.groupName}</td>
                    <td className="px-4 py-2.5">
                      {grade
                        ? <Badge text={`${grade.value}/10`} color={gradeColor(grade.value)} />
                        : <span className="text-zinc-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-end pt-4">
        <Btn variant="ghost" onClick={onClose}>Close</Btn>
      </div>
    </Modal>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses]         = useState<Course[]>([]);
  const [students, setStudents]       = useState<Student[]>([]);
  const [grades, setGrades]           = useState<Grade[]>([]);
  const [search, setSearch]           = useState("");
  const [modal, setModal]                   = useState<null | "add" | Assignment>(null);
  const [courseModal, setCourseModal]       = useState<Course | null>(null);
  const [assignmentModal, setAssignmentModal] = useState<Assignment | null>(null);
  const [form, setForm]               = useState<Form>(blank);
  const [fe, setFe]                   = useState<FE>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(true);
  const { confirm, dialog }           = useConfirm();
  const { isTeacher }                 = useAuth();

  const load = () => {
    setLoading(true);
    Promise.all([api.getAssignments(), api.getCourses(), api.getStudents(), api.getGrades()])
      .then(([a, c, s, g]) => { setAssignments(a); setCourses(c); setStudents(s); setGrades(g); })
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

  const openCourse = (courseId: number | null) => {
    if (!courseId) return;
    const c = courses.find(x => x.id === courseId);
    if (c) setCourseModal(c);
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

  const remove = async (a: Assignment) => {
    const ok = await confirm(
      "Delete assignment",
      `Are you sure you want to delete "${a.title}"?`,
      "Delete",
      "danger"
    );
    if (!ok) return;
    try { await api.deleteAssignment(a.id); load(); }
    catch (e) { setServerError(e instanceof ApiError ? e.message : "Delete failed."); }
  };

  return (
    <div>
      {dialog}

      {assignmentModal && (
        <AssignmentStudentsModal
          assignment={assignmentModal}
          course={courses.find(c => c.id === assignmentModal.courseId)}
          students={students}
          grades={grades}
          onClose={() => setAssignmentModal(null)}
        />
      )}

      {courseModal && (
        <CourseStudentsModal
          course={courseModal}
          students={students}
          grades={grades}
          onClose={() => setCourseModal(null)}
        />
      )}

      <PageHeader title="Assignments" count={filtered.length} action={isTeacher ? <Btn onClick={openAdd}>+ Add assignment</Btn> : undefined} />
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
                        <button
                          className="font-medium text-left hover:text-blue-600 hover:underline underline-offset-2 transition-colors"
                          onClick={() => setAssignmentModal(a)}
                        >
                          {a.title}
                        </button>
                        {a.description && <div className="text-xs text-zinc-400 mt-0.5 truncate max-w-[220px]">{a.description}</div>}
                      </Td>
                      <Td>
                        <button
                          className="text-zinc-500 hover:text-blue-600 hover:underline underline-offset-2 transition-colors text-left"
                          onClick={() => openCourse(a.courseId)}
                        >
                          {courseName(a.courseId)}
                        </button>
                      </Td>
                      <Td className="text-zinc-500">{a.dueDate ?? "—"}</Td>
                      <Td><Badge text={text} color={color} /></Td>
                      {isTeacher && (
                        <Td className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Btn variant="ghost" size="sm" onClick={() => openEdit(a)}>Edit</Btn>
                            <Btn variant="danger" size="sm" onClick={() => remove(a)}>Delete</Btn>
                          </div>
                        </Td>
                      )}
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
