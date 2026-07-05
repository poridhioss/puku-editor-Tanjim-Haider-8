import { useState } from "react";
import { Copy, Check, Container } from "lucide-react";

/**
 * CopyBlock
 * - Renders a single command in a code-looking block.
 * - One-click copy to clipboard. Shows a "Copied" confirmation for ~1.5s.
 */
export default function CopyBlock({ command, label = "Command" }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!command) return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for older browsers / insecure contexts
      const ta = document.createElement("textarea");
      ta.value = command;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="rounded-md border border-[#30363d] bg-[#0d1117] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-2 text-xs text-[#8b949e] font-mono uppercase tracking-wide">
          <Container className="w-4 h-4 text-[#2f81f7]" />
          {label}
        </div>
        <button
          onClick={copy}
          disabled={!command}
          className="gh-btn !px-2 !py-1 text-xs"
          title={command ? "Copy to clipboard" : "Not available yet"}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#3fb950]" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="px-3 py-2.5 text-[12.5px] font-mono text-[#7ee787] whitespace-pre-wrap break-all overflow-x-auto">
        {command || (
          <span className="text-[#6e7681]">
            (image name will appear here once the build pushes it to Docker
            Hub)
          </span>
        )}
      </pre>
    </div>
  );
}
