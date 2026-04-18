import Link from 'next/link';

const CAPABILITIES = [
  {
    icon: '⚙️',
    title: 'Process Intelligence',
    desc: 'Extract structured process models from unstructured operational narratives. Map roles, systems, artifacts, and decision points into analyzable graph representations.',
  },
  {
    icon: '🔍',
    title: 'Diagnostics & Evidence',
    desc: 'Identify bottlenecks, compliance gaps, redundancies, and risk hotspots — each finding anchored to specific evidence from the source narrative.',
  },
  {
    icon: '📊',
    title: 'Scenario Comparison',
    desc: 'Model alternative process designs and compare them against the current baseline across cost, time, quality, and risk — all with deterministic projections.',
  },
  {
    icon: '💰',
    title: 'Financial Projections',
    desc: 'Generate structured ROI, savings, and payback analysis. Fully deterministic — no probabilistic guesswork, no hidden AI-generated estimates.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Describe Your Process',
    desc: 'Submit an operational process narrative — documentation, interview transcripts, or workflow descriptions in natural language.',
  },
  {
    num: '02',
    title: 'Automated Analysis',
    desc: 'Quintia executes a 7-stage internal pipeline: ontology extraction, graph construction, diagnostics, scenario generation, financial projection, critic review, and synthesis.',
  },
  {
    num: '03',
    title: 'Actionable Intelligence',
    desc: 'Receive process graphs, evidence-linked diagnostics, scenario comparisons, deterministic financial projections, and executive synthesis — fully traceable.',
  },
];

const TRUST_PILLARS = [
  {
    icon: '🏗️',
    title: 'Internal-First Engine',
    desc: 'All analysis runs inside Quintia\u2019s own processing engine. No external AI providers, no third-party orchestration. Your data stays within your boundary.',
  },
  {
    icon: '🧮',
    title: 'Deterministic Financial Layer',
    desc: 'Financial projections use explicit deterministic formulas with auditable inputs. Every number is reproducible and traceable — no black-box estimates.',
  },
  {
    icon: '📎',
    title: 'Evidence-Linked Findings',
    desc: 'Every diagnostic, issue, and recommendation traces back to specific evidence from the source narrative. Full explainability by design.',
  },
  {
    icon: '📋',
    title: 'Typed Structured Outputs',
    desc: 'All outputs follow strict typed contracts — process graphs, diagnostics, scenarios, financials, synthesis. Machine-readable, auditable, reproducible.',
  },
];

const USE_CASES = [
  {
    icon: '🏭',
    label: 'Industrial Operations',
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
    label: 'IT & Professional Services',
    examples: 'Incident management, client onboarding, project delivery, audit workflows',
  },
];

const STATS = [
  { value: '7', label: 'Pipeline Stages' },
  { value: '100%', label: 'Deterministic' },
  { value: '0', label: 'External Dependencies' },
  { value: '∞', label: 'Reproducibility' },
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
          evidence-linked diagnostics, and deterministic financial projections —
          with full traceability and zero external dependencies.
        </p>
        <div className="q-hero-actions">
          <Link href="/projects/new" className="q-btn q-btn-primary" style={{ fontSize: 16, padding: '16px 44px' }}>
            Start New Analysis
          </Link>
          <Link href="/projects" className="q-btn q-btn-ghost" style={{ fontSize: 15, padding: '15px 36px' }}>
            View Projects
          </Link>
        </div>

        {/* Dashboard preview visual */}
        <div className="q-hero-visual q-animate-in-up" style={{ animationDelay: '200ms' }}>
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
              <div className="q-hero-visual-edge" />
              <div className="q-hero-visual-node" />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 48,
          marginTop: 48,
          flexWrap: 'wrap',
        }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="q-animate-in" style={{ textAlign: 'center', animationDelay: '300ms' }}>
              <div style={{
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--q-white)',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}>{stat.value}</div>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--q-slate-500)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: 4,
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WHAT QUINTIA DOES ============ */}
      <section className="q-landing-section">
        <div className="q-landing-section-header">
          <span className="q-landing-eyebrow">Capabilities</span>
          <h2 className="q-landing-heading">What Quintia Delivers</h2>
          <p className="q-landing-subheading">
            A complete process intelligence pipeline — from unstructured narratives to structured, auditable, actionable outputs.
          </p>
        </div>
        <div className="q-landing-grid-4">
          {CAPABILITIES.map((capability, i) => (
            <div key={capability.title} className={`q-landing-card q-animate-in q-stagger-${i + 1}`}>
              <div className="q-landing-card-icon">{capability.icon}</div>
              <h3 className="q-landing-card-title">{capability.title}</h3>
              <p className="q-landing-card-desc">{capability.desc}</p>
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
            <div key={step.num} className={`q-landing-step q-animate-in q-stagger-${i + 1}`}>
              <div className="q-landing-step-num">{step.num}</div>
              <div className="q-landing-step-content">
                <h3 className="q-landing-step-title">{step.title}</h3>
                <p className="q-landing-step-desc">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && <div className="q-landing-step-connector" aria-hidden="true" />}
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
          {TRUST_PILLARS.map((pillar, i) => (
            <div key={pillar.title} className={`q-landing-trust-card q-animate-in q-stagger-${i + 1}`}>
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
            Designed for organizations where process understanding drives operational,
            financial, and strategic decisions.
          </p>
        </div>
        <div className="q-landing-grid-3">
          {USE_CASES.map((useCase, i) => (
            <div key={useCase.label} className={`q-landing-usecase q-animate-in q-stagger-${i + 1}`}>
              <span className="q-landing-usecase-icon">{useCase.icon}</span>
              <div>
                <div className="q-landing-usecase-label">{useCase.label}</div>
                <div className="q-landing-usecase-examples">{useCase.examples}</div>
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
          Submit a single narrative. Receive structured process intelligence,
          evidence-linked diagnostics, and deterministic financial projections — in minutes.
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
      <footer className="q-landing-footer" role="contentinfo">
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
