import JobForm from "../components/JobForm";
import JobCard from "../components/JobCard";
import { useState } from "react";

export default function Home() {
  const [jobs, setJobs] = useState([]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Mini CI/CD Dashboard
      </h1>

      <JobForm setJobs={setJobs} />

      <div className="mt-6 grid gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}