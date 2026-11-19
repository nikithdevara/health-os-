import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Bell, FlaskConical, Pill, CalendarDays, FileText, Activity } from "lucide-react";
import "@/styles/today-panel.css";

const ICONS = {
  flask: FlaskConical,
  pill: Pill,
  calendar: CalendarDays,
  file: FileText,
  activity: Activity,
};

function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

/* One eased progress value drives every count and tick fill on the panel. */
function useEntranceProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (prefersReduced()) {
      setP(1);
      return;
    }
    let raf = 0;
    let startedAt = 0;
    const begin = performance.now() + 800;
    const step = (t) => {
      if (!startedAt) startedAt = t;
      const q = Math.min(1, Math.max(0, (t - Math.max(begin, startedAt)) / 700));
      setP(1 - Math.pow(1 - q, 3));
      if (q < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return p;
}

function RadialGauge({ value, goal, p }) {
  const pct = Math.min(1, goal ? value / goal : 0);
  const target = Math.round(pct * 40);
  const lit = Math.round(p * target);
  const ticks = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * 2 * Math.PI;
    const s = Math.sin(a);
    const c = -Math.cos(a);
    return {
      i,
      x1: 72 + 34 * s,
      y1: 72 + 34 * c,
      x2: 72 + 58 * s,
      y2: 72 + 58 * c,
      dx: 72 + 66 * Math.sin(a),
      dy: 72 - 66 * Math.cos(a),
      on: i < lit,
      dot: i % 5 === 0,
    };
  });
  return (
    <div className="dh4-gauge" role="img" aria-label={`${Math.round(pct * 100)}% of the daily goal`}>
      <svg viewBox="0 0 144 144" aria-hidden="true">
        {ticks.map((t) => (
          <line
            key={`l${t.i}`}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.on ? "#087F5B" : "#DBE7E1"}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ))}
        {ticks
          .filter((t) => t.dot)
          .map((t) => (
            <circle
              key={`d${t.i}`}
              cx={t.dx}
              cy={t.dy}
              r="1.6"
              fill={t.on ? "#087F5B" : "#DBE7E1"}
            />
          ))}
      </svg>
      <span className="dh4-gauge-pct" aria-hidden="true">
        {Math.round(pct * p * 100)}%
      </span>
    </div>
  );
}

function TickStrip({ value, goal, p }) {
  const pct = Math.min(1, goal ? value / goal : 0);
  const total = 49;
  const filled = Math.round(pct * total);
  const lit = Math.round(p * filled);
  return (
    <div className="dh4-strip" role="img" aria-label={`${Math.round(pct * 100)}% of the hydration goal`}>
      <div className="dh4-ticks">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="dh4-tcell">
            {i % 12 === 0 && (
              <span className={`dh4-mark ${i < lit ? "" : "is-off"}`} />
            )}
            <span className={`dh4-t ${i < lit ? "" : "is-off"}`} />
          </span>
        ))}
      </div>
    </div>
  );
}

function GroupedTicks({ value, goal, p }) {
  const lit = Math.round(Math.min(value, goal) * p);
  const cells = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div className="dh4-groups" role="img" aria-label={`${value} of ${goal} active minutes`}>
      {Array.from({ length: 12 }, (_, g) => (
        <span className="dh4-group" key={g}>
          {cells.slice(g * 5, g * 5 + 5).map((i) => (
            <span
              key={i}
              className={`dh4-t ${i < lit ? "" : "is-off"} ${i % 15 === 0 ? "is-major" : ""}`}
            />
          ))}
        </span>
      ))}
    </div>
  );
}

