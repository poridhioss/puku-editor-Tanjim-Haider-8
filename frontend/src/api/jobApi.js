export async function createJob(data) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  console.log("Create job response:", res);

  return res.json();
}