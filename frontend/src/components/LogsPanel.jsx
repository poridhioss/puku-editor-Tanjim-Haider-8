import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDown, Pause, Play, Terminal } from "lucide-react";

/**
 * LogsPanel
 * - Renders an array of log lines.
 * - "Tail mode" is ON by default: the latest line is always visible at the
 *   bottom of the panel.
 * - If the user scrolls up to read history, tail mode automatically PAUSES
 *   and a "Resume tail" badge appears.
 * - When the user scrolls back to the bottom (within ~32px), tail mode
 *   resumes.
 * - The user can also manually toggle tail mode with the button.
 */
export default function LogsPanel({ logs }) {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  // Persisted across renders without retriggering the effect on every log.
  const lastLogCountRef = useRef(0);

  const [following, setFollowing] = useState(true);
  const [autoFollow, setAutoFollow] = useState(true);

  // Distance from the bottom (in px) that still counts as "at the bottom".
  const STICK_THRESHOLD = 32;

  // ----- scroll handling ----------------------------------------------------
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    const atBottom = distanceFromBottom <= STICK_THRESHOLD;
    setFollowing(atBottom);
    setAutoFollow(atBottom);
  }, []);

  // ----- auto-scroll when new logs arrive ----------------------------------
  useEffect(() => {
    // Only act when there are new logs and tail mode is engaged.
    if (!autoFollow) return;
    if (logs.length === lastLogCountRef.current) return;

    lastLogCountRef.current = logs.length;

    // Use rAF so the DOM has the new height before we scroll.
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    });
  }, [logs, autoFollow]);

  // Also handle initial render / first paint so newest isn't above the fold.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // ----- manual scroll-to-bottom button ------------------------------------
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setFollowing(true);
    setAutoFollow(true);
  };

  const toggleAutoFollow = () => {
    if (autoFollow) {
      setAutoFollow(false);
    } else {
      scrollToBottom();
    }
  };

  // ------------------------------------------------------------------------
  return (
    <div className="relative rounded-lg border border-[#30363d] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#161b22] border-b border-[#30363d] px-3 py-2">
        <div className="flex items-center gap-2 text-xs text-[#8b949e]">
          <Terminal className="w-4 h-4" />
          <span className="font-mono uppercase tracking-wide">
            Build Output
          </span>
          <span className="text-[#6e7681]">·</span>
          <span className="font-mono">{logs.length} lines</span>
        </div>

        <div className="flex items-center gap-2">
          {following ? (
            <span className="gh-pill status-success" title="Live tail">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] follow-dot" />
              Live
            </span>
          ) : (
            <span
              className="gh-pill status-cloned"
              title="Scroll to bottom to resume live tail"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#a371f7]" />
              Paused
            </span>
          )}

          <button
            onClick={toggleAutoFollow}
            className="gh-btn !px-2 !py-1"
            title={autoFollow ? "Pause live tail" : "Resume live tail"}
          >
            {autoFollow ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Log body */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="terminal-bg h-[420px] overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-5"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#6e7681] text-sm">
            Waiting for output…
          </div>
        ) : (
          <pre className="whitespace-pre-wrap break-all text-[#7ee787]">
            {logs.join("\n")}
          </pre>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Floating "jump to latest" button when user is NOT following */}
      {!following && logs.length > 0 && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 gh-btn-primary !px-3 !py-1.5 !text-xs"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          Jump to latest
        </button>
      )}
    </div>
  );
}
