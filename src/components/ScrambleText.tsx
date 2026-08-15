import { useEffect, useState, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

interface ScrambleTextProps {
  text: string;
  delay?: number;
  scrollActive: boolean;
  videoReady: boolean;
}

export function ScrambleText({ text, delay = 0, scrollActive, videoReady }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [opacity, setOpacity] = useState(0);
  const phaseRef = useRef<"idle" | "scrambling-in" | "revealed" | "scrambling-out" | "hidden">("idle");
  const progressRef = useRef(0);
  const lastTimeRef = useRef(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!videoReady) return;

    let rafId: number;

    const tick = (now: number) => {
      const scrollActiveVal = scrollActive;

      if (phaseRef.current === "idle" && !scrollActiveVal && !startedRef.current) {
        startedRef.current = true;
        setTimeout(() => {
          phaseRef.current = "scrambling-in";
          progressRef.current = 0;
          lastTimeRef.current = performance.now();
        }, delay);
      }

      if (scrollActiveVal && (phaseRef.current === "revealed" || phaseRef.current === "scrambling-in")) {
        phaseRef.current = "scrambling-out";
        progressRef.current = 0;
        lastTimeRef.current = now;
      } else if (!scrollActiveVal && (phaseRef.current === "hidden" || phaseRef.current === "scrambling-out")) {
        phaseRef.current = "scrambling-in";
        progressRef.current = 0;
        lastTimeRef.current = now;
      }

      if (phaseRef.current === "scrambling-in") {
        const duration = 900;
        const delta = now - lastTimeRef.current;
        progressRef.current = Math.min(1, progressRef.current + delta / duration);
        lastTimeRef.current = now;
        const t = progressRef.current;

        let result = "";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") {
            result += " ";
            continue;
          }
          const threshold = i / text.length;
          if (t >= threshold + 0.15) {
            result += text[i];
          } else if (t >= threshold - 0.1) {
            result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else {
            result += "\u00A0";
          }
        }
        setDisplayText(result);
        setOpacity(1);

        if (t >= 1) {
          phaseRef.current = "revealed";
          setDisplayText(text);
        }
      } else if (phaseRef.current === "scrambling-out") {
        const duration = 700;
        const delta = now - lastTimeRef.current;
        progressRef.current = Math.min(1, progressRef.current + delta / duration);
        lastTimeRef.current = now;
        const t = progressRef.current;

        let result = "";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") {
            result += " ";
            continue;
          }
          const threshold = i / text.length;
          if (t >= threshold + 0.2) {
            result += "\u00A0";
          } else if (t >= threshold - 0.05) {
            result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else {
            result += text[i];
          }
        }
        setDisplayText(result);
        setOpacity(Math.max(0, 1 - t * 1.5));

        if (t >= 1) {
          phaseRef.current = "hidden";
          setDisplayText(text.replace(/\S/g, "\u00A0"));
          setOpacity(0);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [videoReady, scrollActive, text, delay]);

  const initialText = text.replace(/\S/g, "\u00A0");

  return (
    <span className="scramble-line" style={{ opacity }}>
      {displayText || initialText}
    </span>
  );
}
