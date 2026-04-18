import Link from 'next/link';

const CAPABILITIES = [
  {
    icon: '⚙️',
    title: 'Process Intelligence',
    desc: 'Automatically extract structured process models from unstructured operational narratives. Map roles, systems, artifacts, and decision points into analyzable graph representations.',
  },
  {
    icon: '🔍',
    title: 'Diagnostics & Evidence',
    desc: 'Identify bottlenecks, compliance gaps, redundancies, and risk hotspots. Every diagnostic finding is anchored to specific evidence from the source narrative.',
  },
  {
    icon: '📊',
    title: 'Scenario Comparison',
    desc: 'Model alternative process designs and compare them against the baseline across cost, time, quality, and risk dimensions — all with deterministic projections.',
  },
  {
    icon: '💰',
    title: 'Financial Projections',
    desc: 'Generate structured ROI, savings, implementation cost, and payback analysis. Fully deterministic — no probabilistic guesswork, no hidden AI-generated estimates.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Submit Process Narrative',
    desc: 'Describe an operational process in natural language — as written documentation, interview transcripts, or workflow descriptions.',
  },
  {
    num: '02',
    title: 'Automated Analysis Pipeline',
    desc: 'Quintia runs a multi-stage internal pipeline: extraction, diagnostics, scenario generation, financial projection, synthesis, and critic review.',
  },
  {
    num: '03',
    title: 'Structured Intelligence Output',
    desc: 'Receive process graphs, diagnostics with evidence, scenario comparisons, financial projections, and executive synthesis — all deterministic and traceable.',
  },
];

const TRUST_PILLARS = [
  {
    icon: '🏗️',
    title: 'Internal-First Engine',
    desc: 'All analysis runs inside Quintia\'s own engine. No external AI providers, no third-party orchestration. Your data stays within your boundary.',
  },
  {
    icon: '🧮',
    title: 'Deterministic Financials',
    desc: 'Financial projections use a deterministic calculation layer with explicit formulas and auditable inputs. No black-box estimates.',
  },
  {
    icon: '📎',
    title: 'Evidence-Linked Diagnostics',
    desc: 'Every finding, issue, and recommendation traces back to specific evidence from the source narrative. Full explainability, no hallucination.',
  },
  {
    icon: '📋',
    title: 'Structured Outputs',
    desc: 'All outputs follow strict typed contracts — process graphs, diagnostics, scenarios, financials, synthesis. Machine-readable, auditable, reproducible.',
  },
];

const USE_CASES = [
  {
    icon: '🏭',
    label: 'Manufacturing',
    examples: 'Production line optimization, quality control workflows, maintenance scheduling',
  },
  {
    icon: '🏥',
    label: 'Healthcare Operations',
    examples: 'Patient intake processes, referral pathways, compliance workflows',
  },
  {
    icon: '🏦',
    label: 'Financial Services',
    examples: 'Loan processing, KYC/AML workflows, claims management',
  },
  {
    icon: '🚚',
    label: 'Supply Chain & Logistics',
    examples: 'Order fulfillment, warehouse operations, procurement processes',
  },
  {
    icon: '🏛️',
    label: 'Government & Public Sector',
    examples: 'Permit processing, service delivery, regulatory compliance',
  },
  {
    icon: '🔧',
    label: 'Professional Services',
    examples: 'Client onboarding, project delivery, audit processes',
  },
];

