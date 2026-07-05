import { Tag } from "lucide-react";
import CopyBlock from "./CopyBlock";

/**
 * ImageInstallPanel
 * - Shows the built image name pulled from the server (jobStore.imageName).
 * - Provides a one-click "docker pull" copy block for users.
 */
export default function ImageInstallPanel({ imageName, status }) {
  const pullCommand = imageName ? `docker pull ${imageName}` : "";

  const finished = status === "success" || status === "failed";

  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#30363d]">
        <Tag className="w-4 h-4 text-[#2f81f7]" />
        <h3 className="text-sm font-semibold text-[#e6edf3]">
          Built Image
        </h3>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-[#8b949e] font-medium">
            Image Name
          </p>
          <p
            className={`font-mono text-sm break-all ${
              imageName ? "text-[#e6edf3]" : "text-[#6e7681] italic"
            }`}
          >
            {imageName || "(awaiting push to Docker Hub…)"}
          </p>
        </div>

        <CopyBlock
          label="docker pull"
          command={finished ? pullCommand : ""}
        />

        {!imageName && status !== "failed" && (
          <p className="text-xs text-[#6e7681]">
            The image name will be available after the build finishes pushing
            it to Docker Hub.
          </p>
        )}
      </div>
    </div>
  );
}
