import { useState } from "react";
import { Page } from "./types";
import Students   from "./components/Students";
import Courses    from "./components/Courses";
import Assignments from "./components/Assignments";
import Grades     from "./components/Grades";

const nav: { id: Page; label: string }[] = [
  { id: "students",    label: "Students" },
  { id: "courses",     label: "Courses" },
  { id: "assignments", label: "Assignments" },
  { id: "grades",      label: "Grades" },
];

export default function App() {
  const [page, setPage] = useState<Page>("students");

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-52 shrink-0 bg-zinc-900 flex flex-col py-6">
        <div className="px-5 mb-8">
          <div className="text-white text-sm font-semibold tracking-tight">EduTrack</div>
          <div className="text-zinc-500 text-xs mt-0.5">Student management</div>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5 px-2">
          {nav.map(({ id, label }) => {
            const active = page === id;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer border-none
                  ${active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 bg-transparent"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-5 pt-4 border-t border-zinc-800">
          <div className="text-zinc-600 text-xs">Spring Boot · Kotlin</div>
          <div className="text-zinc-600 text-xs">:8080 → :5173</div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-zinc-50">
        <div className="max-w-4xl mx-auto px-8 py-9">
          {page === "students"    && <Students />}
          {page === "courses"     && <Courses />}
          {page === "assignments" && <Assignments />}
          {page === "grades"      && <Grades />}
        </div>
      </main>
    </div>
  );
}
