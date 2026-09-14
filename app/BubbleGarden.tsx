'use client';
import { Check } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { getRoots, getDirectionOptions, type Audience, type StoryFormat } from './story-data';
import { packBubbles, radius, type BubbleNode } from './bubble-layout';

export default function BubbleGarden({audience, format, onChange}: {
  audience: Audience; format: StoryFormat; onChange: (labels: string[]) => void;
}) {
  const roots = useMemo(() => getRoots(audience, format), [audience, format]);
  const [nodes, setNodes] = useState<BubbleNode[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setNodes(packBubbles(roots.map((item, i) => ({
      id: item.label, label: item.label, level: 0,
      x: 480 + Math.cos(i * 2.39996) * Math.sqrt(i) * 40,
      y: 430 + Math.sin(i * 2.39996) * Math.sqrt(i) * 40, px: 480, py: 430,
    }))));
    setSelected([]); onChange([]);
    requestAnimationFrame(() => {
      if (viewport.current) {
        viewport.current.scrollLeft = 480 - viewport.current.clientWidth / 2;
        viewport.current.scrollTop = 430 - viewport.current.clientHeight / 2;
      }
    });
  }, [roots]);
  function pick(node: BubbleNode) {
    const next = selected.includes(node.id) ? selected.filter(id => id !== node.id) : [...selected, node.id];
    setSelected(next);
    onChange(nodes.filter(n => next.includes(n.id)).map(n => n.label));
    if (selected.includes(node.id) || node.level >= 9 || nodes.some(n => n.parent === node.id)) return;
    const path = node.id.split('/');
    const root = roots.find(r => r.label === path[0]);
    const known = node.level === 0 ? Object.keys(root?.children ?? {}) : node.level === 1 ? root?.children[node.label] ?? [] : [];
    const labels = [...new Set([...known, ...getDirectionOptions(path, audience, format)])].slice(0, 5);
    const direction = Math.atan2(node.y - 430, node.x - 480);
    setNodes(packBubbles([...nodes, ...labels.map((label, i) => {
      const angle = direction + (i - (labels.length - 1) / 2) * 1.05;
      return {id: node.id + '/' + label, label, level: node.level + 1,
        x: node.x + Math.cos(angle) * 80, y: node.y + Math.sin(angle) * 80,
        px: node.x, py: node.y, parent: node.id};
    })]));
  }
  return <div className="water-viewport" ref={viewport}><div className="water-world">
    <div className="water-glow" />
    {nodes.map(node => <button key={node.id} aria-pressed={selected.includes(node.id)}
      className={`water-orb level-${Math.min(node.level, 2)} ${selected.includes(node.id) ? 'picked' : ''}`}
      style={{left:node.x, top:node.y, width:radius(node)*2, height:radius(node)*2,
        marginLeft:-radius(node), marginTop:-radius(node), '--birth-x':`${node.px-node.x}px`,
        '--birth-y':`${node.py-node.y}px`} as CSSProperties} onClick={() => pick(node)}>
      <span>{node.label}</span>{selected.includes(node.id) && <i className="orb-check"><Check /></i>}
    </button>)}
  </div></div>;
}
