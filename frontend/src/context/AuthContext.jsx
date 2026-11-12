
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("researchgraph_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("researchgraph_token")
  );

  const login = (authData) => {
    localStorage.setItem("researchgraph_token", authData.token);
    localStorage.setItem(
      "researchgraph_user",
      JSON.stringify(authData.user)
    );

    setToken(authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem("researchgraph_token");
    localStorage.removeItem("researchgraph_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
