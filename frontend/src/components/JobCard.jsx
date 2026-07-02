import { Link } from "react-router-dom";
import { socket } from "../socket/socket";
import { useEffect, useState } from "react";
import Job from "../pages/Job";



export default function JobCard({ job }) {
  const [status, setStatus] = useState(job.status);
  useEffect(() => {
    socket.emit("join-job", job.id);

    socket.on(
      "status",
      (status) => {
        setStatus(status);
      }
    );

    return () => {
      socket.off("status");
    };
  }, [job.id]);
  return (
    <Link to={`/job/${job.id}`}>
      <div className="bg-gray-800 p-4 rounded hover:bg-gray-700">
        <p><b>Job ID:</b> {job.id}</p>
        <p><b>Status:</b> {status}</p>
      </div>
      <Job job={job} />
    </Link>
  );
}