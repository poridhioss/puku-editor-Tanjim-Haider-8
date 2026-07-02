import { useState } from "react";
import { createJob } from "../api/jobApi";

export default function JobForm({ setJobs }) {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = async () => {
    const job = await createJob({
      repoUrl,
      branch: "main"
    });

    console.log("Created job:", job);

    setJobs((prev) => [job, ...prev]);
    setRepoUrl("");
  };

  return (
    <div className="flex gap-2">
      <input
        className="p-2 rounded w-full text-black"
        placeholder="Git Repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-500 px-4 py-2 rounded"
      >
        Build
      </button>
    </div>
  );
}