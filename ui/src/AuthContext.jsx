import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

// Initial users list with the built-in admin user
const INITIAL_USERS = [
  { 
    id: 1, 
    username: "admin", 
    password: "admin", 
    firstName: "Admin", 
    lastName: "User", 
    email: "admin@example.com", 
    role: "admin"
  },
  {
      id: 1, 
    username: "analyst", 
    password: "analyst", 
    firstName: "Data analyst", 
    lastName: "Data Analyst", 
    email: "analyst@example.com", 
    role: "analyst"
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);

  const STORAGE_KEY_USERS = "cie_users";
  const STORAGE_KEY_SESSION = "cie_session";

  // Load users and session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) setUsers(parsed);
      }
    } catch (e) {
      // ignore parse errors and keep INITIAL_USERS
      // console.warn("Failed to load users from storage", e);
    }

    try {
      const sess = localStorage.getItem(STORAGE_KEY_SESSION);
      if (sess) {
        setUser(JSON.parse(sess));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist users to localStorage whenever users change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      // ignore write errors
    }
  }, [users]);

  const login = (username, role) => {
    const u = { username, role };
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(u));
    } catch (e) {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch (e) {}
  };

  const addUser = (username, password, firstName, lastName, email, role) => {
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      username,
      password,
      firstName,
      lastName,
      email,
      role
    };
    setUsers([...users, newUser]);
    return newUser;
  };

  const updateUser = (id, username, password, firstName, lastName, email, role) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, username, password, firstName, lastName, email, role } : u
    ));
  };

  // Change password with old password verification for non-admins.
  // Admins can change any user's password without providing the old password.
  const changePassword = (id, oldPassword, newPassword) => {
    const target = users.find(u => u.id === id);
    if (!target) return { success: false, message: "User not found" };

    // If current session user is admin, allow bypassing old password
    if (user && user.role === "admin") {
      setUsers(users.map(u => u.id === id ? { ...u, password: newPassword } : u));
      return { success: true, message: "Password changed" };
    }

    // Otherwise require old password match
    if (target.password !== oldPassword) {
      return { success: false, message: "Old password is incorrect" };
    }

    setUsers(users.map(u => u.id === id ? { ...u, password: newPassword } : u));
    return { success: true, message: "Password changed" };
  };

  // Mocked password reset: simply set the new password for the username (no security question)
  const resetPassword = (username, newPassword) => {
    const user = users.find(u => u.username === username);
    if (!user) return { success: false, message: "User not found" };

    setUsers(users.map(u =>
      u.id === user.id ? { ...u, password: newPassword } : u
    ));
    return { success: true, message: "Password reset successfully" };
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const getUser = (id) => {
    return users.find(u => u.id === id);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, users, addUser, updateUser, deleteUser, getUser, resetPassword, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
