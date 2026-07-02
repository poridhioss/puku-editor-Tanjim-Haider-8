export default function LogsPanel({ logs }) {
  return (
    <div className="bg-gray-900 p-4 rounded h-[500px] overflow-auto">
      {logs.map((log, i) => (
        <pre key={i} className="text-green-400 text-sm">
          {log}
        </pre>
      ))}
    </div>
  );
}