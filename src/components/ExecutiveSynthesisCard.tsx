import type { SynthesisOutput } from '@/src/lib/types/contracts';

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: 15 }}>{title}</h4>
      <p style={{ margin: 0, color: '#475569', lineHeight: 1.6, fontSize: 14 }}>{content}</p>
    </div>
  );
}

export default function ExecutiveSynthesisCard({ data }: { data: SynthesisOutput }) {
  return (
    <div
      style={{
        padding: '24px',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
      }}
    >
      <Section title="Executive Summary" content={data.executive_summary} />
      <Section title="Current State" content={data.current_state} />
      <Section title="Recommendation" content={data.recommendation} />
      <Section title="Roadmap" content={data.roadmap} />
    </div>
  );
}
