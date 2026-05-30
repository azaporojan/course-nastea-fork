import { useEffect, useState } from "react";
import { Student } from "../types";
import * as api from "../api";
import { ApiError } from "../api";
import { Btn, Badge, Empty, ErrorBar, Field, Input, Modal, PageHeader, SearchBar, Spinner, Table, Td, Th, Tr } from "./ui";

type Form = { firstName: string; lastName: string; email: string; groupName: string };
type FE = Partial<Record<keyof Form, string>>;
const blank: Form = { firstName: "", lastName: "", email: "", groupName: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Form): FE {
  const e: FE = {};
  if (!f.firstName.trim())            e.firstName = "Required.";
  else if (f.firstName.trim().length < 2) e.firstName = "At least 2 characters.";
  if (!f.lastName.trim())             e.lastName = "Required.";
  else if (f.lastName.trim().length < 2)  e.lastName = "At least 2 characters.";
  if (!f.email.trim())                e.email = "Required.";
  else if (!EMAIL_RE.test(f.email))   e.email = "Enter a valid email (e.g. name@domain.com).";
  return e;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<null | "add" | Student>(null);
  const [form, setForm]         = useState<Form>(blank);
  const [fe, setFe]             = useState<FE>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]   = useState(true);

  const load = () => {
    setLoading(true);
    api.getStudents()
      .then(setStudents)
      .catch((e: ApiError) => setServerError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email} ${s.groupName}`.toLowerCase().includes(search.toLowerCase())
  );

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setFe(prev => ({ ...prev, [k]: undefined }));
    setServerError("");
  };

  const openAdd  = () => { setForm(blank); setFe({}); setServerError(""); setModal("add"); };
  const openEdit = (s: Student) => {
    setForm({ firstName: s.firstName, lastName: s.lastName, email: s.email, groupName: s.groupName });
    setFe({}); setServerError(""); setModal(s);
  };

  const save = async () => {
    const errors = validate(form);
    if (Object.keys(errors).length) { setFe(errors); return; }
    try {
      modal === "add"
        ? await api.createStudent(form)
        : await api.updateStudent((modal as Student).id, form);
      setModal(null); load();
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.fields).length) setFe(e.fields as FE);
      else setServerError(e instanceof ApiError ? e.message : "Unexpected error.");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this student? This cannot be undone.")) return;
    try { await api.deleteStudent(id); load(); }
    catch (e) { alert(e instanceof ApiError ? e.message : "Delete failed."); }
  };

  return (
    <div>
      <PageHeader title="Students" count={filtered.length} action={<Btn onClick={openAdd}>+ Add student</Btn>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or group…" />

      {loading ? <Spinner /> : (
        <Table>
          <thead><tr><Th>Name</Th><Th>Email</Th><Th>Group</Th><Th /></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={4}><Empty label="No students yet." /></td></tr>
              : filtered.map(s => (
                <Tr key={s.id}>
                  <Td><span className="font-medium">{s.firstName} {s.lastName}</span></Td>
                  <Td className="text-zinc-500">{s.email}</Td>
                  <Td>{s.groupName ? <Badge text={s.groupName} color="blue" /> : <span className="text-zinc-300">—</span>}</Td>
                  <Td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Btn variant="ghost" size="sm" onClick={() => openEdit(s)}>Edit</Btn>
                      <Btn variant="danger" size="sm" onClick={() => remove(s.id)}>Delete</Btn>
                    </div>
                  </Td>
                </Tr>
              ))
            }
          </tbody>
        </Table>
      )}

      {modal && (
        <Modal title={modal === "add" ? "New student" : "Edit student"} onClose={() => setModal(null)}>
          {serverError && <ErrorBar message={serverError} />}
          <Field label="First name" error={fe.firstName}>
            <Input value={form.firstName} onChange={set("firstName")} placeholder="e.g. Maria" error={!!fe.firstName} />
          </Field>
          <Field label="Last name" error={fe.lastName}>
            <Input value={form.lastName} onChange={set("lastName")} placeholder="e.g. Popescu" error={!!fe.lastName} />
          </Field>
          <Field label="Email" error={fe.email}>
            <Input type="email" value={form.email} onChange={set("email")} placeholder="e.g. maria@uni.edu" error={!!fe.email} />
          </Field>
          <Field label="Group (optional)">
            <Input value={form.groupName} onChange={set("groupName")} placeholder="e.g. CS-101" />
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
