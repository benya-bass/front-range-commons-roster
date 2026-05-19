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

// Hand-crafted topo contours for the Front Range foothills.
// Each line dips westward (lower x) where river canyons cut through the hogbacks,
// then bulges eastward on the rocky spurs between them.
// Canyon notch y-positions: Poudre≈80, BigThompson≈205, StVrain≈300,
//   BoulderCk≈410, ClearCk≈542
const TOPO_CONTOURS = [
  { w: 0.8, d: `M 228 0
    C 230 28, 224 55, 218 78   C 212 98, 236 125, 242 148
    C 245 165, 222 186, 218 203   C 215 218, 234 238, 242 258
    C 244 272, 224 285, 220 298   C 218 312, 236 335, 244 358
    C 247 378, 225 395, 220 410   C 217 424, 238 450, 246 474
    C 249 500, 226 525, 220 542   C 216 556, 236 584, 244 610
    C 248 635, 238 664, 244 694   C 250 722, 240 752, 248 782
    C 254 810, 244 840, 252 870   C 258 896, 246 924, 254 954
    C 259 974, 248 988, 257 1000` },
  { w: 0.65, d: `M 262 0
    C 268 30, 256 58, 242 80   C 228 99, 265 130, 280 153
    C 289 170, 260 188, 250 206   C 243 221, 268 249, 283 269
    C 291 285, 262 295, 252 309   C 245 323, 270 349, 285 375
    C 292 393, 262 403, 250 417   C 241 429, 268 461, 282 489
    C 290 511, 260 528, 248 543   C 238 559, 268 590, 282 617
    C 290 641, 275 673, 282 703   C 288 731, 275 763, 284 796
    C 290 822, 278 854, 287 884   C 293 910, 280 937, 291 963
    C 297 981, 284 992, 294 1000` },
  { w: 0.6, d: `M 302 0
    C 315 32, 295 65, 272 87   C 252 106, 299 143, 326 163
    C 341 180, 305 196, 286 213   C 270 229, 309 262, 333 283
    C 346 299, 310 311, 290 326   C 275 341, 318 374, 346 402
    C 359 420, 318 430, 292 444   C 272 457, 319 493, 346 521
    C 360 538, 318 550, 292 564   C 270 579, 319 614, 346 644
    C 359 667, 336 702, 347 734   C 356 762, 339 795, 351 828
    C 362 854, 344 882, 358 913   C 367 937, 349 962, 364 987
    C 370 995, 356 998, 367 1000` },
  { w: 0.55, d: `M 348 0
    C 373 35, 342 72, 308 93   C 278 113, 346 153, 383 177
    C 403 196, 358 211, 326 230   C 298 247, 350 282, 386 310
    C 406 327, 362 340, 328 358   C 300 373, 356 410, 396 443
    C 416 462, 371 473, 332 492   C 304 506, 360 543, 397 572
    C 417 589, 370 603, 330 622   C 301 638, 360 676, 397 710
    C 414 733, 392 764, 402 797   C 412 826, 393 857, 410 890
    C 422 913, 402 940, 420 967   C 429 983, 408 994, 422 1000` },
  { w: 0.5, d: `M 396 0
    C 430 38, 392 78, 346 99   C 308 119, 390 163, 437 190
    C 462 210, 410 228, 368 250   C 330 270, 400 310, 447 346
    C 470 364, 420 378, 374 400   C 338 418, 400 460, 448 497
    C 470 517, 417 534, 373 557   C 337 576, 403 618, 451 655
    C 472 677, 432 714, 446 750   C 458 781, 434 815, 452 852
    C 464 879, 441 912, 462 945   C 474 966, 451 981, 468 995
    C 476 999, 458 1000, 474 1000` },
];

// Rivers — multi-segment cubic beziers for realistic flow.
// Coordinate system: y increases southward, x increases eastward.
// Mountain front ≈ x 230–270; I-25 corridor ≈ x 545.

// Cache la Poudre: exits canyon W of Fort Collins, flows east then NE toward Greeley
const POUDRE = `M 180 48
  C 218 54, 265 62, 308 68   C 345 72, 380 76, 408 80
  C 438 83, 470 85, 500 86   C 525 87, 548 87, 568 87
  C 590 87, 614 84, 638 80   C 661 76, 685 71, 708 66
  C 726 62, 742 58, 758 53`;

// Big Thompson: RMNP → Big Thompson Canyon → Loveland → east plains
const BIG_THOMPSON = `M 192 232
  C 224 230, 268 224, 308 218   C 348 212, 385 207, 418 203
  C 450 200, 482 198, 514 196   C 537 194, 558 193, 580 192
  C 603 191, 628 190, 655 189   C 678 188, 702 187, 726 186
  C 744 185, 760 184, 774 183`;

// St. Vrain Creek: mountains → Lyons → Longmont → SE across plains
const ST_VRAIN = `M 200 302
  C 234 300, 278 297, 318 294   C 356 292, 392 291, 424 292
  C 452 293, 474 295, 500 299   C 524 303, 547 309, 570 315
  C 594 321, 620 327, 646 333   C 668 338, 692 343, 717 349
  C 734 353, 750 357, 764 361`;

// Boulder Creek: exits Boulder Canyon, flows east-SE across plains
const BOULDER_CK = `M 242 420
  C 280 417, 325 412, 362 409   C 398 407, 428 406, 455 406
  C 474 407, 490 409, 508 412   C 528 416, 550 421, 574 428
  C 597 435, 622 443, 647 452   C 669 460, 692 469, 714 478
  C 730 485, 746 492, 760 499`;

// Clear Creek: exits canyon at Golden → flows east-SE into plains
const CLEAR_CREEK = `M 266 550
  C 302 549, 348 547, 388 546   C 418 546, 441 546, 462 547
  C 482 548, 500 550, 520 554   C 542 558, 564 563, 587 568
  C 609 573, 632 578, 654 583   C 674 587, 694 591, 716 595`;

// South Platte: flows NORTH through Denver then curves NE toward Greeley
// (previous version had this flowing SE — corrected)
const SOUTH_PLATTE = `M 450 745
  C 458 722, 465 700, 470 676   C 475 653, 480 630, 485 607
  C 490 584, 496 567, 502 552   C 508 538, 514 525, 522 510
  C 530 497, 540 484, 552 470   C 566 456, 582 443, 600 430
  C 620 418, 642 408, 664 398   C 684 388, 706 378, 728 368
  C 746 360, 762 352, 778 344`;

// Fountain Creek: flows south through Colorado Springs toward Pueblo
const FOUNTAIN_CK = `M 608 838
  C 612 858, 616 879, 620 900   C 623 920, 626 940, 629 961
  C 631 977, 633 989, 635 1000`;

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
      {TOPO_CONTOURS.map((c, i) => (
        <path key={i} d={c.d} fill="none"
              stroke="var(--map-topo, rgba(60,40,20,.18))"
              strokeWidth={c.w} />
      ))}

      {/* Rivers */}
      <g fill="none" stroke="var(--map-river, #6b8aa3)" opacity="0.55" strokeLinecap="round">
        <path d={POUDRE} strokeWidth="1.4" />
        <path d={BIG_THOMPSON} strokeWidth="1.5" />
        <path d={ST_VRAIN} strokeWidth="1.3" />
        <path d={BOULDER_CK} strokeWidth="1.2" />
        <path d={CLEAR_CREEK} strokeWidth="1.1" />
        <path d={SOUTH_PLATTE} strokeWidth="2.0" />
        <path d={FOUNTAIN_CK} strokeWidth="1.0" />
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
