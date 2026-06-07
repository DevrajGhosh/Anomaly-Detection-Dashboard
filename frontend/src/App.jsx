import { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from "recharts";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const uploadFile = async () => {
  if (!file) return alert("Select a file first");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/upload",
      formData
    );

    setResult(res.data);
  } catch (err) {
    console.log(err);
    alert("Upload failed");
  }
};

  const anomalyCount =
    result?.anomalies?.filter((a) => a.is_anomaly).length || 0;
  const cardStyle = {
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  minWidth: "120px",
  textAlign: "center",
  background: "#f9f9f9"
};

  const chartData = result?.anomalies?.map((a) => ({
  index: a.index,
  score: a.score,
  anomaly: a.is_anomaly ? 1 : 0,
}));
  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Anomaly Detection Dashboard</h1>

      {/* Upload */}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={uploadFile}
        style={{
          marginLeft: "10px",
          padding: "8px 12px",
          background: "black",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload
      </button>

      {/* Results */}
      {result && (
  <div style={{ marginTop: 20 }}>

    <h2>📊 Dashboard</h2>

    {/* KPI CARDS */}
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

      <div style={cardStyle}>
        <h3>Rows</h3>
        <h2>{result.rows}</h2>
      </div>

      <div style={cardStyle}>
        <h3>Anomalies</h3>
        <h2>{result.anomalies_found}</h2>
      </div>

      <div style={cardStyle}>
        <h3>Anomaly Rate</h3>
        <h2>
          {((result.anomalies_found / result.rows) * 100).toFixed(2)}%
        </h2>
      </div>

    </div>
    {result && (
  <div style={{ marginTop: "30px" }}>
    <h3>📈 Anomaly Score Trend</h3>

    <LineChart width={700} height={300} data={chartData}>
      <XAxis dataKey="index" />
      <YAxis />
      <Tooltip />

      <Line type="monotone" dataKey="score" stroke="blue" />
    </LineChart>
  </div>
)}

{result && (
  <div style={{ marginTop: "30px" }}>
    <h3>📊 Anomaly Distribution</h3>

    <BarChart width={500} height={300} data={[
      {
        name: "Normal",
        value: result.rows - result.anomalies_found
      },
      {
        name: "Anomaly",
        value: result.anomalies_found
      }
    ]}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="red" />
    </BarChart>
  </div>
)}

    {/* TABLE */}
    <table border="1" cellPadding="8" width="100%">
      <thead>
        <tr>
          <th>Index</th>
          <th>Anomaly</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody>
        {result.anomalies?.map((a, i) => (
          <tr
            key={i}
            style={{
              background: a.is_anomaly ? "#ffdddd" : "#ddffdd"
            }}
          >
            <td>{a.index}</td>
            <td>{a.is_anomaly ? "YES" : "NO"}</td>
            <td>{a.score.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>
  );
}

export default App;