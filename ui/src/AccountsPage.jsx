import { useState } from "react";
import Navigation from "./Navigation";
import { useAuth } from "./AuthContext";
import "./AccountsPage.css";

export default function AccountsPage() {
  const { users, updateUser, deleteUser, addUser } = useAuth();
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [formData, setFormData] = useState({ 
    username: "", 
    password: "", 
    firstName: "",
    lastName: "",
    email: "",
    role: "analyst" 
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleView = (user) => {
    setViewingUser(user);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ 
      username: user.username, 
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role 
    });
  };

  const handleDelete = (user) => {
    setConfirmDelete(user);
  };

  const confirmDeleteUser = () => {
    if (confirmDelete) {
      deleteUser(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  const handleAddUser = () => {
    setAddingUser(true);
    setFormData({ 
      username: "", 
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "analyst" 
    });
  };

  const handleSaveUser = () => {
    if (!formData.username || !formData.password || !formData.firstName || !formData.lastName || !formData.email) {
      alert("All fields are required");
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, formData.username, formData.password, formData.firstName, formData.lastName, formData.email, formData.role);
      setEditingUser(null);
    } else if (addingUser) {
      addUser(formData.username, formData.password, formData.firstName, formData.lastName, formData.email, formData.role);
      setAddingUser(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="page accounts-page">
        <h1>User Management</h1>

        <button className="btn btn-primary" onClick={handleAddUser}>
          + Add New User
        </button>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "#999" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleView(user)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      {user.username !== "admin" && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user)}
                        >
                          Delete
                        </button>
                      )}
                      {user.username === "admin" && (
                        <span
                          className="btn btn-sm btn-danger"
                          style={{ opacity: 0.5, cursor: "not-allowed" }}
                          title="Admin user cannot be deleted"
                        >
                          Delete
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View Modal */}
        {viewingUser && (
          <div className="modal-overlay" onClick={() => setViewingUser(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>User Details</h2>
              <div className="modal-body">
                <div className="detail-row">
                  <label>ID:</label>
                  <span>{viewingUser.id}</span>
                </div>
                <div className="detail-row">
                  <label>First Name:</label>
                  <span>{viewingUser.firstName}</span>
                </div>
                <div className="detail-row">
                  <label>Last Name:</label>
                  <span>{viewingUser.lastName}</span>
                </div>
                <div className="detail-row">
                  <label>Username:</label>
                  <span>{viewingUser.username}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{viewingUser.email}</span>
                </div>
                <div className="detail-row">
                  <label>Role:</label>
                  <span className={`role-badge role-${viewingUser.role}`}>
                    {viewingUser.role}
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setViewingUser(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Add Modal */}
        {(editingUser || addingUser) && (
          <div className="modal-overlay" onClick={() => {
            setEditingUser(null);
            setAddingUser(false);
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="analyst">Analyst</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => {
                  setEditingUser(null);
                  setAddingUser(false);
                }}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveUser}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Confirm Delete</h2>
              <div className="modal-body">
                <p>Are you sure you want to delete user <strong>{confirmDelete.username}</strong>?</p>
                <p style={{ color: "#999", fontSize: "0.9rem" }}>This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDeleteUser}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