export default function TodayPanel({
  name = "there",
  dateLabel,
  headline,
  subline,
  metrics,
  week = [],
  todayIso,
  goal = 10000,
  notifications = [],
  recent = [],
  onOpenRecent,
  onViewTimeline,
}) {
  const p = useEntranceProgress();
  const rootRef = useRef(null);
  const [activeDate, setActiveDate] = useState(null);
  const [bellOpen, setBellOpen] = useState(false);
  const [readAll, setReadAll] = useState(false);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || typeof window === "undefined") return;
    if (window.__orvaEnteredToday) return;
    window.__orvaEnteredToday = true;
    el.classList.add("dh4-enter");
    const t = setTimeout(() => el.classList.remove("dh4-enter"), 1600);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => {
    const values = week.filter((d) => typeof d.value === "number").map((d) => d.value);
    const max = values.length ? Math.max(...values) : 0;
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = values.length ? Math.round(sum / values.length) : 0;
    const top = Math.max(goal, max) + goal * 0.08;
    return { max, avg, top, count: values.length };
  }, [week, goal]);

  const active = week.find((d) => d.iso === activeDate) || null;
  const metricDay = active && typeof active.value === "number" ? active : null;

  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  const unread = notifications.some((n) => n.unread) && !readAll;
  const stepsPct = Math.min(1, metrics.steps / metrics.stepsGoal);

  return (
    <section className="dh4-section" ref={rootRef} data-orva-today>
      <div className="dh4-bg" aria-hidden="true" />

      <div className="dh4-stage">
        <header className="dh4-head">
          <div>
            <p className="dh4-date">{dateLabel}</p>
            <h2 className="dh4-title">{headline}</h2>
            {subline && <p className="dh4-sub">{subline}</p>}
          </div>

          <div className="dh4-bellwrap">
            <button
              type="button"
              className="dh4-bell"
              aria-label={`Notifications${unread ? " (unread)" : ""}`}
              aria-expanded={bellOpen}
              onClick={() => setBellOpen((v) => !v)}
            >
              <Bell className="dh4-bell-icon" strokeWidth={1.7} />
              {unread && <span className="dh4-bell-dot" aria-hidden="true" />}
            </button>

            {bellOpen && (
              <div className="dh4-notif" role="dialog" aria-label="Notifications">
                <p className="dh4-notif-head">
                  Notifications
                  <button
                    type="button"
                    className="text-[11px] font-semibold normal-case tracking-normal text-primary hover:underline"
                    onClick={() => setReadAll(true)}
                  >
                    Mark all read
                  </button>
                </p>
                <ul className="dh4-notif-list">
                  {notifications.map((n) => (
                    <li key={n.id} className={`dh4-notif-item ${n.unread && !readAll ? "is-unread" : ""}`}>
                      <span className="dh4-notif-dot" aria-hidden="true" />
                      <span className="dh4-notif-body">
                        <span className="dh4-notif-text">{n.title}</span>
                        <span className="dh4-notif-time">{n.meta}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </header>

        <div className="dh4-cards">
          <div className="dh4-kpis">
            <article className="dh4-kpi dh4-kpi--steps dh4-surf dh4-lift" style={{ "--dh4-j": 0 }}>
              <div className="dh4-surf-body">
                <div className="dh4-copy">
                  <p className="dh4-label">Steps today</p>
                  <p className="dh4-num">{fmt(metrics.steps * p)}</p>
                  <p className="dh4-note">
                    {metrics.steps >= metrics.stepsGoal
                      ? "Daily goal reached"
                      : `${Math.round(stepsPct * 100)}% of ${fmt(metrics.stepsGoal)} goal`}
                  </p>
                </div>
                <RadialGauge value={metrics.steps} goal={metrics.stepsGoal} p={p} />
              </div>
            </article>

            <article className="dh4-kpi dh4-kpi--cal dh4-surf dh4-lift" style={{ "--dh4-j": 1 }}>
              <div className="dh4-surf-body dh4-copy">
                <p className="dh4-label">Hydration</p>
                <p className="dh4-num">
                  {fmt(metrics.hydration * p)}
                  <small>/ {fmt(metrics.hydrationGoal)} ml</small>
                </p>
                <TickStrip value={metrics.hydration} goal={metrics.hydrationGoal} p={p} />
                <p className="dh4-note">
                  {metrics.hydration >= metrics.hydrationGoal
                    ? "Hydration goal met"
                    : `${fmt(Math.max(0, metrics.hydrationGoal - metrics.hydration))} ml left today`}
                </p>
              </div>
            </article>

            <article className="dh4-kpi dh4-kpi--act dh4-surf dh4-lift" style={{ "--dh4-j": 2 }}>
              <div className="dh4-surf-body dh4-copy">
                <p className="dh4-label">Active minutes</p>
                <p className="dh4-num">
                  {Math.round(metrics.activeMinutes * p)}
                  <small>min</small>
                </p>
                <GroupedTicks value={metrics.activeMinutes} goal={metrics.activeGoal} p={p} />
                <p className="dh4-note">of {metrics.activeGoal} min goal</p>
              </div>
            </article>
          </div>

          <div className="dh4-main">
            <article className="dh4-card dh4-chart dh4-lift">
              <div className="dh4-cardhead">
                <h3 className="dh4-h3">Steps this week</h3>
                <span className="dh4-avg">
                  {metricDay ? (
                    <>
                      {metricDay.short} <b>{fmt(metricDay.value)}</b> steps
                    </>
                  ) : stats.count ? (
                    <>
                      Avg <b>{fmt(stats.avg)}</b> / day
                    </>
                  ) : (
                    "No activity logged"
                  )}
                </span>
              </div>

              <div className="dh4-plotwrap">
                <div
                  className="dh4-plot"
                  style={{ "--dh4-goal": `${((goal / stats.top) * 100).toFixed(2)}%` }}
                  onPointerLeave={() => setActiveDate(null)}
                  role="group"
                  aria-label="Steps this week"
                >
                  <div className="dh4-goal" aria-hidden="true">
                    <span>Goal {Math.round(goal / 1000)}k</span>
                  </div>
                  {week.map((d, i) => {
                    const future = typeof d.value !== "number";
                    const isActive = future ? false : activeDate ? activeDate === d.iso : d.isToday;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        className={`dh4-col ${d.isToday ? "is-today" : ""} ${future ? "is-future" : ""} ${
                          isActive ? "is-active" : ""
                        }`}
                        style={{ "--dh4-i": i }}
                        disabled={future}
                        tabIndex={future ? -1 : 0}
                        onPointerEnter={(e) => {
                          if (e.pointerType === "mouse" && !future) setActiveDate(d.iso);
                        }}
                        onFocus={() => !future && setActiveDate(d.iso)}
                        onClick={() => !future && setActiveDate(d.iso === activeDate ? null : d.iso)}
                        aria-label={`${d.full}, ${future ? "no data yet" : `${fmt(d.value)} steps`}`}
                      >
                        <span
                          className="dh4-reveal"
                          style={{ "--dh4-h": `${((d.value || 0) / stats.top) * 100}%` }}
                        >
                          <span className="dh4-fill dh4-surf">
                            <span className="dh4-grad" />
                          </span>
                        </span>
                        <span className="dh4-day" aria-hidden="true">
                          <span className="dh4-day-name">{d.short}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="dh4-days" aria-hidden="true" />
              </div>
            </article>

            <article className="dh4-card dh4-recent dh4-lift">
              <div className="flex items-center justify-between gap-2">
                <h3 className="dh4-h3">Recent</h3>
                {onViewTimeline && (
                  <button
                    type="button"
                    onClick={onViewTimeline}
                    className="text-[12px] font-semibold text-primary hover:underline"
                  >
                    Timeline
                  </button>
                )}
              </div>
              <ul className="dh4-list">
                {recent.map((item, i) => {
                  const Icon = ICONS[item.icon] || FileText;
                  return (
                    <li className="dh4-item" key={item.id} style={{ "--dh4-j": i }}>
                      <button
                        type="button"
                        className="dh4-row"
                        onClick={() => onOpenRecent?.(item)}
                        aria-label={`Open ${item.title}`}
                      >
                        <span className="dh4-tile dh4-surf" aria-hidden="true">
                          <Icon className="dh4-surf-body" strokeWidth={1.7} />
                        </span>
                        <span className="dh4-item-body">
                          <span className="dh4-item-title">{item.title}</span>
                          <span className="dh4-item-text">{item.meta}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}