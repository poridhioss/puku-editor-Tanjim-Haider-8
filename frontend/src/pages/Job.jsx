import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import LogsPanel from "../components/LogsPanel";
import { socket } from "../socket/socket";

export default function Job({ job }) {
  const id = job.id;
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("queued");
  const [
    deployment,
    setDeployment
  ] = useState(null);

  useEffect(() => {
    socket.emit("join-job", id);

    socket.on("log", (data) => {
      setLogs((prev) => [...prev, data]);
    });
    socket.on(
      "status",
      (status) => {
        setStatus(status);
      }
    );

    socket.on(
      "deployment",
      (data) => {

        setDeployment(data);

      }
    );

    return () => {
      socket.off("log");
      socket.off("status");
      socket.off("deployment");
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-xl mb-4">Job Logs: {id}</h1>

      <LogsPanel logs={logs} />
      <h2>
        Status: {status}
      </h2>

      {
        deployment && (

          <div
            className="
      mt-6
      border
      p-4
      rounded
      "
          >

            <h2>
              Deployment Ready
            </h2>

            <p>
              Container:
              {" "}
              {
                deployment.containerName
              }
            </p>

            <p>
              Port:
              {" "}
              {
                deployment.port
              }
            </p>

            <a
              href={
                deployment.deploymentUrl
              }
              target="_blank"
            >
              Open App
            </a>

          </div>

        )
      }
    </div>
  );
}