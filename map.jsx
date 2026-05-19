// Front Range map — a stylized SVG with topo gestures, the I-25 corridor,
// a few rivers, named anchor cities, and animated pins.

const { useEffect, useMemo, useRef, useState } = React;

// Cities to label on the map
const CITIES = [
  { name: 'Fort Collins', x: 600, y: 95, anchor: 'start' },
  { name: 'Loveland',     x: 580, y: 195, anchor: 'start' },
  { name: 'Longmont',     x: 550, y: 320, anchor: 'start' },
  { name: 'Boulder',      x: 478, y: 388, anchor: 'end' },
  { name: 'Golden',       x: 432, y: 552, anchor: 'end' },
  { name: 'Denver',       x: 525, y: 565, anchor: 'start' },
  { name: 'Aurora',       x: 612, y: 580, anchor: 'start' },
  { name: 'Castle Rock',  x: 552, y: 695, anchor: 'start' },
  { name: 'Colo. Springs', x: 632, y: 905, anchor: 'start' },
  { name: 'Estes Park',   x: 360, y: 230, anchor: 'end' },
  { name: 'Nederland',    x: 370, y: 420, anchor: 'end' },
];

// Hand-drawn-ish ridgeline path for the Rockies (west edge)
const RIDGELINE = `
  M 0 0
  L 240 0
  C 250 60, 200 100, 230 160
  C 260 220, 200 260, 240 320
  C 280 380, 220 410, 250 470
  C 285 540, 230 580, 265 640
  C 300 700, 240 740, 270 800
  C 300 870, 250 920, 280 1000
  L 0 1000 Z
`.replace(/\s+/g, ' ').trim();

// Topo contour lines — concentric-ish wobbles paralleling the ridge
function buildTopo(offset) {
  return `
    M ${offset} 0
    C ${offset + 30} 80, ${offset - 10} 150, ${offset + 20} 230
    C ${offset + 50} 310, ${offset - 5} 380, ${offset + 30} 470
    C ${offset + 60} 560, ${offset + 5} 640, ${offset + 40} 740
    C ${offset + 70} 830, ${offset + 15} 920, ${offset + 50} 1000
  `.replace(/\s+/g, ' ').trim();
}

// River squiggles
const SOUTH_PLATTE = 'M 470 540 Q 540 580 580 660 T 720 900';
const POUDRE       = 'M 280 70 Q 380 100 500 100 T 700 95';
const BIG_THOMPSON = 'M 290 200 Q 420 200 540 195 T 720 220';
const ST_VRAIN     = 'M 330 295 Q 440 305 540 315 T 720 340';
const BOULDER_CK   = 'M 340 400 Q 430 405 490 405 T 720 470';

// I-25 dashed corridor
const I25 = 'M 545 0 C 555 200, 550 400, 545 600 S 580 850, 620 1000';

