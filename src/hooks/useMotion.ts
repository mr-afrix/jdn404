import { useCallback, useEffect, useRef, useState } from "react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function useReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function useTilt<T extends HTMLElement>(max = 7) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const frame = useRef<number | null>(null);

  const apply = useCallback(
    (rx: number, ry: number) => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      if (reduced) return;
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => apply(-py * max * 2, px * max * 2));
    },
    [apply, max, reduced],
  );

  const onPointerLeave = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    apply(0, 0);
  }, [apply]);

  return reduced ? { ref } : { ref, onPointerMove, onPointerLeave };
}

export function useCountUp(value: number, duration = 800) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(0);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setShown(origin + (value - origin) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);

  return Math.round(shown);
}

export function useTyping(lines: readonly string[], typeMs = 62, deleteMs = 28, pauseMs = 1700) {
  const reduced = useReducedMotion();
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      setText(lines[0] ?? "");
      return;
    }
    const target = lines[index] ?? "";
    if (!deleting && text === target) {
      const hold = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(hold);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % lines.length);
      return;
    }
    const delay = setTimeout(
      () => setText(deleting ? target.slice(0, text.length - 1) : target.slice(0, text.length + 1)),
      deleting ? deleteMs : typeMs,
    );
    return () => clearTimeout(delay);
  }, [text, deleting, index, lines, typeMs, deleteMs, pauseMs, reduced]);

  return text;
}

export function useCopy(resetMs = 1600) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const copy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const el = document.createElement("textarea");
        el.value = value;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(value);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), resetMs);
    },
    [resetMs],
  );

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  return { copied, copy };
}

export function useScrollSpy(ids: readonly string[], offset = 140) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);
  return active;
}

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem("hiamjaden.theme", next ? "dark" : "light");
      } catch {}
      return next;
    });
  }, []);
  return { dark, toggle };
}
