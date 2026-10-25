import { useId } from "react";

/**
 * Black lacquer chopsticks with a red band and a gold hairline, drawn in the
 * hero composition's 840 × 760 coordinate space (see design/izumi.pen).
 */
const STICKS = [
  { name: "back", tip: [479, 26], angle: -24 },
  { name: "front", tip: [409, 65], angle: -20 },
] as const;

const LENGTH = 720;
const TIP = 2.5;
const BUTT = 10;

const halfWidthAt = (y: number) => TIP + (BUTT - TIP) * (y / LENGTH);
const band = (from: number, to: number) =>
  `${-halfWidthAt(from)},${from} ${halfWidthAt(from)},${from} ${halfWidthAt(to)},${to} ${-halfWidthAt(to)},${to}`;

export function Chopsticks({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 840 760" className={className} overflow="visible" aria-hidden>
      <defs>
        <linearGradient id={`${id}-lacquer`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#050404" />
          <stop offset="0.35" stopColor="#3d3735" />
          <stop offset="0.6" stopColor="#0e0c0c" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <linearGradient id={`${id}-red`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6a0a18" />
          <stop offset="0.35" stopColor="#e2343f" />
          <stop offset="0.6" stopColor="#a50d26" />
          <stop offset="1" stopColor="#4a0510" />
        </linearGradient>
      </defs>
      {STICKS.map((stick) => (
        <g key={stick.name} transform={`translate(${stick.tip[0]} ${stick.tip[1]}) rotate(${stick.angle})`}>
          <polygon points={band(0, LENGTH)} fill={`url(#${id}-lacquer)`} />
          <polygon points={band(466, 469)} fill="#c9a46a" />
          <polygon points={band(470, 590)} fill={`url(#${id}-red)`} />
          {/* Specular highlight running along the stick */}
          <line x1={-0.6} y1={6} x2={-2.4} y2={LENGTH - 20} stroke="#fff" strokeOpacity="0.16" strokeWidth="0.9" />
        </g>
      ))}
    </svg>
  );
}
