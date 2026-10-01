"use client";

import { useAuth } from "@/providers/auth.provider";


export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <div className="rounded-lg border p-4">
          <p>
            <strong>Name:</strong>{" "}
            {user?.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user?.email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {user?.role}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-md border px-4 py-2"
        >
          Logout
        </button>
      </div>
    </main>
  );
}