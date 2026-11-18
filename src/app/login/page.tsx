"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import { API_BASE } from "@/lib/api";
import { reportError } from "@/lib/report-error";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Surface a distinct banner when the user was bounced here by a real
  // session expiry (401), as opposed to a backend outage or network error.
  const reason = searchParams.get("reason");
  const sessionExpired = reason === "session_expired";

  // Preserve the return path so a bounced user lands back where they were
  // (e.g. /new with a restored draft) instead of the default /activity.
  const rawNext = searchParams.get("next");
  const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/activity";

  // Already-authenticated visitors shouldn't see the login form — bounce
  // them straight to the app instead.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        if (!cancelled && res.ok) {
          router.replace(nextPath);
        }
      } catch {
        // Ignore — just means we stay on the login page.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, nextPath]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof body.message === "string" ? body.message : "Could not log in. Please try again.");
      }
      router.push(nextPath);
    } catch (err) {
      reportError("login", err);
      setStatus(err instanceof Error ? err.message : "Could not log in. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card narrow">
        <div className="brand" style={{ marginBottom: 24 }}>
          <span className="mark">✓</span> Konfirm
        </div>
        <h1 style={{ marginBottom: 22 }}>Log in</h1>
        {sessionExpired && (
          <div className="status error" role="alert" aria-live="assertive" style={{ marginBottom: 16 }}>
            Your session expired. Please log in again.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              maxLength={72}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </button>
          <div
            className={`status${status ? " error" : ""}`}
            role="alert"
            aria-live={status ? "assertive" : "polite"}
          >
            {status}
          </div>
        </form>
        <div className="footer">
          <Link href="/forgot-password">Forgot your password?</Link>
          <br />
          New here? <Link href="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
