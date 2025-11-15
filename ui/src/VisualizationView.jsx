import Navigation from "./Navigation";
import "./VisualizationView.css";

export default function VisualizationView() {
  return (
    <div>
      <Navigation />
      <main className="main-content">
        <div className="content-card">
          <h2>Visualization</h2>
          <p className="coming-soon">More visualizations coming soon...</p>
        </div>
      </main>
    </div>
  );
}
