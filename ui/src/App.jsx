import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import TableView from "./components/TableView.jsx";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse("/data/cyber_clean.csv", {
      download: true,
      header: true,            // map headers to object keys
      skipEmptyLines: true,
      dynamicTyping: false,    // keep strings as strings
      complete: (res) => {
        // Basic clean: trim keys, keep only the columns we use
        const wanted = [
          "event_date",
          "actor",
          "actor_type",
          "organization",
          "event_type",
          "country",
          "description",
        ];
        const cleaned = res.data
          .map((r) => {
            const obj = {};
            wanted.forEach((k) => (obj[k] = (r[k] ?? "").toString().trim()));
            return obj;
          })
          .filter((r) => r.event_date); // drop any broken lines
        setRows(cleaned);
        setLoading(false);
      },
      error: (err) => {
        console.error("CSV parse error:", err);
        setLoading(false);
      },
    });
  }, []);

  return <TableView rows={rows} loading={loading} />;
}
