import React from "react";
import ParticlesBackground from "@/components/ui/particles-background";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black relative">
      <ParticlesBackground />
      {children}
    </main>
  );
}
