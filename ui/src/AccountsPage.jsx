import Navigation from "./Navigation";
import "./AccountsPage.css";

export default function AccountsPage() {
  return (
    <div>
      <Navigation />
      <div className="accounts-container">
        <div className="accounts-header">
          <h1>User Management</h1>
        </div>

        <div className="content-card">
          <h2>Coming soon</h2>
          <p className="muted">The User Management interface is a placeholder for now. Functionality (create, edit, delete users) will be implemented later.</p>
        </div>
      </div>
    </div>
  );
}
