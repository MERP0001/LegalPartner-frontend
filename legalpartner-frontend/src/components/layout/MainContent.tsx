"use client";
import { useAuthStore } from "@/store/authStore";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore();
  return <main className={"flex-1 " + (auth.isAuthenticated ? "md:pl-72" : "")}>{children}</main>;
}