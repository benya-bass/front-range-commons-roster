// Events Calendar + News Feed screens for Front Range Commons.

const { useMemo, useState } = React;

// ---------------- Events ----------------

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function parseEventDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function dayOfWeek(d) {
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
}
function groupByWeek(events) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const groups = [];
  let current = null;
  for (const ev of sorted) {
    const d = parseEventDate(ev.date);
    // Start of ISO-ish week (Mon)
    const day = (d.getDay() + 6) % 7;
    const monday = new Date(d); monday.setDate(d.getDate() - day);
    const key = monday.toISOString().slice(0, 10);
    if (!current || current.key !== key) {
      current = { key, start: monday, items: [] };
      groups.push(current);
    }
    current.items.push(ev);
  }
  return groups;
}

function EventsScreen() {
  const [filter, setFilter] = useState('all'); // all | spirit | community
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'spirit') return window.EVENTS.filter(e => e.spirit);
    if (filter === 'community') return window.EVENTS.filter(e => !e.spirit);
    return window.EVENTS;
  }, [filter]);

  const weeks = useMemo(() => groupByWeek(filtered), [filtered]);
  const active = selected || filtered[0];

  return (
    <div className="screen events">
      <header className="topbar">
        <div className="mark">
          <span className="mark-glyph" aria-hidden="true">◐</span>
          <span className="mark-name">Front Range Commons</span>
        </div>
        <div className="topbar-meta map-mono">ECOSYSTEM CALENDAR · MAY–JUN</div>
      </header>

      <div className="events-body">
        <section className="events-list">
          <div className="events-header">
            <div className="eyebrow map-mono">what&rsquo;s coming up</div>
            <h2 className="display medium">Forty-seven things to do on the Front Range this month.</h2>
            <p className="lede">
              Walks, work parties, reading groups, repair cafés, and the
              SPIRIT gatherings that hold the whole rhythm together.
            </p>
            <div className="filter-row">
              {[['all','everything'],['spirit','SPIRIT only'],['community','community']].map(([k, l]) => (
                <button key={k}
                        className={`filter-pill ${filter === k ? 'on' : ''}`}
                        onClick={() => setFilter(k)}>{l}</button>
              ))}
              <div className="filter-meta map-mono">{filtered.length} listed</div>
            </div>
          </div>

          <ul className="weeks">
            {weeks.map(w => (
              <li className="week" key={w.key}>
                <div className="week-label map-mono">
                  week of {MONTHS[w.start.getMonth()]} {w.start.getDate()}
                </div>
                <ul className="week-items">
                  {w.items.map(ev => {
                    const d = parseEventDate(ev.date);
                    const isActive = active && active.id === ev.id;
                    return (
                      <li key={ev.id}
                          className={`event-row ${ev.spirit ? 'spirit' : ''} ${isActive ? 'on' : ''}`}
                          onClick={() => setSelected(ev)}>
                        <div className="event-date">
                          <div className="event-dow map-mono">{dayOfWeek(d)}</div>
                          <div className="event-day">{d.getDate()}</div>
                          <div className="event-month map-mono">{MONTHS[d.getMonth()].toLowerCase()}</div>
                        </div>
                        <div className="event-meat">
                          <div className="event-title">
                            {ev.spirit && <span className="spirit-tick map-mono">spirit ·&nbsp;</span>}
                            {ev.title}
                          </div>
                          <div className="event-when map-mono">{ev.time} · {ev.where}</div>
                          <div className="event-host">hosted by <em>{ev.host}</em></div>
                        </div>
                        <div className="event-tags">
                          {ev.tags.map(t => <span className="tag map-mono" key={t}>{t}</span>)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          <div className="events-foot">
            <div className="eyebrow map-mono">have something to add?</div>
            <p className="lede secondary">
              When the full Commons opens, you&rsquo;ll be able to submit events
              directly. For now, email <em>events@frontrangecommons.org</em>{' '}
              and we&rsquo;ll get it on the next pull.
            </p>
          </div>
        </section>

        <aside className="events-detail">
          {active && (
            <div className="detail-card">
              {active.spirit && <div className="spirit-banner map-mono">a SPIRIT gathering</div>}
              <div className="eyebrow map-mono">{active.tags.join(' · ')}</div>
              <h3 className="detail-title">{active.title}</h3>
              <div className="detail-when">
                <DateBlock dateStr={active.date} />
                <div>
                  <div className="detail-time">{active.time}</div>
                  <div className="detail-where">{active.where}</div>
                </div>
              </div>
              <p className="detail-blurb" dangerouslySetInnerHTML={{ __html: active.blurb }} />
              <div className="detail-host">
                <div className="eyebrow map-mono">hosted by</div>
                <div className="host-name">{active.host}</div>
              </div>
              <div className="detail-actions">
                <button className="btn primary">RSVP — I&rsquo;ll be there</button>
                <button className="btn tiny">add to calendar</button>
              </div>
              <div className="detail-foot map-mono">
                via Google Calendar · {active.spirit ? 'SPIRIT official' : 'community-submitted'}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function DateBlock({ dateStr }) {
  const d = parseEventDate(dateStr);
  return (
    <div className="dateblock">
      <div className="dateblock-month map-mono">{MONTHS[d.getMonth()].toLowerCase()}</div>
      <div className="dateblock-day">{d.getDate()}</div>
      <div className="dateblock-dow map-mono">{dayOfWeek(d).toLowerCase()}</div>
    </div>
  );
}

// ---------------- News ----------------

function NewsScreen() {
  const [source, setSource] = useState('all');
  const sources = useMemo(() => {
    const s = new Set(window.NEWS.map(n => n.source));
    return ['all', ...Array.from(s)];
  }, []);
  const filtered = source === 'all' ? window.NEWS : window.NEWS.filter(n => n.source === source);
  const [featured, ...rest] = filtered;

  return (
    <div className="screen news">
      <header className="topbar">
        <div className="mark">
          <span className="mark-glyph" aria-hidden="true">◐</span>
          <span className="mark-name">Front Range Commons</span>
        </div>
        <div className="topbar-meta map-mono">REGENERATIVE NEWS FEED · WEEK 20</div>
      </header>

      <div className="news-body">
        <div className="news-intro">
          <div className="eyebrow map-mono">the almanac</div>
          <h2 className="display">
            What the bioregion<br/>
            is <em>noticing</em> this week.
          </h2>
          <p className="lede">
            Aggregated quietly from publications doing real reporting on this
            place — soil, water, fire, food, and the people working at
            their edges.
          </p>

          <div className="source-row">
            <div className="filter-meta map-mono">sources</div>
            <div className="source-pills">
              {sources.map(s => (
                <button key={s}
                        className={`filter-pill ${source === s ? 'on' : ''}`}
                        onClick={() => setSource(s)}>
                  {s === 'all' ? 'everything' : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {featured && (
          <article className="news-featured">
            <div className="featured-side">
              <div className="featured-source map-mono">{featured.source}</div>
              <div className="featured-meta map-mono">
                {formatDate(featured.date)} · {featured.minutes} min read
              </div>
              <div className="featured-kind map-mono">{featured.kind}</div>
            </div>
            <div className="featured-body">
              <div className="eyebrow map-mono">featured this week</div>
              <h3 className="featured-title">{featured.title}</h3>
              <p className="featured-blurb">{featured.blurb}</p>
              <a className="featured-link map-mono" href="#">read at {featured.source} →</a>
            </div>
          </article>
        )}

        <ul className="news-list">
          {rest.map(n => (
            <li key={n.id} className="news-row">
              <div className="news-meta">
                <div className="news-source map-mono">{n.source}</div>
                <div className="news-date map-mono">{formatDate(n.date)}</div>
                <div className="news-kind map-mono">{n.kind}</div>
                <div className="news-min map-mono">{n.minutes} min</div>
              </div>
              <div className="news-text">
                <h4 className="news-title">{n.title}</h4>
                <p className="news-blurb">{n.blurb}</p>
                <a className="news-link map-mono" href="#">read at {n.source} →</a>
              </div>
            </li>
          ))}
        </ul>

        <div className="news-foot">
          <div className="eyebrow map-mono">we don&rsquo;t paywall the news</div>
          <p className="lede secondary">
            Every link goes back to the publisher. Subscribe to the ones that
            keep you informed — local journalism is bioregional infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
}

function formatDate(s) {
  const d = parseEventDate(s);
  return `${MONTHS[d.getMonth()].toLowerCase()} ${d.getDate()}`;
}

window.EventsScreen = EventsScreen;
window.NewsScreen = NewsScreen;
