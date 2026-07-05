import { useState } from "react";
import { Github, GitBranch, Play, Loader2, Info } from "lucide-react";
import { createJob } from "../api/jobApi";

export default function JobForm({ setJobs }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    repoUrl.trim().length > 0 &&
    /^https?:\/\/.+\.git$/.test(repoUrl.trim());

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");

    if (!isValid) {
      setError("Please enter a valid Git repo URL ending with .git");
      return;
    }

    setSubmitting(true);
    try {
      const job = await createJob({ repoUrl: repoUrl.trim(), branch });
      setJobs((prev) => [job, ...prev]);
      setRepoUrl("");
      setBranch("main");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to submit job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="gh-card p-5 fade-in-up"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-3">
        {/* Repo URL */}
        <div>
          <label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#8b949e] mb-1.5 font-medium">
            <Github className="w-3.5 h-3.5" />
            Repository URL
          </label>
          <input
            type="url"
            className="gh-input"
            placeholder="https://github.com/owner/repo.git"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Branch */}
        <div>
          <label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#8b949e] mb-1.5 font-medium">
            <GitBranch className="w-3.5 h-3.5" />
            Branch
          </label>
          <input
            type="text"
            className="gh-input font-mono"
            placeholder="main"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <button
            type="submit"
            className="gh-btn-primary w-full md:w-auto"
            disabled={!isValid || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Queuing…
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Build
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-xs text-[#f85149] font-medium">{error}</p>
      )}

      <div className="mt-4 flex items-start gap-2 text-xs text-[#8b949e] bg-[#0d1117] border border-[#30363d] rounded-md p-3">
        <Info className="w-4 h-4 mt-0.5 text-[#2f81f7] shrink-0" />
        <p>
          The repository must contain a <code className="font-mono text-[#7ee787]">Dockerfile</code> at
          its root. The runner will clone the repo, build the image with{" "}
          <code className="font-mono text-[#7ee787]">docker build</code>, and
          push it to Docker Hub.
        </p>
      </div>
    </form>
  );
}
