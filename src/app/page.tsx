import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

// Merchant session cookie — kept in sync by hand with the identically-named
// constant in proxy.ts (MERCHANT_COOKIE). This is the same cheap,
// edge-level *presence* check proxy.ts already uses, not a real auth
// verification: it only decides whether to show the public landing page
// below or send a returning visitor straight back into the login→/activity
// bounce that already exists today (see login/page.tsx's useEffect, which
// calls the real /auth/me check). An expired/invalid cookie still ends up
// on /login and gets redirected again by that real check — same outcome as
// before this file changed.
const MERCHANT_COOKIE = "konfirm_session";

// Authenticated visitors (session cookie present) keep the exact behavior
// this route always had: redirect to /login, which immediately bounces them
// to /activity once it confirms the session server-side. Unauthenticated
// visitors now see a real marketing page instead of being redirected
// straight to a login wall — grant reviewers and first-time visitors need
// to know what Konfirm is before being asked to log in or sign up.
export default async function RootPage() {
  const cookieStore = await cookies();
  if (cookieStore.has(MERCHANT_COOKIE)) {
    redirect("/login");
  }

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="brand">
          <span className="mark">✓</span> Konfirm
        </div>
        <div className="nav-links">
          <Link href="/login">Log in</Link>
          <Link href="/signup" className="cta">
            Sign up
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <span className="landing-badge">Testnet · Pre-launch</span>
        <h1>Non-custodial Stellar payments, for merchants and for machines.</h1>
        <p className="lead">
          Konfirm checks every payment on-chain before it&apos;s ever marked paid — whether
          that&apos;s a customer paying your store, or one AI agent paying another thousands of
          times a second.
        </p>
        <div className="cta-row">
          <Link href="/signup" className="btn-primary">
            Create a merchant account
          </Link>
          <Link href="/login" className="btn-secondary">
            Log in
          </Link>
        </div>

        <div className="proof-row">
          <div className="proof-card">
            <span className="num">2-of-3</span>
            <span className="label">Multisig treasury signs every payout — no single key controls your funds.</span>
          </div>
          <div className="proof-card">
            <span className="num">100%</span>
            <span className="label">Of payments independently reconciled against Horizon before they&apos;re marked paid.</span>
          </div>
          <div className="proof-card">
            <span className="num">$0</span>
            <span className="label">Held by Konfirm. Funds settle straight to your own Stellar address.</span>
          </div>
        </div>
      </section>

      <div className="landing-grid">
        <div className="landing-feature">
          <div className="eyebrow">Merchant payments</div>
          <h2>Get paid, verified against the chain — not against a browser tab.</h2>
          <p>
            Create a payment link. Your customer pays with a classic Stellar transfer or a SEP-7
            wallet deep link, in XLM, USDC, or EURC. A backend reconciler independently checks the
            transfer against Horizon before attesting it on-chain — a payment is never marked paid
            just because the frontend says so.
          </p>
          <ul>
            <li>XLM, USDC, and EURC support</li>
            <li>On-chain compliance screening on every payment</li>
            <li>Payouts settle through a 2-of-3 multisig treasury contract</li>
          </ul>
        </div>

        <div className="landing-feature agentic">
          <div className="eyebrow">Agentic payments (x402)</div>
          <h2>Built for AI agents paying AI agents, at machine speed.</h2>
          <p>
            Stripe and Coinbase Commerce weren&apos;t built for agent-to-agent API micropayments.
            Konfirm&apos;s Soroban payment-channel contract lets two agents transact off-chain at
            high frequency and settle on-chain once, at close.
          </p>
          <div className="flow-steps" aria-hidden="true">
            <div className="flow-step">
              <span className="flow-num">1</span>
              <span className="flow-label">Open a channel</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-num">2</span>
              <span className="flow-label">Commit off-chain, instantly</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-num">3</span>
              <span className="flow-label">Settle once, on-chain</span>
            </div>
          </div>
          <ul>
            <li>Built for the x402 pattern used by paid AI APIs</li>
            <li>One on-chain settlement, regardless of commit volume</li>
          </ul>
        </div>
      </div>

      <footer className="landing-footer">
        Konfirm is a non-custodial Stellar payment processor. <Link href="/signup">Get started</Link>
      </footer>
    </div>
  );
}
