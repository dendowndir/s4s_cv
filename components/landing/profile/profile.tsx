"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import ThreeScene from "@/components/treejs/ThreeScene";
import ParticlesBackground from "@/components/ui/particles-background";
import author from "@/public/author.jpg";

interface Props {
  className?: string;
}

const panelMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  // Keep a simple transition object — omit custom 'ease' to satisfy framer-motion's TypeScript types
  transition: { duration: 0.6 },
};

const WinPanel: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <motion.div
    {...panelMotion}
    className="relative bg-[#0b0e14] border border-[#1f2430] shadow-[0_0_0_1px_#000,inset_0_0_0_1px_#1a1f2b]"
  >
    {/* title bar */}
    <div className="flex items-center justify-between px-3 py-1 bg-gradient-to-b from-[#1a1f2b] to-[#0f131c] border-b border-[#2a3140] text-xs text-white/80 font-mono">
      <span>{title}</span>
      <span className="opacity-60">■ □ ✕</span>
    </div>

    <div className="p-4 text-sm text-white/80">{children}</div>
  </motion.div>
);

export const Profile: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-[#05060a] via-[#04050a] to-black px-4 py-14",
        className,
      )}
    >
      <ParticlesBackground />

      <Container className="relative z-10 flex flex-col gap-10">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight font-figtree">
            Kyrylo Kymakovskiy
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-white/70 leading-relaxed">
            Kyrylo is a computer systems engineer with a strong focus on Linux
            infrastructure, automation, and production reliability. He enjoys
            building systems that stay calm under pressure, scale predictably,
            and remain understandable months later. Known for a sharp technical
            mindset, curiosity, and a healthy sense of humor.
          </p>
        </motion.header>

        {/* MAIN GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-6">
            <WinPanel title="user.profile">
              <div className="flex gap-4 items-start">
                <div className="w-40 h-40 border border-[#2a3140] bg-black overflow-hidden">
                  <img
                    src={author.src}
                    alt="Kyrylo"
                    className="w-full h-full object-cover contrast-110 grayscale-[10%]"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-semibold">
                    Systems Engineer — Production
                  </h3>
                  <p className="mt-2 text-xs text-white/60 leading-relaxed">
                    Works with real infrastructure, real traffic and real
                    consequences. Focused on availability, observability and
                    long-term maintainability.
                  </p>
                </div>
              </div>
            </WinPanel>

            <WinPanel title="render.viewport">
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <ThreeScene />
              </motion.div>
            </WinPanel>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6">
            <WinPanel title="experience.log">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium">
                    Computer Systems Engineer — KESZ-UA
                  </h4>
                  <p className="text-xs text-white/50">
                    Apr 2024 – Present · Kyiv region
                  </p>
                  <p className="mt-2 text-xs leading-relaxed">
                    Kyrylo deploys and maintains Linux-based services with high
                    availability requirements. He works extensively with Docker,
                    Zabbix monitoring, Terraform (IaC), and virtualization
                    platforms. Automates routine operations, optimizes system
                    performance, and resolves complex production incidents.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-medium">
                    System Administrator — COSMONOVA|NET
                  </h4>
                  <p className="text-xs text-white/50">
                    Oct 2023 – Apr 2024 · Kyiv
                  </p>
                  <p className="mt-2 text-xs leading-relaxed">
                    Hands-on Linux administration, networking (DNS, DHCP, VPN),
                    Docker containers, and CI/CD basics. Focused on stability,
                    monitoring, and fast issue resolution in office
                    infrastructure.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-medium">
                    Junior System Administrator — NDA
                  </h4>
                  <p className="text-xs text-white/50">Apr 2023 – Oct 2023</p>
                  <p className="mt-2 text-xs leading-relaxed">
                    First professional experience in system administration.
                    Learned Linux fundamentals, monitoring, troubleshooting,
                    basic networking, and container concepts. Built a strong
                    foundation for further growth in infrastructure engineering.
                  </p>
                </div>
              </div>
            </WinPanel>

            <WinPanel title="skills.matrix">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  "Linux",
                  "Docker",
                  "Terraform",
                  "Zabbix",
                  "Python",
                  "Bash",
                  "CI/CD",
                  "Virtualization",
                  "Networking",
                  "Automation",
                ].map((skill) => (
                  <motion.div
                    key={skill}
                    whileHover={{ x: 4 }}
                    className="border border-[#2a3140] px-2 py-1 bg-[#0a0d14]"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </WinPanel>
          </div>
        </section>
      </Container>
    </div>
  );
};
