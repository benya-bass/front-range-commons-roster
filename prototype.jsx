// Front Range Commons prototype — landing → signup → map reveal.
// Aesthetic direction switches via Tweaks panel.

const { useEffect, useMemo, useRef, useState } = React;

const TWEAK_DEFAULTS = {
  "direction": "fieldguide",
  "showCommonsBridge": true,
  "autoplayReveal": true
};

const DIRECTIONS = [
  { id: 'earthy',      label: 'Earthy / Handmade' },
  { id: 'fieldguide',  label: 'Field-guide' },
  { id: 'modernist',   label: 'Quiet modernist' },
];

// ---------------- Landing ----------------
function Landing({ onBegin, direction }) {
  const counts = { people: 35, orgs: 11 };
  return (
    <div className="screen landing">
      <header className="topbar">
        <div className="mark">
          <span className="mark-glyph" aria-hidden="true">◐</span>
          <span className="mark-name">Front Range Commons</span>
        </div>
        <div className="topbar-meta map-mono">PRE-LAUNCH · ROSTER OPEN</div>
      </header>

      <main className="landing-main">
        <div className="landing-copy">
          <div className="eyebrow map-mono">A bioregional gathering — Colorado</div>
          <h1 className="display">
            There are more of us<br/>
            doing this work than<br/>
            <em>you think</em>.
          </h1>
          <p className="lede">
            We&rsquo;re building a roster — quietly, before the official Commons
            opens — of the people and organizations tending this bioregion.
            Soil rebuilders. Beaver advocates. Repair cafés. Seed savers.
            Watershed coalitions. Probably your neighbor.
          </p>
          <p className="lede secondary">
            Add yourself, see who&rsquo;s already on the map, and we&rsquo;ll
            help you find each other.
          </p>
          <div className="cta-row">
            <button className="btn primary" onClick={onBegin}>Add yourself to the map →</button>
            <div className="counter">
              <span className="num">{counts.people}</span> people · <span className="num">{counts.orgs}</span> orgs already on
            </div>
          </div>
        </div>

        <aside className="landing-aside">
          <MiniMap />
          <div className="aside-caption map-mono">
            Fort Collins → Colorado Springs · the corridor we live in
          </div>
        </aside>
      </main>

      <footer className="bottombar">
        <div className="map-mono small">In partnership with SPIRIT of the Front Range</div>
        <div className="map-mono small">v. 0 — prototype</div>
      </footer>
    </div>
  );
}

// A tiny static teaser map for the landing aside.
function MiniMap() {
  return (
    <svg viewBox="0 0 800 1000" className="frmap mini" preserveAspectRatio="xMidYMid meet">
      <rect width="800" height="1000" fill="var(--map-bg, #efe9d8)" />
      <path d="M 0 0 L 240 0 C 250 60, 200 100, 230 160 C 260 220, 200 260, 240 320 C 280 380, 220 410, 250 470 C 285 540, 230 580, 265 640 C 300 700, 240 740, 270 800 C 300 870, 250 920, 280 1000 L 0 1000 Z"
            fill="var(--map-mountain, #c8b893)" opacity="0.9" />
      <path d="M 545 0 C 555 200, 550 400, 545 600 S 580 850, 620 1000"
            fill="none" stroke="var(--map-road, rgba(60,40,20,.35))"
            strokeWidth="1.2" strokeDasharray="4 6" />
      {window.COMMONERS.slice(0, 30).map((p, i) => (
        <circle key={p.id} cx={p.x} cy={p.y} r={p.kind === 'org' ? 4 : 3}
                fill={p.kind === 'org' ? 'var(--pin-org)' : 'var(--pin-person)'}
                opacity="0.85"
                className="mini-pin" style={{ animationDelay: `${i * 60}ms` }} />
      ))}
    </svg>
  );
}

