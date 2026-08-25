"use client";

import { useState } from "react";
import HRSidebar from "@/components/hr/Sidebar";
import HRTopbar from "@/components/hr/Topbar";

interface HRShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
  };
}

export default function HRShell({ children, user }: HRShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <HRSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <HRTopbar onMenuClick={() => setSidebarOpen(true)} user={user} />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