export default function HomePage() {
  return (
    <div className="q-landing">
      {/* ============ HERO ============ */}
      <section className="q-hero">
        <div className="q-hero-tagline">Deterministic Process Intelligence</div>
        <h1 className="q-hero-title">QUINTIA</h1>
        <p className="q-hero-subtitle">
          Transform operational narratives into structured process models,
          diagnostics, and deterministic financial projections — with full
          evidence traceability and zero external dependencies.
        </p>
        <div className="q-hero-actions">
          <Link href="/projects/new" className="q-btn q-btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
            Start New Analysis
          </Link>
          <Link href="/projects" className="q-btn q-btn-ghost" style={{ fontSize: 16, padding: '16px 40px' }}>
            View Projects
          </Link>
        </div>

        {/* Dashboard preview visual */}
        <div className="q-hero-visual">
          <div className="q-hero-visual-inner">
            <div className="q-hero-visual-row">
              {['Baseline Cost', 'Expected Savings', 'ROI', 'Payback'].map((label) => (
                <div key={label} className="q-hero-mini-card">
                  <div className="q-hero-mini-label">{label}</div>
                  <div className="q-hero-mini-bar" />
                </div>
              ))}
            </div>
            <div className="q-hero-visual-graph">
              <div className="q-hero-visual-node" />
              <div className="q-hero-visual-edge" />
              <div className="q-hero-visual-node" />
              <div className="q-hero-visual-edge" />
              <div className="q-hero-visual-node" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT QUINTIA DOES ============ */}
      <section className="q-landing-section">
        <div className="q-landing-section-header">
          <span className="q-landing-eyebrow">Capabilities</span>
          <h2 className="q-landing-heading">What Quintia Does</h2>
          <p className="q-landing-subheading">
            A complete process intelligence pipeline — from unstructured narratives to structured, auditable, actionable outputs.
          </p>
        </div>
        <div className="q-landing-grid-4">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className="q-landing-card">
              <div className="q-landing-card-icon">{cap.icon}</div>
              <h3 className="q-landing-card-title">{cap.title}</h3>
              <p className="q-landing-card-desc">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="q-landing-section">
        <div className="q-landing-section-header">
          <span className="q-landing-eyebrow">Workflow</span>
          <h2 className="q-landing-heading">How It Works</h2>
          <p className="q-landing-subheading">
            Three steps from narrative input to structured intelligence output.
          </p>
        </div>
        <div className="q-landing-steps">
          {STEPS.map((step, i) => (
            <div key={step.num} className="q-landing-step">
              <div className="q-landing-step-num">{step.num}</div>
              <div className="q-landing-step-content">
                <h3 className="q-landing-step-title">{step.title}</h3>
                <p className="q-landing-step-desc">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && <div className="q-landing-step-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* ============ WHY TRUST QUINTIA ============ */}
      <section className="q-landing-section">
        <div className="q-landing-section-header">
          <span className="q-landing-eyebrow">Architecture</span>
          <h2 className="q-landing-heading">Why Trust Quintia</h2>
          <p className="q-landing-subheading">
            Built on principles of determinism, traceability, and internal-first processing.
            No external AI providers. No black boxes.
          </p>
        </div>
        <div className="q-landing-grid-2">
          {TRUST_PILLARS.map((pillar) => (
            <div key={pillar.title} className="q-landing-trust-card">
              <div className="q-landing-trust-icon">{pillar.icon}</div>
              <div>
                <h3 className="q-landing-trust-title">{pillar.title}</h3>
                <p className="q-landing-trust-desc">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ USE CASES ============ */}
      <section className="q-landing-section">
        <div className="q-landing-section-header">
          <span className="q-landing-eyebrow">Applications</span>
          <h2 className="q-landing-heading">Built for Complex Operations</h2>
          <p className="q-landing-subheading">
            Quintia is designed for organizations where process understanding drives operational,
            financial, and strategic decisions.
          </p>
        </div>
        <div className="q-landing-grid-3">
          {USE_CASES.map((uc) => (
            <div key={uc.label} className="q-landing-usecase">
              <span className="q-landing-usecase-icon">{uc.icon}</span>
              <div>
                <div className="q-landing-usecase-label">{uc.label}</div>
                <div className="q-landing-usecase-examples">{uc.examples}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className="q-landing-cta">
        <h2 className="q-landing-cta-title">
          Ready to understand your processes?
        </h2>
        <p className="q-landing-cta-subtitle">
          Start with a single narrative. Get structured process intelligence,
          diagnostics, and financial projections in minutes.
        </p>
        <div className="q-hero-actions">
          <Link href="/projects/new" className="q-btn q-btn-primary" style={{ fontSize: 16, padding: '16px 44px' }}>
            Start Your First Analysis
          </Link>
          <Link href="/projects" className="q-btn q-btn-ghost" style={{ fontSize: 14, padding: '14px 32px' }}>
            Browse Projects
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="q-landing-footer">
        <div className="q-landing-footer-inner">
          <div className="q-landing-footer-brand">
            <span className="q-nav-logo-mark" style={{ width: 28, height: 28, fontSize: 12 }}>Q</span>
            <span style={{ fontWeight: 800, letterSpacing: '0.1em', color: 'var(--q-white)', fontSize: 14 }}>QUINTIA</span>
          </div>
          <div className="q-landing-footer-tagline">
            Deterministic Process Intelligence Platform
          </div>
          <div className="q-landing-footer-links">
            <Link href="/projects">Projects</Link>
            <Link href="/projects/new">New Analysis</Link>
          </div>
          <div className="q-landing-footer-copy">
            © {new Date().getFullYear()} Quintia Intelligence. Internal-first. Deterministic. Auditable.
          </div>
        </div>
      </footer>
    </div>
  );
}
