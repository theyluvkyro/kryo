import React, { createContext, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider
      value={{
        isLoadingAuth: false,
        isLoadingPublicSettings: false,
        authError: null,
        navigateToLogin: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
