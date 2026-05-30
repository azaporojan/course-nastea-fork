export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  groupName: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  teacher: string;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  courseId: number | null;
}

export interface Grade {
  id: number;
  value: number;
  date: string;
  studentId: number | null;
  courseId: number | null;
}

export type Page = "students" | "courses" | "assignments" | "grades";
