const nodes = [
  { id: "student", x: 60, y: 210, r: 7 },
  { id: "mentor", x: 220, y: 70, r: 9 },
  { id: "alumni", x: 340, y: 160, r: 7 },
  { id: "club", x: 130, y: 320, r: 6 },
  { id: "project", x: 300, y: 300, r: 6 },
  { id: "event", x: 380, y: 40, r: 5 },
];

const edges = [
  ["student", "mentor"], ["mentor", "alumni"], ["student", "club"],
  ["mentor", "project"], ["club", "project"], ["alumni", "event"], ["mentor", "event"],
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

const NetworkConstellation = () => (
  <svg viewBox="0 0 420 380" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="edgeGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#C9A24B" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {edges.map(([a, b], i) => {
      const from = byId[a];
      const to = byId[b];
      const length = Math.hypot(to.x - from.x, to.y - from.y);
      return (
        <line
          key={`${a}-${b}`}
          x1={from.x} y1={from.y} x2={to.x} y2={to.y}
          stroke="url(#edgeGradient)" strokeWidth="1.5"
          strokeDasharray={length} strokeDashoffset={length}
          style={{ animation: `draw-line 1.2s ease-out ${0.15 * i}s forwards` }}
        />
      );
    })}
    {nodes.map((n, i) => (
      <g key={n.id}>
        <circle cx={n.x} cy={n.y} r={n.r + 6} fill="#C9A24B" opacity="0.12"
          style={{ animation: `pulse-ring 2.8s ease-in-out ${0.2 * i}s infinite`, transformOrigin: `${n.x}px ${n.y}px` }} />
        <circle cx={n.x} cy={n.y} r={n.r} fill={n.id === "mentor" ? "#C9A24B" : "#F7F5F0"}
          stroke="#C9A24B" strokeWidth="1.5" opacity="0"
          style={{ animation: `fade-in 0.5s ease-out ${0.15 * i + 0.3}s forwards` }} />
      </g>
    ))}
    <style>{`
      @keyframes draw-line { to { stroke-dashoffset: 0; } }
      @keyframes fade-in { to { opacity: 1; } }
      @keyframes pulse-ring { 0%, 100% { transform: scale(1); opacity: 0.12; } 50% { transform: scale(1.35); opacity: 0.22; } }
    `}</style>
  </svg>
);

export default NetworkConstellation;
