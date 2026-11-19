function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function isFinder(x, y, originX, originY) {
  const dx = x - originX;
  const dy = y - originY;
  if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null;
  const ring = dx === 0 || dy === 0 || dx === 6 || dy === 6;
  const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
  return ring || core;
}

export default function QrCode({ value, size = 168, className = "" }) {
  const n = 25;
  let seed = hashString(value);
  const cells = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const finder =
        isFinder(x, y, 0, 0) ?? isFinder(x, y, n - 7, 0) ?? isFinder(x, y, 0, n - 7);
      let on;
      if (finder !== null) {
        on = finder;
      } else {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        on = (seed >>> 12) % 100 < 46;
      }
      if (on) cells.push([x, y]);
    }
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${n} ${n}`}
      className={className}
      role="img"
      aria-label={`Demonstration QR code for ${value}`}
      shapeRendering="crispEdges"
    >
      <rect width={n} height={n} fill="#FFFFFF" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#172B24" />
      ))}
    </svg>
  );
}