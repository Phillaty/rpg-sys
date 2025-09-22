import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { decrypt } from '../crypt';

export const useLoginManager = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();

  const handleSuccessfulLogin = useCallback(async () => {
    console.log('🎯 Login successful, handling navigation...');
    
    // Force multiple attempts to refresh user data
    const attemptRefresh = async (attempt: number = 1, maxAttempts: number = 5) => {
      console.log(`🔄 Refresh attempt ${attempt}/${maxAttempts}`);
      
      await refreshUserData();
      
      // Check if userData is now available
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const decryptedData = decrypt(storedUser);
          const parsedUser = JSON.parse(decryptedData || '{}');
          if (parsedUser && parsedUser.id) {
            console.log('✅ UserData loaded successfully, navigating to home...');
            setTimeout(() => navigate('/home'), 100);
            return true;
          }
        } catch (error) {
          console.error('Error checking userData:', error);
        }
      }
      
      // If we haven't succeeded and have attempts left, try again
      if (attempt < maxAttempts) {
        setTimeout(() => attemptRefresh(attempt + 1, maxAttempts), 200);
      } else {
        console.warn('⚠️ Max refresh attempts reached, user may need to refresh page');
      }
    };

    await attemptRefresh();
  }, [refreshUserData, navigate]);

  return { handleSuccessfulLogin };
};