function FrontRangeMap({ revealed, userPin, onPinClick, selectedId }) {
  const ref = useRef(null);

  return (
    <svg ref={ref} className="frmap" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="papergrain" patternUnits="userSpaceOnUse" width="200" height="200">
          <rect width="200" height="200" fill="var(--map-bg, #efe9d8)" />
          <circle cx="20" cy="40" r="0.7" fill="var(--map-grain, rgba(60,40,20,.05))" />
          <circle cx="160" cy="80" r="0.6" fill="var(--map-grain, rgba(60,40,20,.05))" />
          <circle cx="90" cy="160" r="0.7" fill="var(--map-grain, rgba(60,40,20,.05))" />
          <circle cx="130" cy="30" r="0.5" fill="var(--map-grain, rgba(60,40,20,.05))" />
          <circle cx="40" cy="120" r="0.6" fill="var(--map-grain, rgba(60,40,20,.05))" />
        </pattern>
      </defs>

      {/* Paper / parchment fill */}
      <rect x="0" y="0" width="800" height="1000" fill="url(#papergrain)" />

      {/* Eastern plains subtle wash */}
      <rect x="280" y="0" width="520" height="1000" fill="var(--map-plains, rgba(0,0,0,0))" />

      {/* Mountain mass (west) */}
      <path d={RIDGELINE} fill="var(--map-mountain, #c8b893)" opacity="0.9" />

      {/* Topo lines */}
      {[180, 210, 245, 280, 315].map((o, i) => (
        <path key={o} d={buildTopo(o)} fill="none"
              stroke="var(--map-topo, rgba(60,40,20,.18))"
              strokeWidth={i % 2 === 0 ? 0.7 : 0.5} />
      ))}

      {/* Rivers */}
      <g fill="none" stroke="var(--map-river, #6b8aa3)" strokeWidth="1.6" opacity="0.55" strokeLinecap="round">
        <path d={POUDRE} />
        <path d={BIG_THOMPSON} />
        <path d={ST_VRAIN} />
        <path d={BOULDER_CK} />
        <path d={SOUTH_PLATTE} />
      </g>

      {/* I-25 corridor */}
      <path d={I25} fill="none" stroke="var(--map-road, rgba(60,40,20,.35))"
            strokeWidth="1.2" strokeDasharray="4 6" />

      {/* State border tick (east) */}
      <line x1="780" y1="0" x2="780" y2="1000"
            stroke="var(--map-border, rgba(60,40,20,.4))"
            strokeWidth="0.8" strokeDasharray="2 4" />

      {/* Compass + scale, lower-right */}
      <g transform="translate(700, 940)" className="map-furniture">
        <circle r="14" fill="none" stroke="var(--map-furniture, rgba(60,40,20,.5))" strokeWidth="0.8" />
        <path d="M 0 -12 L 3 0 L 0 12 L -3 0 Z" fill="var(--map-furniture, rgba(60,40,20,.5))" />
        <text x="0" y="-18" textAnchor="middle" fontSize="8"
              fill="var(--map-furniture, rgba(60,40,20,.5))" className="map-mono">N</text>
      </g>

      {/* City labels & dots */}
      {CITIES.map(c => (
        <g key={c.name}>
          <circle cx={c.x} cy={c.y} r="2.3" fill="var(--map-ink, #2a2620)" />
          <text x={c.x + (c.anchor === 'end' ? -6 : 6)} y={c.y + 3}
                textAnchor={c.anchor} fontSize="11"
                fill="var(--map-ink, #2a2620)" className="map-cityname">
            {c.name}
          </text>
        </g>
      ))}

      {/* Region label */}
      <text x="700" y="40" textAnchor="end" fontSize="10"
            fill="var(--map-furniture, rgba(60,40,20,.6))" className="map-mono"
            letterSpacing="2">FRONT RANGE · CO</text>

      {/* Commoner pins */}
      <g className="pins">
        {window.COMMONERS.map((p, i) => {
          const shown = revealed > i;
          const isOrg = p.kind === 'org';
          const isSelected = selectedId === p.id;
          return (
            <g key={p.id}
               className={`pin ${shown ? 'in' : ''} ${isOrg ? 'org' : 'person'} ${isSelected ? 'sel' : ''}`}
               transform={`translate(${p.x} ${p.y})`}
               style={{ transitionDelay: `${Math.min(i * 35, 1400)}ms` }}
               onClick={(e) => { e.stopPropagation(); onPinClick && onPinClick(p); }}>
              <circle className="pin-halo" r="14" />
              {isOrg ? (
                <rect x="-5" y="-5" width="10" height="10"
                      fill="var(--pin-org, #a47b2e)"
                      stroke="var(--paper, #fff)" strokeWidth="1.2" />
              ) : (
                <circle r="4.5" fill="var(--pin-person, #2b4a31)"
                        stroke="var(--paper, #fff)" strokeWidth="1.2" />
              )}
            </g>
          );
        })}

        {/* User pin (drawn last, on top) */}
        {userPin && (
          <g className={`pin user ${revealed >= window.COMMONERS.length ? 'in' : ''}`}
             transform={`translate(${userPin.x} ${userPin.y})`}>
            <circle className="pin-pulse" r="18" />
            <circle className="pin-pulse pin-pulse-2" r="18" />
            <circle r="7" fill="var(--accent, #b9533a)"
                    stroke="var(--paper, #fff)" strokeWidth="2" />
            <circle r="2.2" fill="var(--paper, #fff)" />
          </g>
        )}
      </g>
    </svg>
  );
}

window.FrontRangeMap = FrontRangeMap;
