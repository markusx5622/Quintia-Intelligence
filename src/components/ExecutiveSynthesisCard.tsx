import type { SynthesisOutput } from '@/src/lib/types/contracts';

const SECTIONS: { key: keyof SynthesisOutput; label: string; icon: string }[] = [
  { key: 'executive_summary', label: 'Executive Summary', icon: '📋' },
  { key: 'current_state', label: 'Current State Assessment', icon: '🔍' },
  { key: 'recommendation', label: 'Strategic Recommendation', icon: '💡' },
  { key: 'roadmap', label: 'Implementation Roadmap', icon: '🗺️' },
];

export default function ExecutiveSynthesisCard({ data }: { data: SynthesisOutput }) {
  return (
    <div className="q-card">
      {SECTIONS.map(({ key, label, icon }) => (
        <div key={key} className="q-synthesis-section">
          <div className="q-synthesis-label">
            <span aria-hidden="true">{icon}</span> {label}
          </div>
          <div className="q-synthesis-content">{data[key]}</div>
        </div>
      ))}
    </div>
  );
}
