import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { TechStack } from "@/components/TechStack";
import { Languages } from "@/components/Languages";
import { TopRepos } from "@/components/TopRepos";
import { Repos } from "@/components/Repos";
import { Social } from "@/components/Social";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";

const ScrollProgress = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-muted/30">
      <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-150" style={{ width: `${p}%` }} />
    </div>
  );
};

const Index = () => (
  <div className="min-h-screen bg-background relative overflow-x-hidden">
    <Loader />
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
    </div>
    <main className="relative z-10">
      <Hero />
      <Stats />
      <TopRepos />
      <TechStack />
      <Languages />
      <Repos />
      <Social />
      <Footer />
    </main>
    <ScrollProgress />
  </div>
);

export default Index;
