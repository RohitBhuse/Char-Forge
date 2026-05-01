import React from 'react';

const CosmicKdeChart = ({ data, title, icon }) => {
  const validData = data ? data.filter(d => d.label !== 'Unknown') : [];
  const unknownData = data ? data.find(d => d.label === 'Unknown') : null;

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 shadow-xl flex flex-col h-full hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-headline text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">{icon}</span>
          {title}
        </h3>
        {unknownData && (
          <span className="text-[9px] font-label text-outline uppercase tracking-widest bg-surface-container py-1 px-2 rounded">
            {unknownData.count} Unknown
          </span>
        )}
      </div>

      <div className="flex-grow flex flex-col justify-end relative w-full h-48">
        {validData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10px] font-label uppercase tracking-widest text-outline-variant/40 italic">No data detected</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(89,222,155,0.15)]">
              <defs>
                <linearGradient id="kde-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#59de9b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#59de9b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {(() => {
                const maxCount = Math.max(...validData.map(d => d.count), 1);
                const width = 400;
                const height = 200;
                const padX = 20;
                const padY = 20;
                const innerW = width - padX * 2;
                const innerH = height - padY * 2;

                const points = validData.map((d, i) => {
                  const x = padX + (i / Math.max((validData.length - 1), 1)) * innerW;
                  const y = height - padY - (d.count / maxCount) * innerH;
                  return { x, y, d };
                });

                const linePath = points.map((p, i) => {
                  if (i === 0) return `M ${p.x},${p.y}`;
                  const prev = points[i - 1];
                  const cp1x = prev.x + (p.x - prev.x) / 2;
                  const cp1y = prev.y;
                  const cp2x = prev.x + (p.x - prev.x) / 2;
                  const cp2y = p.y;
                  return `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p.x},${p.y}`;
                }).join(' ');

                const areaPath = points.length > 1
                  ? `${linePath} L ${points[points.length - 1].x},${height - padY} L ${points[0].x},${height - padY} Z`
                  : `${linePath} L ${points[0].x},${height - padY} L ${points[0].x},${height - padY} Z`;

                return (
                  <>
                    <path d={areaPath} fill="url(#kde-gradient)" className="transition-all duration-500" />
                    <path d={linePath} fill="none" stroke="#59de9b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500" />

                    {/* Data Points */}
                    {points.map((p, i) => (
                      <g key={i} className="group/point cursor-crosshair">
                        <circle cx={p.x} cy={p.y} r="4" fill="#0e1512" stroke="#59de9b" strokeWidth="2" className="transition-all duration-300 group-hover/point:r-6 group-hover/point:fill="#59de9b"/>

                        {/* Tooltip (Hover) */}
                        <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <rect x={p.x - 30} y={p.y - 45} width="60" height="30" rx="4" fill="#1a251e" stroke="#2a3d31" />
                          <text x={p.x} y={p.y - 32} textAnchor="middle" fill="#59de9b" fontSize="10" fontWeight="bold" fontFamily="monospace">
                            {p.d.count}
                          </text>
                          <text x={p.x} y={p.y - 22} textAnchor="middle" fill="#8e9e95" fontSize="8" fontFamily="monospace">
                            {p.d.label}
                          </text>
                        </g>

                        {/* X-axis Label */}
                        <text x={p.x} y={height} textAnchor="middle" fill="#8e9e95" fontSize="9" className="font-label uppercase tracking-widest opacity-60">
                          {p.d.label.split('–')[0]}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default CosmicKdeChart;
