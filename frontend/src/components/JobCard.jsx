import { useEffect, useState } from "react";
import { Github, GitBranch, Hash } from "lucide-react";
import JobModal from "./JobModal";
import StatusBadge from "./StatusBadge";
import { socket } from "../socket/socket";

export default function JobCard({ job }) {
  const [open, setOpen] = useState(false);
  // Local status state so the card can update independently of the modal.
  // Initial value comes from the props, but socket events update it live.
  const [status, setStatus] = useState(job.status);
  const [imageName, setImageName] = useState(job.imageName || null);

  // Re-sync status if React re-uses this component instance for a different
  // job prop (defensive — `key={job.id}` in the parent should already
  // prevent this, but it's cheap insurance). We use a layout-effect-shaped
  // pattern: derive initial state from props at mount, then defer to
  // socket events. The parent already passes `key={job.id}` to mount a
  // fresh instance per job, so this effect is rarely triggered.
  useEffect(() => {
    let cancelled = false;
    // Avoid synchronous setState in the render path.
    queueMicrotask(() => {
      if (cancelled) return;
      setStatus((prev) => (prev === job.status ? prev : job.status));
      setImageName((prev) =>
        prev === (job.imageName || null) ? prev : job.imageName || null
      );
    });
    return () => {
      cancelled = true;
    };
  }, [job.id, job.status, job.imageName]);

  // Subscribe to the live status for THIS specific job, regardless of
  // whether the modal is open or not. Critical for the status badge to
  // actually update on the dashboard after the build finishes.
  useEffect(() => {
    // Join the per-job Socket.IO room so we receive `status` / `log` events
    // for this job.
    socket.emit("join-job", job.id);

    // The server's emitStatus broadcasts `io.to(jobId).emit("status", status)` —
    // i.e. the payload IS the status string. (job.id targets this card because
    // we joined that room above.)
    const onStatus = (incomingStatus) => {
      if (typeof incomingStatus === "string") {
        setStatus(incomingStatus);
      }
    };

    // Belt-and-suspenders: also poll the server. Polling catches image
    // updates (which are REST-only) and is a fallback in case the socket
    // listener misses an event (e.g. while disconnected).
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/${job.id}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.status && data.status !== status) setStatus(data.status);
          if (data?.imageName) setImageName(data.imageName);
        }
      } catch {
        // polling is fire-and-forget
      }
    }, 3000);

    socket.on("status", onStatus);

    return () => {
      socket.off("status", onStatus);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.id]);

  const shortRepo = job.repoUrl
    .replace(/^https?:\/\/(www\.)?github\.com\//, "")
    .replace(/\.git$/, "");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="gh-card gh-card-hover p-4 text-left w-full group fade-in-up"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#e6edf3] truncate group-hover:text-[#79c0ff] transition-colors">
              {shortRepo}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-[#8b949e] font-mono">
              <span className="inline-flex items-center gap-1">
                <Github className="w-3 h-3" />
                <span className="truncate max-w-[18rem]">{job.repoUrl}</span>
              </span>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#6e7681] font-mono">
          <span className="inline-flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            {job.branch || "main"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {String(job.id).slice(-6)}
          </span>
        </div>

        {imageName && (
          <div
            className="mt-3 pt-3 border-t border-[#30363d] text-[11px] text-[#8b949e] font-mono truncate"
            title={imageName}
          >
            <span className="text-[#6e7681]">image: </span>
            <span className="text-[#7ee787]">{imageName}</span>
          </div>
        )}
      </button>

      {open && (
        <JobModal
          job={{ ...job, status, imageName }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
