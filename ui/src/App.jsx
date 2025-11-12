import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

// ==== CSV LOCATION ====
// Put your CSV here: ui/public/data/cyber_clean.csv
// (We’ll use /data/cyber_clean.csv at runtime)
const CSV_URL = "/data/cyber_clean.csv";

function TableView({ rows }) {
  if (!rows || !rows.length) return <div className="empty">No rows</div>;

  const cols = [
    "event_date", "actor", "actor_type",
    "organization", "event_type", "country",
    "description"
  ].filter(c => c in rows[0]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="col-date">Date</th>
          <th className="col-actor">Actor</th>
          <th className="col-actor-type">Actor Type</th>
          <th className="col-org">Organization</th>
          <th className="col-etype">Event Type</th>
          <th className="col-country">Country</th>
          <th className="col-desc">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.event_date ?? ""}</td>
            <td>{r.actor ?? ""}</td>
            <td>{r.actor_type ?? ""}</td>
            <td>{r.organization ?? ""}</td>
            <td>{r.event_type ?? ""}</td>
            <td>{r.country ?? ""}</td>
            <td><div className="clamp-2">{r.description ?? ""}</div></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  const [raw, setRaw] = useState([]);
  const [q, setQ] = useState("");
  const [actor, setActor] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Load CSV once
  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => setRaw(res.data),
      error: (e) => console.error("CSV error:", e),
    });
  }, []);

  // Options for filters
  const actorOptions = useMemo(
    () => Array.from(new Set(raw.map(x => x.actor).filter(Boolean))).sort(),
    [raw]
  );
  const countryOptions = useMemo(
    () => Array.from(new Set(raw.map(x => x.country).filter(Boolean))).sort(),
    [raw]
  );

  // Filtered rows
  const filtered = useMemo(() => {
    let rows = raw;
    if (q) {
      const needle = q.toLowerCase();
      rows = rows.filter(r =>
        (r.description ?? "").toLowerCase().includes(needle) ||
        (r.organization ?? "").toLowerCase().includes(needle)
      );
    }
    if (actor) rows = rows.filter(r => r.actor === actor);
    if (country) rows = rows.filter(r => r.country === country);
    return rows;
  }, [raw, q, actor, country]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Reset page if filters change
  useEffect(() => setPage(1), [q, actor, country, pageSize]);

  return (
    <div className="page">
      <h1>Cyber Events — Table</h1>

      <div className="controls">
        <input
          placeholder="Search description or organization…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <select value={actor} onChange={e => setActor(e.target.value)}>
          <option value="">Actor (all)</option>
          {actorOptions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option value="">Country (all)</option>
          {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
          {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
        </select>
        <div style={{ color: "var(--muted)" }}>Rows: {total}</div>
      </div>

      <TableView rows={pageRows} />

      <div className="pager">
        <button onClick={() => setPage(1)} disabled={page === 1}>« First</button>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
        <div>Page {page} / {pages}</div>
        <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Next ›</button>
        <button onClick={() => setPage(pages)} disabled={page === pages}>Last »</button>
      </div>
    </div>
  );
}
