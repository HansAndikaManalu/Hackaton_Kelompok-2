"use client";

import { Menu, Bell } from "lucide-react";
import UserMenu from "@/components/Navbar/UserMenu"; // Pakai UserMenu milikmu

interface TopbarProps {
  onMenuClick: () => void;
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export default function HRTopbar({ onMenuClick, user }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Toggle Button for Mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">
          Recruiter Control Panel
        </span>
      </div>

      {/* Right Side Tools */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Dropdown */}
        <UserMenu userName={user.name} userEmail={user.email} userRole="hr" />
      </div>
    </header>
  );
}