// ---------------- Signup ----------------
function Signup({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    name: '', email: '', area: '', offers: '', optIn: true,
  });
  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const canSubmit = form.name.trim() && form.email.trim() && form.area && form.offers.trim();

  return (
    <div className="screen signup">
      <header className="topbar">
        <button className="backlink" onClick={onBack}>← back</button>
        <div className="topbar-meta map-mono">STEP 1 OF 1 · ROSTER ENTRY</div>
      </header>

      <main className="signup-main">
        <div className="signup-intro">
          <div className="eyebrow map-mono">Add yourself</div>
          <h2 className="display medium">What do you bring to the bioregion?</h2>
          <p className="lede">
            Three minutes. Six fields. No password. We&rsquo;ll keep your
            exact address private — just your neighborhood appears on the map.
          </p>
        </div>

        <form className="form" onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit(form); }}>
          <div className="field">
            <label className="map-mono">YOUR NAME</label>
            <input value={form.name} onChange={update('name')} placeholder="First & last, or how you go" />
          </div>
          <div className="field">
            <label className="map-mono">EMAIL</label>
            <input type="email" value={form.email} onChange={update('email')} placeholder="so we can find you when the Commons opens" />
          </div>
          <div className="field">
            <label className="map-mono">NEIGHBORHOOD OR TOWN</label>
            <select value={form.area} onChange={update('area')}>
              <option value="">Choose one…</option>
              {window.NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <div className="hint">Neighborhood-level only. Your street stays yours.</div>
          </div>
          <div className="field span2">
            <label className="map-mono">WHAT YOU BRING — SKILLS, RESOURCES, OFFERINGS</label>
            <textarea rows="3" value={form.offers} onChange={update('offers')}
              placeholder="e.g. seed saving, beekeeping mentorship, a wood chipper to share, soil testing, mutual aid dispatch…" />
          </div>
          <div className="field span2 checkbox">
            <label>
              <input type="checkbox" checked={form.optIn} onChange={(e) => setForm(f => ({ ...f, optIn: e.target.checked }))} />
              <span>Show me on the public map so others can find me.</span>
            </label>
          </div>
          <div className="submit-row">
            <button type="submit" className="btn primary" disabled={!canSubmit}>
              Add me to the roster →
            </button>
            <div className="hint">You can edit or remove yourself anytime.</div>
          </div>
        </form>
      </main>
    </div>
  );
}

