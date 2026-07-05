import { useEffect, useState } from "react";
import {
  X,
  Github,
  GitBranch,
  Hash,
  CalendarClock,
} from "lucide-react";

import { socket } from "../socket/socket";
import StatusBadge from "./StatusBadge";
import LogsPanel from "./LogsPanel";
import ImageInstallPanel from "./ImageInstallPanel";

export default function JobModal({ job, onClose }) {
  const [status, setStatus] = useState(job.status);
  const [logs, setLogs] = useState([]);
  const [imageName, setImageName] = useState(job.imageName || null);

  // We re-join the Socket.IO "job room" and listen to live updates.
  useEffect(() => {
    socket.emit("join-job", job.id);

    const onStatus = (s) => setStatus(s);
    const onLog = (msg) =>
      setLogs((prev) =>
        prev.length > 5000 ? [...prev.slice(-4000), msg] : [...prev, msg]
      );
    const onDeployment = (data) => {
      if (data?.imageName) setImageName(data.imageName);
    };
    const onImage = (data) => {
      if (data?.imageName) setImageName(data.imageName);
    };

    // Existing socket.io-client doesn't have a direct "image" event here,
    // but the server's image controller is REST-only. We rely on a small
    // polling fallback below to catch imageName changes.
    socket.on("status", onStatus);
    socket.on("log", onLog);
    socket.on("deployment", onDeployment);

    // Hack: image updates are REST-only, so we poll the job occasionally
    // to pick up imageName updates. Polling stops when the job ends.
    let stopped = false;
    const tick = async () => {
      if (stopped) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/${job.id}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.imageName) setImageName(data.imageName);
        }
      } catch (err) {
        // Polling is fire-and-forget; swallow transient errors silently.
      }
    };

    const interval = setInterval(tick, 2000);

    return () => {
      stopped = true;
      clearInterval(interval);
      socket.off("status", onStatus);
      socket.off("log", onLog);
      socket.off("deployment", onDeployment);
      // `onImage` registered too, just in case the server later emits it.
      socket.off("image", onImage);
    };
  }, [job.id]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const createdAt = new Date(parseInt(job.id, 10));
  const createdStr = isNaN(createdAt.getTime())
    ? null
    : createdAt.toLocaleString();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-fade bg-black/70"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-pop w-full max-w-5xl max-h-[90vh] flex flex-col rounded-xl border border-[#30363d] bg-[#0d1117] shadow-2xl overflow-hidden"
      >
        {/* ---- Header ----------------------------------------------------------- */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-[#30363d] bg-[#161b22]">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-[#e6edf3] truncate">
                {job.repoUrl
                  .replace(/^https?:\/\/(www\.)?github\.com\//, "")
                  .replace(/\.git$/, "")}
              </h2>
              <StatusBadge status={status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8b949e] font-mono">
              <span className="inline-flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
                <span className="truncate max-w-[26rem]">{job.repoUrl}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                {job.branch || "main"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                {job.id}
              </span>
              {createdStr && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5" />
                  {createdStr}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="gh-btn !p-1.5"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ---- Body ------------------------------------------------------------- */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <ImageInstallPanel imageName={imageName} status={status} />
          <LogsPanel logs={logs} />
        </div>
      </div>
    </div>
  );
}
