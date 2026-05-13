type BarsProps = {
  className?: string;
  widths?: [number, number, number, number];
};

export function Bars({
  className,
  widths = [70, 100, 38, 88],
}: BarsProps) {
  const barH = 12;
  const gap = 6;
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={["block size-full", className].filter(Boolean).join(" ")}
    >
      {widths.map((w, i) => (
        <rect
          key={i}
          x={0}
          y={(barH + gap) * i + (100 - (barH * 4 + gap * 3)) / 2}
          width={w}
          height={barH}
          rx={barH / 2}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
