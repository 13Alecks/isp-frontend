"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Brain,
  History,
  LogOut,
} from "lucide-react";
import { Button } from "@/shared/components/ui";
import { useAuth } from "@/providers";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/predict", label: "Predict", icon: Brain },
  { href: "/predictions", label: "History", icon: History },
];

const HIDDEN_ROUTES = ["/", "/login", "/signup"];

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Hide navbar on landing and auth pages.
  if (HIDDEN_ROUTES.includes(pathname)) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo + nav */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4.5" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              ISP
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3">
          {user?.email && (
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user.email}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
