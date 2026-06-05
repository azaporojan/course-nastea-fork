-- ─────────────────────────────────────────────────────────────────────────────
-- V4: Expand test data — more students, courses, assignments, grades
-- users table is intentionally left unchanged
-- ─────────────────────────────────────────────────────────────────────────────

-- ── New students (IDs 7–18) ─────────────────────────────────────────────────
INSERT INTO students (first_name, last_name, email, group_name)
VALUES
  ('Natalia',   'Botnaru',    'natalia.botnaru@example.com',    'IAFR-2302'),
  ('Vlad',      'Ciobanu',    'vlad.ciobanu@example.com',       'IAFR-2302'),
  ('Cristina',  'Danu',       'cristina.danu@example.com',      'IAFR-2301'),
  ('Andrei',    'Frunze',     'andrei.frunze@example.com',      'IA-2303'),
  ('Olesea',    'Gîrla',      'olesea.girla@example.com',       'IA-2303'),
  ('Maxim',     'Harea',      'maxim.harea@example.com',        'IAFR-2301'),
  ('Diana',     'Istrati',    'diana.istrati@example.com',      'IAFR-2302'),
  ('Pavel',     'Josan',      'pavel.josan@example.com',        'IA-2304'),
  ('Valeria',   'Catan',      'valeria.catan@example.com',      'IA-2304'),
  ('Sergiu',    'Lungu',      'sergiu.lungu@example.com',       'IAFR-2301'),
  ('Irina',     'Madan',      'irina.madan@example.com',        'IA-2304'),
  ('Timur',     'Nacu',       'timur.nacu@example.com',         'IA-2303');

-- ── New courses (IDs 5–7) ────────────────────────────────────────────────────
INSERT INTO courses (name, description, teacher)
VALUES
  ('Operating Systems',    'Processes, threads, memory management and file systems',  'Dr. Balan'),
  ('Software Engineering', 'SDLC, design patterns, testing and project management',   'Prof. Cebanu'),
  ('Computer Networks',    'TCP/IP, HTTP, DNS, sockets and network security',          'Dr. Turcan');

-- ── New assignments ──────────────────────────────────────────────────────────
-- course 1: Java Backend
INSERT INTO assignments (title, description, due_date, course_id)
VALUES
  ('Lab #2 — Spring Security',  'Add JWT authentication to the existing REST API',          '2026-07-05', 1),
  ('Lab #3 — Exception Handler','Implement GlobalExceptionHandler with ApiError DTO',       '2026-07-12', 1),
  ('Final Project',             'Full-stack student management application (EduTrack)',      '2026-07-30', 1);

-- course 2: Databases
INSERT INTO assignments (title, description, due_date, course_id)
VALUES
  ('Lab #2 — Normalization',    'Normalize a given schema to 3NF with explanations',       '2026-06-22', 2),
  ('Lab #3 — Indexes',          'Create and benchmark indexes on a 100k-row table',        '2026-06-29', 2),
  ('Lab #4 — Transactions',     'Write PL/pgSQL procedures demonstrating ACID properties', '2026-07-06', 2);

-- course 5: Operating Systems
INSERT INTO assignments (title, description, due_date, course_id)
VALUES
  ('Lab #1 — Processes',        'Fork, exec and wait system calls in C',                   '2026-06-20', 5),
  ('Lab #2 — Threads',          'POSIX threads — mutex and semaphore synchronisation',     '2026-06-27', 5),
  ('Lab #3 — Memory',           'Virtual memory and page replacement algorithms',          '2026-07-04', 5);

-- course 6: Software Engineering
INSERT INTO assignments (title, description, due_date, course_id)
VALUES
  ('Lab #1 — UML Diagrams',     'Draw use-case, class and sequence diagrams for EduTrack', '2026-06-19', 6),
  ('Lab #2 — Design Patterns',  'Implement Singleton, Factory and Observer in Kotlin',     '2026-06-26', 6);

