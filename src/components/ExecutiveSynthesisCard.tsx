import type { SynthesisOutput } from '@/src/lib/types/contracts';

const SECTION_META: Record<string, { icon: string; accent: string }> = {
  'Executive Summary': { icon: '◈', accent: '#06b6d4' },
  'Current State': { icon: '◆', accent: '#f59e0b' },
  'Recommendation': { icon: '▲', accent: '#22c55e' },
  'Roadmap': { icon: '●', accent: '#8b5cf6' },
};

function Section({ title, content }: { title: string; content: string }) {
  const meta = SECTION_META[title] || { icon: '●', accent: '#3b82f6' };

  return (
    <div
      style={{
        marginBottom: 24,
        paddingLeft: 18,
        borderLeft: `2px solid ${meta.accent}25`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 12, color: meta.accent, opacity: 0.6 }}>{meta.icon}</span>
        <h4
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 700,
            color: meta.accent,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </h4>
      </div>
      <p
        style={{
          margin: 0,
          color: '#cbd5e1',
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        {content}
      </p>
    </div>
  );
}

export default function ExecutiveSynthesisCard({ data }: { data: SynthesisOutput }) {
  return (
    <div>
      <Section title="Executive Summary" content={data.executive_summary} />
      <Section title="Current State" content={data.current_state} />
      <Section title="Recommendation" content={data.recommendation} />
      <Section title="Roadmap" content={data.roadmap} />
    </div>
  );
}
