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
      <nav className="landing-nav" aria-label="Primary">
        <div className="brand">
          <span className="mark">✓</span> Konfirm
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <Link href="/login">Log in</Link>
          <Link href="/signup" className="nav-cta">
            Sign up
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-blobs" aria-hidden="true" />
        <span className="landing-badge">Stellar testnet · pre-launch</span>
        <h1>
          Get paid on Stellar, <em className="serif-em">checked before it counts.</em>
        </h1>
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

        <div className="testnet-pill">
          <span>Live on Stellar testnet today. Mainnet is next.</span>
          <a href="#features">See how it works</a>
        </div>
      </section>

      <section id="features" className="landing-section">
        <div className="section-eyebrow">Why Konfirm</div>
        <h2 className="section-head">
          Payments that prove themselves, <em className="serif-em">not just promise&nbsp;to.</em>
        </h2>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-num" aria-hidden="true">
              01
            </span>
            <span className="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 14a4 4 0 005.66 0l2.83-2.83a4 4 0 00-5.66-5.66l-1 .99" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 10a4 4 0 00-5.66 0L5.51 12.83a4 4 0 005.66 5.66l1-.99" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3>Payment links that work like links</h3>
            <p>
              Create a payment link, send it anywhere. Your customer pays with a classic Stellar
              transfer or a SEP-7 wallet deep link, in XLM, USDC, or EURC — no plugin, no custom
              checkout to build.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-num" aria-hidden="true">
              02
            </span>
            <span className="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3>Checked on-chain, not taken on faith</h3>
            <p>
              A backend reconciler independently verifies every transfer against Horizon before
              it&apos;s attested. A payment is never marked paid because a browser tab said so —
              only because the ledger did.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-num" aria-hidden="true">
              03
            </span>
            <span className="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3>Built for machines, not just people</h3>
            <p>
              A Soroban payment-channel contract lets two AI agents commit payments off-chain at
              machine speed and settle once, on-chain, at close — the x402 pattern for
              agent-to-agent micropayments.
            </p>
          </article>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-eyebrow">How it&apos;s built</div>
        <h2 className="section-head">
          Custody you can verify, <em className="serif-em">not a promise you&apos;re asked to trust.</em>
        </h2>
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

        <div className="chain-chips">
          <span className="chip">XLM</span>
          <span className="chip">USDC</span>
          <span className="chip">EURC</span>
          <span className="chip">Soroban</span>
          <span className="chip">Stellar testnet</span>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-eyebrow">Who it&apos;s for</div>
        <h2 className="section-head">
          Two very different customers, <em className="serif-em">one honest ledger&nbsp;check.</em>
        </h2>
        <div className="split-grid">
          <div className="split-col">
            <h3>Merchants</h3>
            <ul>
              <li>Accept XLM, USDC, or EURC on a payment link, no integration required</li>
              <li>Customers pay with a SEP-7 wallet deep link they already know</li>
              <li>Payouts settle through your own 2-of-3 multisig treasury, never Konfirm&apos;s</li>
            </ul>
          </div>
          <div className="split-col">
            <h3>Builders &amp; agents</h3>
            <ul>
              <li>Open a Soroban payment channel between two agents</li>
              <li>Commit micropayments off-chain, instantly, as many times as you need</li>
              <li>Settle once on-chain, no matter how many commits happened in between</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>Non-custodial</span>
          <span>On-chain reconciled</span>
          <span>2-of-3 multisig</span>
          <span>SEP-7 wallet links</span>
          <span>XLM · USDC · EURC</span>
          <span>Soroban payment channels</span>
          <span>x402 agent payments</span>
          <span>Stellar testnet</span>
          <span>Non-custodial</span>
          <span>On-chain reconciled</span>
          <span>2-of-3 multisig</span>
          <span>SEP-7 wallet links</span>
          <span>XLM · USDC · EURC</span>
          <span>Soroban payment channels</span>
          <span>x402 agent payments</span>
          <span>Stellar testnet</span>
        </div>
      </div>

      <section id="faq" className="landing-section">
        <div className="section-eyebrow">FAQ</div>
        <h2 className="section-head">
          Questions worth asking <em className="serif-em">before you integrate.</em>
        </h2>
        <div className="faq-list">
          <details className="faq-item">
            <summary>Is Konfirm live with real funds?</summary>
            <p>
              Not yet. Konfirm runs on Stellar testnet today — every flow on this page works
              end-to-end, just not with mainnet funds.
            </p>
          </details>
          <details className="faq-item">
            <summary>Does Konfirm ever hold my money?</summary>
            <p>
              No. Konfirm is non-custodial — payouts settle straight to your own Stellar address
              through a 2-of-3 multisig treasury contract, so no single key, including
              Konfirm&apos;s, can move funds alone.
            </p>
          </details>
          <details className="faq-item">
            <summary>What assets and wallets are supported?</summary>
            <p>
              XLM, USDC, and EURC, paid via a classic Stellar transfer or a SEP-7 wallet deep
              link — any wallet that supports it.
            </p>
          </details>
          <details className="faq-item">
            <summary>How does Konfirm know a payment is real?</summary>
            <p>
              Before anything is marked paid, a backend reconciler independently checks the
              transfer against Horizon, Stellar&apos;s network API. The frontend never gets the
              final word.
            </p>
          </details>
          <details className="faq-item">
            <summary>What&apos;s the Soroban payment channel for?</summary>
            <p>
              It&apos;s built for AI agents paying AI agents — the x402 pattern. Two agents open a
              channel, commit payments off-chain at high frequency, and settle once on-chain when
              they&apos;re done.
            </p>
          </details>
          <details className="faq-item">
            <summary>Can I try it without real funds?</summary>
            <p>
              Yes — <Link href="/get-test-usdc">grab testnet USDC from our faucet</Link> and run a
              full payment end-to-end.
            </p>
          </details>
        </div>
      </section>

      <section className="landing-section final-cta">
        <h2 className="section-head">
          Start on testnet, <em className="serif-em">build like it&apos;s mainnet.</em>
        </h2>
        <div className="cta-row">
          <Link href="/signup" className="btn-primary">
            Create a merchant account
          </Link>
          <Link href="/docs" className="btn-secondary">
            Read the docs
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        Konfirm is a non-custodial Stellar payment processor. <Link href="/signup">Get started</Link> ·{" "}
        <Link href="/docs">Docs</Link>
      </footer>
    </div>
  );
}
