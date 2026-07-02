export async function createJob(data) {
  const res = await fetch("http://localhost:8000/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  console.log("Create job response:", res);

  return res.json();
}