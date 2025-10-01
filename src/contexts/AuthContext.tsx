import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { decrypt } from '../crypt';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: any;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userData: null,
  refreshUserData: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      // Check if there's user data in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser && firebaseUser) {
        try {
          const decryptedUser = decrypt(storedUser);
          const parsedUser = JSON.parse(decryptedUser || '{}');
          setUserData(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user');
          setUserData(null);
        }
      } else if (!firebaseUser) {
        // If Firebase user is null, clear local storage
        localStorage.removeItem('user');
        setUserData(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Additional effect to check localStorage when user state changes
  useEffect(() => {
    if (user && !userData) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const decryptedUser = decrypt(storedUser);
          const parsedUser = JSON.parse(decryptedUser || '{}');
          setUserData(parsedUser);
        } catch (error) {
          console.error('Error loading userData from localStorage:', error);
        }
      }
    }
  }, [user, userData]);

  // User is authenticated if we have both Firebase user AND valid userData with ID
  const isAuthenticated = !!user && !!userData?.id;
  
  // Function to manually refresh user data from localStorage
  const refreshUserData = async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const decryptedUser = decrypt(storedUser);
        const parsedUser = JSON.parse(decryptedUser || '{}');
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error manually refreshing user data:', error);
        localStorage.removeItem('user');
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  };


  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        userData,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};