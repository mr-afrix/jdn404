import { useEffect, useState } from "react";
import { Activity } from "@/components/Activity";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { Social } from "@/components/Social";
import { Stack } from "@/components/Stack";
import { Stats } from "@/components/Stats";
import { Work } from "@/components/Work";
import { useTheme } from "@/hooks/useMotion";

const ScrollRule = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 h-[2px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
        style={{ width: `${progress}%`, transition: "width 120ms linear" }}
      />
    </div>
  );
};

export const Index = () => {
  const { toggle } = useTheme();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && /^(input|textarea|select)$/i.test(target.tagName);
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "/") {
        event.preventDefault();
        window.dispatchEvent(new Event("focus-repo-search"));
      }
      if (event.key.toLowerCase() === "t") toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--border)) 1px, transparent 0)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(circle at 50% 0%, #000, transparent 72%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 0%, #000, transparent 72%)",
          }}
        />
      </div>

      <Loader />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Activity />
        <Work />
        <Stack />
        <Social />
      </main>
      <Footer />
      <ScrollRule />
    </div>
  );
};

export default Index;
