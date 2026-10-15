/* =========================================================================
 * ❄️ AUTHENTICATION IS FROZEN ❄️
 * Do not modify authentication files or password/JWT/email-verification logic 
 * while implementing unrelated features.
 * Reuse the existing auth system.
 * ========================================================================= */

﻿import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("connect_token");
      if (token) {
        try {
          const { data } = await api.get("/auth/me");
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem("connect_token");
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const googleLogin = async (credential) => {
    const response = await api.post("/auth/google", { credential });
    
    // If user needs to complete registration, return data to component
    if (response.status === 202 && response.data.isNewUser) {
      return response.data;
    }

    // Normal login
    localStorage.setItem("connect_token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const loginManual = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    
    // If user needs to complete registration, return data to component
    if (response.status === 202 && response.data.isNewUser) {
      return response.data;
    }

    // Normal login
    localStorage.setItem("connect_token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const registerManual = async (payload) => {
    return await api.post("/auth/register", payload);
  };

  const completeRegistration = async (registrationData) => {
    const { data } = await api.post("/auth/complete-registration", registrationData);
    localStorage.setItem("connect_token", data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("connect_token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, googleLogin, login: loginManual, register: registerManual, loginManual, registerManual, completeRegistration, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
