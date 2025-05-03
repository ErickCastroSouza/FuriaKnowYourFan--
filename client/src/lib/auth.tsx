import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { queryClient } from "./queryClient";
import { User } from "@shared/schema";
import { apiRequest } from "./queryClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",  // Assegure-se de que o token é enviado corretamente com a requisição
      });
  
      console.log('Fetch response status:', response.status);  // Verifique o status da resposta
      if (response.ok) {
        const userData = await response.json();
        console.log('User data from /api/auth/me:', userData);  // Verifique o conteúdo retornado
        setUser(userData);
      } else {
        console.log('No user logged in, response not OK');  // Verifique o que ocorre quando não há um usuário
        setUser(null);
      }
    } catch (error) {
      console.error("Erro ao buscar o usuário:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await apiRequest("POST", "/api/auth/login", { username, password });
      const userData = await res.json();
      console.log('Login successful, userData:', userData); // Verifique o que é retornado pela API
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const res = await apiRequest("POST", "/api/auth/register", { username, password });
      const userData = await res.json();
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await apiRequest("PATCH", "/api/users/profile", data);
      const updatedUser = await res.json();
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAdmin, 
        login, 
        register, 
        logout, 
        updateProfile 
      }}>
      {children}
    </AuthContext.Provider>
  );
};
