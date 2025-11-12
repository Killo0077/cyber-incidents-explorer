// ui/src/TableView.jsx
export default function TableView({ data }) {
  if (!data || !data.length) return <div className="empty">No rows</div>;

  const cols = [
    "event_date","actor","actor_type","organization",
    "event_type","country","description"
  ].filter(c => c in data[0]);

  return (
    <div className="grid">
      <table>
        <thead>
          <tr>{cols.map(c => <th key={c}>{c.replace(/_/g," ")}</th>)}</tr>
        </thead>
        <tbody>
          {data.slice(0,50).map((r, i) => (
            <tr key={i}>
              {cols.map(c => <td key={c}>{String(r[c] ?? "")}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
