import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

// Initial users list with the built-in admin user
const INITIAL_USERS = [
  { id: 1, username: "admin", password: "admin", firstName: "Admin", lastName: "User", email: "admin@example.com", role: "admin" }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);

  const login = (username, role) => {
    setUser({ username, role });
  };

  const logout = () => {
    setUser(null);
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

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const getUser = (id) => {
    return users.find(u => u.id === id);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, users, addUser, updateUser, deleteUser, getUser }}>
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
