import { Clock, Loader2, CheckCircle2, XCircle, GitBranch } from "lucide-react";

const ICONS = {
  queued: Clock,
  running: Loader2,
  success: CheckCircle2,
  failed: XCircle,
  // Treat "cloned" as a friendly "in progress" sub-state.
  cloned: GitBranch,
};

const CLASSES = {
  queued: "status-queued",
  running: "status-running",
  success: "status-success",
  failed: "status-failed",
  cloned: "status-cloned",
};

export default function StatusBadge({ status = "queued" }) {
  const key = (CLASSES[status] ? status : "queued");
  const Icon = ICONS[key];
  const label = status[0].toUpperCase() + status.slice(1);

  return (
    <span className={`gh-pill ${CLASSES[key]}`}>
      <Icon
        className={`w-3 h-3 ${key === "running" ? "animate-spin" : ""}`}
      />
      {label}
    </span>
  );
}
