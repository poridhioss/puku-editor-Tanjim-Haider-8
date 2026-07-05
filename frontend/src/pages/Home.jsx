import { useState } from "react";
import { Workflow, Github } from "lucide-react";
import JobForm from "../components/JobForm";
import JobCard from "../components/JobCard";

const EMPTY_STATES = {
  noJobs: {
    icon: Workflow,
    title: "No builds yet",
    desc: "Submit a repository URL above to start your first build. The pipeline will clone, build, and push a Docker image for you.",
  },
};

export default function Home() {
  const [jobs, setJobs] = useState([]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* ===================== HEADER ===================== */}
      <header className="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#2f81f7] to-[#a371f7] flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">
                Mini CI/CD
              </h1>
              <p className="text-[11px] text-[#8b949e] font-mono leading-tight">
                build · push · deploy
              </p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="gh-btn"
          >
            <Github className="w-4 h-4" />
            Source
          </a>
        </div>
      </header>

      {/* ===================== MAIN ===================== */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Hero / Form */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              Run a build pipeline
            </h2>
            <p className="mt-1 text-sm text-[#8b949e]">
              Trigger a multi-stage Docker build with live logs and a
              one-click pull command when it finishes.
            </p>
          </div>
          <JobForm setJobs={setJobs} />
        </section>

        {/* Jobs list */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Builds</h2>
            <span className="text-xs text-[#8b949e] font-mono">
              {jobs.length} {jobs.length === 1 ? "build" : "builds"}
            </span>
          </div>

          {jobs.length === 0 ? (
            <EmptyState
              icon={EMPTY_STATES.noJobs.icon}
              title={EMPTY_STATES.noJobs.title}
              desc={EMPTY_STATES.noJobs.desc}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-8 text-center text-xs text-[#6e7681]">
        <span className="font-mono">
          powered by express · bullmq · socket.io · docker
        </span>
      </footer>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="gh-card flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-12 h-12 rounded-full bg-[#21262d] flex items-center justify-center mb-4 border border-[#30363d]">
        <Icon className="w-6 h-6 text-[#8b949e]" />
      </div>
      <h3 className="text-base font-semibold text-[#e6edf3] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#8b949e] max-w-md">{desc}</p>
    </div>
  );
}
