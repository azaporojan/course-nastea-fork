const BASE = "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: Record<string, string> = {}
  ) {
    super(message);
  }
}

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE + url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(0, "Cannot connect to the server. Make sure the backend is running on port 8080.");
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!res.ok) {
    let fields: Record<string, string> = {};
    let message = `Server error (${res.status})`;
    try {
      const body = JSON.parse(text);
      message = body.message ?? message;
      fields = body.fields ?? {};
    } catch { /* non-JSON error body */ }
    throw new ApiError(res.status, message, fields);
  }

  return text ? JSON.parse(text) : (undefined as T);
}

// Students
export const getStudents  = (group?: string) => req<import("./types").Student[]>("/students" + (group ? `?group=${group}` : ""));
export const createStudent = (body: object)  => req<import("./types").Student>("/students", { method: "POST", body: JSON.stringify(body) });
export const updateStudent = (id: number, body: object) => req<import("./types").Student>(`/students/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteStudent = (id: number)    => req<void>(`/students/${id}`, { method: "DELETE" });

// Courses
export const getCourses   = ()               => req<import("./types").Course[]>("/courses");
export const createCourse = (body: object)   => req<import("./types").Course>("/courses", { method: "POST", body: JSON.stringify(body) });
export const updateCourse = (id: number, body: object) => req<import("./types").Course>(`/courses/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteCourse = (id: number)     => req<void>(`/courses/${id}`, { method: "DELETE" });

// Assignments
export const getAssignments   = ()             => req<import("./types").Assignment[]>("/assignments");
export const createAssignment = (body: object) => req<import("./types").Assignment>("/assignments", { method: "POST", body: JSON.stringify(body) });
export const updateAssignment = (id: number, body: object) => req<import("./types").Assignment>(`/assignments/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteAssignment = (id: number)   => req<void>(`/assignments/${id}`, { method: "DELETE" });

// Grades
export const getGrades   = ()             => req<import("./types").Grade[]>("/grades");
export const createGrade = (body: object) => req<import("./types").Grade>("/grades", { method: "POST", body: JSON.stringify(body) });
export const updateGrade = (id: number, body: object) => req<import("./types").Grade>(`/grades/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteGrade = (id: number)   => req<void>(`/grades/${id}`, { method: "DELETE" });
