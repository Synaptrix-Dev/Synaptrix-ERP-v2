import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const authURL = import.meta.env.VITE_BASE_URL;
  return (
    <AuthContext.Provider value={{ authURL }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
