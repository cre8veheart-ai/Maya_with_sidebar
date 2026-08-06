"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";

type Priority = "high" | "medium" | "low";
type Status = "open" | "in-progress" | "done";

interface Task {
  id: number;
  title: string;
  role: string;
  priority: Priority;
  status: Status;
  due: string;
}

const SAMPLE_TASKS: Task[] = [
  { id: 1, title: "Review Q3 budget variance report", role: "CFO", priority: "high", status: "open", due: "Today" },
  { id: 2, title: "Brief CMO on brand refresh direction", role: "CEO", priority: "high", status: "in-progress", due: "Tomorrow" },
  { id: 3, title: "Finalize vendor contract terms", role: "Legal", priority: "medium", status: "open", due: "Aug 9" },
  { id: 4, title: "Approve campaign phase 2 assets", role: "CD", priority: "medium", status: "in-progress", due: "Aug 10" },
  { id: 5, title: "Update org chart after restructure", role: "HR", priority: "low", status: "open", due: "Aug 12" },
  { id: 6, title: "Quarterly CRO pipeline review", role: "CRO", priority: "high", status: "done", due: "Aug 1" },
];

const PRIORITY_BADGE: Record<Priority, string> = {
  high: "text-[#f38ba8] bg-[#f38ba8]/10",
  medium: "text-[#f9e2af] bg-[#f9e2af]/10",
  low: "text-[#585b70] bg-[#313244]",
};

const STATUS_BADGE: Record<Status, string> = {
  open: "text-[#89b4fa] bg-[#89b4fa]/10",
  "in-progress": "text-[#a6e3a1] bg-[#a6e3a1]/10",
  done: "text-[#585b70] bg-[#313244]",
};

const ALL_STATUSES: Status[] = ["open", "in-progress", "done"];
const ALL_PRIORITIES: Priority[] = ["high", "medium", "low"];

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#313244] last:border-0">
      <button
        onClick={() => onToggle(task.id)}
        className={[
          "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
          task.status === "done"
            ? "bg-[#a6e3a1]/20 border-[#a6e3a1]"
            : "border-[#45475a] hover:border-[#89b4fa]",
        ].join(" ")}
        aria-label={task.status === "done" ? "Mark incomplete" : "Mark done"}
      >
        {task.status === "done" && (
          <span className="text-[#a6e3a1] text-[10px] leading-none">✓</span>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={["text-[13px] font-medium truncate", task.status === "done" ? "line-through text-[#585b70]" : "text-[#cdd6f4]"].join(" ")}>
          {task.title}
        </p>
        <p className="text-[11px] text-[#585b70]">{task.role} · {task.due}</p>
      </div>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${PRIORITY_BADGE[task.priority]}`}>
        {task.priority}
      </span>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[task.status]}`}>
        {task.status}
      </span>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [newTitle, setNewTitle] = useState("");
  const [newRole, setNewRole] = useState("CEO");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [showForm, setShowForm] = useState(false);

  const filtered = tasks.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    return true;
  });

  function toggleDone(id: number) {
    setTasks((prev) =>
      prev.map((t) => t.id === id ? { ...t, status: t.status === "done" ? "open" : "done" } : t)
    );
  }

  function addTask() {
    if (!newTitle.trim()) return;
    setTasks((prev) => [
      {
        id: Date.now(),
        title: newTitle.trim(),
        role: newRole,
        priority: newPriority,
        status: "open",
        due: "—",
      },
      ...prev,
    ]);
    setNewTitle("");
    setShowForm(false);
  }

  const open = tasks.filter((t) => t.status === "open").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <PageShell
      title="Tasks"
      subtitle="Action items linked to your decisions — every exec role contributes"
      action={
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-[12px] font-semibold px-4 py-2 rounded-lg bg-[#89b4fa]/10 text-[#89b4fa] border border-[#89b4fa]/30 hover:bg-[#89b4fa]/20 transition-colors"
        >
          + New Task
        </button>
      }
    >
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Open", value: open, color: "text-[#89b4fa]" },
          { label: "In Progress", value: inProgress, color: "text-[#a6e3a1]" },
          { label: "Done", value: done, color: "text-[#585b70]" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-4 text-center">
            <p className={`text-[22px] font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-[#585b70] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Task list */}
        <div className="md:col-span-2 space-y-4">
          {/* New task form */}
          {showForm && (
            <div className="bg-[#1e1e2e] border border-[#89b4fa]/30 rounded-xl p-4 space-y-3">
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Task title…"
                className="w-full bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa]/50"
              />
              <div className="flex gap-3">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="flex-1 bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-[12px] text-[#cdd6f4] focus:outline-none"
                >
                  {["CEO","COO","CMO","CFO","CTO","CIO","CRO","CD","HR","Legal","Office Admin"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Priority)}
                  className="flex-1 bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-[12px] text-[#cdd6f4] focus:outline-none"
                >
                  {ALL_PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowForm(false)} className="text-[12px] text-[#585b70] px-3 py-1.5 rounded-lg hover:text-[#cdd6f4] transition-colors">
                  Cancel
                </button>
                <button onClick={addTask} className="text-[12px] font-semibold px-4 py-1.5 rounded-lg bg-[#89b4fa]/10 text-[#89b4fa] border border-[#89b4fa]/30 hover:bg-[#89b4fa]/20 transition-colors">
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Task list */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              Tasks ({filtered.length})
            </h2>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span className="text-3xl">📋</span>
                <p className="text-[13px] text-[#585b70]">No tasks match the current filters.</p>
              </div>
            ) : (
              filtered.map((t) => <TaskRow key={t.id} task={t} onToggle={toggleDone} />)
            )}
          </div>
        </div>

        {/* Filters sidebar */}
        <div className="space-y-4">
          {/* Status filter */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-3">Status</h2>
            <div className="space-y-1">
              {(["all", ...ALL_STATUSES] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={[
                    "w-full text-left text-[12px] px-3 py-1.5 rounded-lg transition-colors",
                    statusFilter === s
                      ? "bg-[#89b4fa]/10 text-[#89b4fa]"
                      : "text-[#585b70] hover:text-[#cdd6f4]",
                  ].join(" ")}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority filter */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-3">Priority</h2>
            <div className="space-y-1">
              {(["all", ...ALL_PRIORITIES] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={[
                    "w-full text-left text-[12px] px-3 py-1.5 rounded-lg transition-colors",
                    priorityFilter === p
                      ? "bg-[#89b4fa]/10 text-[#89b4fa]"
                      : "text-[#585b70] hover:text-[#cdd6f4]",
                  ].join(" ")}
                >
                  {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* MAYA hint */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-4">
            <p className="text-[11px] text-[#585b70] leading-relaxed">
              Tasks surface automatically from your Decisions layer. Create manually or let MAYA extract action items from your sessions.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