// ---------------- Map reveal ----------------
function MapReveal({ user, direction, autoplay }) {
  const total = window.COMMONERS.length;
  const [revealed, setRevealed] = useState(autoplay ? 0 : total);
  const [stage, setStage] = useState(autoplay ? 'welcome' : 'done');
  const [selected, setSelected] = useState(null);

  const userCoords = useMemo(() => {
    const c = window.AREA_COORDS[user?.area] || [560, 500];
    return { x: c[0] + 6, y: c[1] - 6 };
  }, [user]);

  useEffect(() => {
    if (!autoplay) return;
    const t1 = setTimeout(() => setStage('reveal'), 1300);
    return () => clearTimeout(t1);
  }, [autoplay]);

  useEffect(() => {
    if (stage !== 'reveal') return;
    let i = 0;
    const tick = () => {
      i += 1;
      setRevealed(i);
      if (i < total) {
        const t = setTimeout(tick, i < 12 ? 90 : i < 30 ? 60 : 45);
        timers.push(t);
      } else {
        const t = setTimeout(() => setStage('done'), 700);
        timers.push(t);
      }
    };
    const timers = [];
    const start = setTimeout(tick, 200);
    timers.push(start);
    return () => timers.forEach(clearTimeout);
  }, [stage, total]);

  const orgCount = window.COMMONERS.filter(c => c.kind === 'org').length;
  const peopleCount = total - orgCount;
  const userArea = user?.area || 'the Front Range';

  return (
    <div className="screen mapreveal">
      <header className="topbar">
        <div className="mark">
          <span className="mark-glyph" aria-hidden="true">◐</span>
          <span className="mark-name">Front Range Commons</span>
        </div>
        <div className="topbar-meta map-mono">YOU&rsquo;RE ON · #{String(total + 1).padStart(3, '0')}</div>
      </header>

      <div className="mapreveal-body">
        <div className="map-wrap" onClick={() => setSelected(null)}>
          <window.FrontRangeMap
            revealed={revealed}
            userPin={userCoords}
            onPinClick={setSelected}
            selectedId={selected?.id} />

          {stage === 'welcome' && (
            <div className="welcome-overlay">
              <div className="welcome-card">
                <div className="eyebrow map-mono">welcome</div>
                <div className="display medium">{user?.name || 'Friend'}.</div>
                <div className="welcome-sub">You&rsquo;re pin #{total + 1}. Watch the others light up.</div>
              </div>
            </div>
          )}
        </div>

        <aside className="reveal-side">
          <div className="side-section">
            <div className="eyebrow map-mono">on the roster</div>
            <div className="big-count">
              <CountUp to={revealed + (stage === 'done' ? 1 : 0)} />
              <span className="of">/ {total + 1}</span>
            </div>
            <div className="count-sub">
              <span><strong>{peopleCount}</strong> people</span>
              <span className="dot">·</span>
              <span><strong>{orgCount}</strong> aligned orgs</span>
              <span className="dot">·</span>
              <span><strong>1</strong> you</span>
            </div>
          </div>

          {selected ? (
            <div className="side-section profile-card">
              <div className="eyebrow map-mono">{selected.kind === 'org' ? 'organization' : 'commoner'}</div>
              <div className="profile-name">{selected.name}</div>
              <div className="profile-area map-mono">{selected.area}</div>
              <div className="profile-offers">&ldquo;{selected.offers}&rdquo;</div>
              <button className="btn tiny" onClick={() => setSelected(null)}>close</button>
            </div>
          ) : (
            <div className="side-section">
              <div className="eyebrow map-mono">you&rsquo;re here</div>
              <div className="you-here">{userArea}</div>
              <p className="you-text">
                Tap any pin to see what they bring. When the full Commons
                launches this fall, you&rsquo;ll be able to message them
                directly, propose gatherings, and co-tend projects.
              </p>
              <p className="you-text small">
                For now: this is the visibility. The proof that you&rsquo;re
                not alone in this.
              </p>
            </div>
          )}

          <div className="side-section legend">
            <div className="legend-row"><span className="lg dot person" /> commoner (person)</div>
            <div className="legend-row"><span className="lg dot org" /> aligned organization</div>
            <div className="legend-row"><span className="lg dot you" /> you</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CountUp({ to }) {
  const [n, setN] = useState(0);
  const target = useRef(to);
  useEffect(() => {
    target.current = to;
    let raf;
    const tick = () => {
      setN(prev => {
        if (prev === target.current) return prev;
        const delta = target.current - prev;
        const step = Math.sign(delta) * Math.max(1, Math.ceil(Math.abs(delta) / 6));
        return prev + step;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className="countup">{n}</span>;
}

// ---------------- Commons Bridge (floating) ----------------
function CommonsBridge({ show, screen }) {
  if (!show) return null;
  return (
    <div className={`bridge ${screen}`}>
      <div className="bridge-eyebrow map-mono">the bridge</div>
      <div className="bridge-copy">
        This is the pre-launch warm-up. The full Front Range Commons —
        with member proposals, mutual-aid threads, and co-stewardship
        agreements — opens <strong>this fall</strong>.
      </div>
      <a className="bridge-link map-mono" href="#">read the intention →</a>
    </div>
  );
}

// ---------------- Persistent app nav ----------------
const NAV_ITEMS = [
  { id: 'map',    label: 'roster' },
  { id: 'events', label: 'events' },
  { id: 'news',   label: 'news' },
];

function AppNav({ screen, onNavigate, user }) {
  return (
    <nav className="appnav">
      <div className="appnav-inner">
        {NAV_ITEMS.map(item => (
          <button key={item.id}
                  className={`appnav-link map-mono ${screen === item.id ? 'on' : ''}`}
                  onClick={() => onNavigate(item.id)}>
            {item.label}
          </button>
        ))}
        <div className="appnav-spacer" />
        {user && (
          <div className="appnav-user map-mono" title={user.area}>
            <span className="appnav-user-dot" />
            {user.name.split(' ')[0]}
          </div>
        )}
      </div>
    </nav>
  );
}

// ---------------- App ----------------
function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState('landing'); // landing | signup | map | events | news
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.direction = t.direction;
  }, [t.direction]);

  const goToScreen = (s) => {
    if (s !== 'landing' && s !== 'signup' && !user) {
      setUser({ name: 'Visitor', area: 'North Boulder', offers: 'curiosity' });
    }
    setScreen(s);
  };

  const showNav = screen === 'map' || screen === 'events' || screen === 'news';

  return (
    <div className="app" data-direction={t.direction} data-screen={screen}>
      {screen === 'landing' && (
        <Landing onBegin={() => setScreen('signup')} direction={t.direction} />
      )}
      {screen === 'signup' && (
        <Signup
          onBack={() => setScreen('landing')}
          onSubmit={(form) => { setUser(form); setScreen('map'); }} />
      )}
      {screen === 'map' && (
        <MapReveal user={user} direction={t.direction} autoplay={t.autoplayReveal} />
      )}
      {screen === 'events' && <window.EventsScreen />}
      {screen === 'news' && <window.NewsScreen />}

      {showNav && <AppNav screen={screen} onNavigate={goToScreen} user={user} />}

      <CommonsBridge show={t.showCommonsBridge && screen !== 'signup'} screen={screen} />

      <window.TweaksPanel title="Tweaks" defaultOpen={false}>
        <window.TweakSection label="Aesthetic direction">
          <window.TweakSelect
            label="Direction"
            value={t.direction}
            onChange={(v) => setTweak('direction', v)}
            options={DIRECTIONS.map(d => ({ value: d.id, label: d.label }))} />
          <div className="tweak-hint">
            Same flow, three rooms. Switch to compare.
          </div>
        </window.TweakSection>
        <window.TweakSection label="Behavior">
          <window.TweakToggle
            label="Auto-play map reveal"
            value={t.autoplayReveal}
            onChange={(v) => setTweak('autoplayReveal', v)} />
          <window.TweakToggle
            label="Show Commons Bridge"
            value={t.showCommonsBridge}
            onChange={(v) => setTweak('showCommonsBridge', v)} />
        </window.TweakSection>
        <window.TweakSection label="Jump to">
          <div className="tweak-row">
            {['landing', 'signup', 'map', 'events', 'news'].map(s => (
              <button key={s} className="tweak-pill"
                      onClick={() => goToScreen(s)}>{s}</button>
            ))}
          </div>
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
