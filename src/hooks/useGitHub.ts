import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchRepos, GITHUB_USERNAME } from "@/lib/github";
import { useEffect, useRef, useState } from "react";

export function useGitHubUser(u = GITHUB_USERNAME) {
  return useQuery({ queryKey: ["gh-user", u], queryFn: () => fetchUser(u) });
}
export function useGitHubRepos(u = GITHUB_USERNAME) {
  return useQuery({ queryKey: ["gh-repos", u], queryFn: () => fetchRepos(u) });
}

export function useReveal < T extends HTMLElement > () {
  const ref = useRef < T > (null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true);
          obs.disconnect(); } }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export function useTyping(texts: string[], typeMs = 80, deleteMs = 40, pauseMs = 1800) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = texts[i];
    if (!del && text === cur) {
      const t = setTimeout(() => setDel(true), pauseMs);
      return () => clearTimeout(t);
    }
    if (del && text === "") {
      setDel(false);
      setI((p) => (p + 1) % texts.length);
      return;
    }
    const t = setTimeout(() => {
      setText(del ? cur.slice(0, text.length - 1) : cur.slice(0, text.length + 1));
    }, del ? deleteMs : typeMs);
    return () => clearTimeout(t);
  }, [text, del, i, texts, typeMs, deleteMs, pauseMs]);
  return text;
}