-- course 3: Algorithms
INSERT INTO assignments (title, description, due_date, course_id)
VALUES
  ('Lab #3 — Dynamic Prog.',    'Solve knapsack and longest common subsequence problems',  '2026-07-02', 3);

-- ── More grades ───────────────────────────────────────────────────────────────
-- Java Backend (course 1) — covering all new students
INSERT INTO grades (value, date, student_id, course_id)
VALUES
  (8,  '2026-06-01', 7,  1),
  (7,  '2026-06-01', 8,  1),
  (9,  '2026-06-01', 9,  1),
  (10, '2026-06-02', 10, 1),
  (6,  '2026-06-02', 11, 1),
  (8,  '2026-06-02', 12, 1),
  (9,  '2026-06-03', 13, 1),
  (5,  '2026-06-03', 14, 1),
  (10, '2026-06-03', 15, 1),
  (7,  '2026-06-04', 16, 1),
  (8,  '2026-06-04', 17, 1),
  (9,  '2026-06-04', 18, 1);

-- Databases (course 2)
INSERT INTO grades (value, date, student_id, course_id)
VALUES
  (9,  '2026-06-05', 7,  2),
  (8,  '2026-06-05', 8,  2),
  (10, '2026-06-05', 9,  2),
  (6,  '2026-06-06', 10, 2),
  (7,  '2026-06-06', 11, 2),
  (9,  '2026-06-06', 5,  2),
  (8,  '2026-06-06', 6,  2);

-- Algorithms (course 3)
INSERT INTO grades (value, date, student_id, course_id)
VALUES
  (7,  '2026-06-07', 7,  3),
  (9,  '2026-06-07', 8,  3),
  (8,  '2026-06-07', 12, 3),
  (6,  '2026-06-07', 13, 3),
  (10, '2026-06-08', 14, 3),
  (5,  '2026-06-08', 15, 3),
  (7,  '2026-06-08', 16, 3);

-- Web Technologies (course 4)
INSERT INTO grades (value, date, student_id, course_id)
VALUES
  (9,  '2026-06-09', 7,  4),
  (10, '2026-06-09', 9,  4),
  (8,  '2026-06-09', 11, 4),
  (7,  '2026-06-09', 13, 4),
  (6,  '2026-06-10', 15, 4),
  (9,  '2026-06-10', 17, 4);

-- Operating Systems (course 5) — new course, all students
INSERT INTO grades (value, date, student_id, course_id)
VALUES
  (8,  '2026-06-11', 1,  5),
  (7,  '2026-06-11', 2,  5),
  (9,  '2026-06-11', 3,  5),
  (10, '2026-06-11', 4,  5),
  (6,  '2026-06-12', 5,  5),
  (8,  '2026-06-12', 6,  5),
  (9,  '2026-06-12', 7,  5),
  (7,  '2026-06-12', 8,  5),
  (10, '2026-06-13', 9,  5),
  (5,  '2026-06-13', 10, 5);

-- Software Engineering (course 6)
INSERT INTO grades (value, date, student_id, course_id)
VALUES
  (9,  '2026-06-14', 1,  6),
  (8,  '2026-06-14', 3,  6),
  (10, '2026-06-14', 5,  6),
  (7,  '2026-06-14', 7,  6),
  (9,  '2026-06-15', 9,  6),
  (6,  '2026-06-15', 11, 6),
  (8,  '2026-06-15', 13, 6),
  (10, '2026-06-15', 15, 6),
  (7,  '2026-06-16', 17, 6);

-- Computer Networks (course 7)
INSERT INTO grades (value, date, student_id, course_id)
VALUES
  (8,  '2026-06-17', 2,  7),
  (9,  '2026-06-17', 4,  7),
  (7,  '2026-06-17', 6,  7),
  (10, '2026-06-17', 8,  7),
  (6,  '2026-06-18', 10, 7),
  (8,  '2026-06-18', 12, 7),
  (9,  '2026-06-18', 14, 7),
  (7,  '2026-06-18', 16, 7),
  (10, '2026-06-19', 18, 7);
