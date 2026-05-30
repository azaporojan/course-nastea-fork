import { ReactNode, useState } from "react";

// ─── Button ───────────────────────────────────────────────────────────────────
type BtnVariant = "primary" | "ghost" | "danger";
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: "sm" | "md";
}

const variantClass: Record<BtnVariant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-700",
  ghost:   "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50",
  danger:  "bg-red-50 text-red-600 hover:bg-red-100",
};

export function Btn({ variant = "primary", size = "md", children, className = "", ...rest }: BtnProps) {
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm";
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-md font-medium transition-colors cursor-pointer disabled:opacity-50 ${sz} ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

// ─── Form fields ──────────────────────────────────────────────────────────────
const inputBase = "w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition";
const inputNormal = "border-zinc-200 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300";
const inputError  = "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200";

export function Input({ error, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return <input className={`${inputBase} ${error ? inputError : inputNormal} ${className ?? ""}`} {...props} />;
}

export function Select({ error, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return <select className={`${inputBase} ${error ? inputError : inputNormal} cursor-pointer ${className ?? ""}`} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputBase} ${inputNormal} min-h-[80px] resize-y ${className ?? ""}`} {...props} />;
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-[440px] max-w-[92vw] p-7"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-base font-semibold text-zinc-900">{title}</span>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 text-xl leading-none cursor-pointer bg-transparent border-none">
            ×
          </button>
        </div>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}

// ─── Table primitives ─────────────────────────────────────────────────────────
export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 bg-zinc-50">
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-sm border-b border-zinc-100 last:border-0 ${className}`}>
      {children}
    </td>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <tr
      className={`transition-colors ${hover ? "bg-zinc-50" : "bg-white"}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </tr>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeColor = "blue" | "green" | "red" | "yellow" | "gray";
const badgeClass: Record<BadgeColor, string> = {
  blue:   "bg-blue-50 text-blue-700",
  green:  "bg-green-50 text-green-700",
  red:    "bg-red-50 text-red-600",
  yellow: "bg-amber-50 text-amber-700",
  gray:   "bg-zinc-100 text-zinc-600",
};

export function Badge({ text, color = "gray" }: { text: string; color?: BadgeColor }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeClass[color]}`}>
      {text}
    </span>
  );
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
export function Empty({ label }: { label: string }) {
  return <div className="py-14 text-center text-sm text-zinc-400">{label}</div>;
}

export function PageHeader({ title, count, action }: { title: string; count?: number; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-6">
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
        {count !== undefined && <span className="text-sm text-zinc-400">{count}</span>}
      </div>
      {action}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative mb-4">
      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? "Search…"}
        className="w-72 pl-8 pr-3 py-2 text-sm border border-zinc-200 rounded-md bg-white text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
      />
    </div>
  );
}

export function ErrorBar({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2">
      {message}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400 py-8">
      <svg className="animate-spin" width={16} height={16} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
      </svg>
      Loading…
    </div>
  );
}
