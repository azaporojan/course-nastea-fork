import { useEffect, useState } from "react";
import { Course } from "../types";
import * as api from "../api";
import { ApiError } from "../api";
import { Btn, Empty, ErrorBar, Field, Input, Modal, PageHeader, SearchBar, Spinner, Table, Td, Th, Tr, Textarea, useConfirm } from "./ui";

type Form = { name: string; description: string; teacher: string };
type FE = Partial<Record<keyof Form, string>>;
const blank: Form = { name: "", description: "", teacher: "" };

function validate(f: Form): FE {
  const e: FE = {};
  if (!f.name.trim())    e.name    = "Required.";
  if (!f.teacher.trim()) e.teacher = "Required.";
  return e;
}

export default function Courses() {
  const [courses, setCourses]   = useState<Course[]>([]);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<null | "add" | Course>(null);
  const [form, setForm]         = useState<Form>(blank);
  const [fe, setFe]             = useState<FE>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]   = useState(true);
  const { confirm, dialog }     = useConfirm();

  const load = () => {
    setLoading(true);
    api.getCourses().then(setCourses).catch((e: ApiError) => setServerError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = courses.filter(c =>
    `${c.name} ${c.teacher} ${c.description}`.toLowerCase().includes(search.toLowerCase())
  );

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setFe(prev => ({ ...prev, [k]: undefined }));
    setServerError("");
  };

  const openAdd  = () => { setForm(blank); setFe({}); setServerError(""); setModal("add"); };
  const openEdit = (c: Course) => {
    setForm({ name: c.name, description: c.description, teacher: c.teacher });
    setFe({}); setServerError(""); setModal(c);
  };

  const save = async () => {
    const errors = validate(form);
    if (Object.keys(errors).length) { setFe(errors); return; }
    try {
      modal === "add" ? await api.createCourse(form) : await api.updateCourse((modal as Course).id, form);
      setModal(null); load();
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.fields).length) setFe(e.fields as FE);
      else setServerError(e instanceof ApiError ? e.message : "Unexpected error.");
    }
  };

  const remove = async (c: Course) => {
    const ok = await confirm(
      "Delete course",
      `Are you sure you want to delete "${c.name}"? All related assignments and grades will also be removed.`,
      "Delete",
      "danger"
    );
    if (!ok) return;
    try { await api.deleteCourse(c.id); load(); }
    catch (e) { setServerError(e instanceof ApiError ? e.message : "Delete failed."); }
  };

  return (
    <div>
      {dialog}
      <PageHeader title="Courses" count={filtered.length} action={<Btn onClick={openAdd}>+ Add course</Btn>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name or teacher…" />

      {loading ? <Spinner /> : (
        <Table>
          <thead><tr><Th>Course name</Th><Th>Teacher</Th><Th>Description</Th><Th /></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={4}><Empty label="No courses yet." /></td></tr>
              : filtered.map(c => (
                <Tr key={c.id}>
                  <Td><span className="font-medium">{c.name}</span></Td>
                  <Td className="text-zinc-500">{c.teacher}</Td>
                  <Td className="text-zinc-400 max-w-xs truncate">{c.description || "—"}</Td>
                  <Td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Btn variant="ghost" size="sm" onClick={() => openEdit(c)}>Edit</Btn>
                      <Btn variant="danger" size="sm" onClick={() => remove(c)}>Delete</Btn>
                    </div>
                  </Td>
                </Tr>
              ))
            }
          </tbody>
        </Table>
      )}

      {modal && (
        <Modal title={modal === "add" ? "New course" : "Edit course"} onClose={() => setModal(null)}>
          {serverError && <ErrorBar message={serverError} />}
          <Field label="Course name" error={fe.name}>
            <Input value={form.name} onChange={set("name")} placeholder="e.g. Algorithms & Data Structures" error={!!fe.name} />
          </Field>
          <Field label="Teacher" error={fe.teacher}>
            <Input value={form.teacher} onChange={set("teacher")} placeholder="e.g. Dr. Smith" error={!!fe.teacher} />
          </Field>
          <Field label="Description (optional)">
            <Textarea value={form.description} onChange={set("description")} placeholder="Brief course description…" />
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
