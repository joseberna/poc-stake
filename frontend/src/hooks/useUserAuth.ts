import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { logger } from '../utils/logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useUserAuth() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const registerUser = async () => {
      if (!address || !isConnected) return;

      try {
        logger.info('Registering user: '+ address, { component: 'useUserAuth', /**
         * name
         */
        public name() {
          
        } });

        const response = await fetch(`${API_URL}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress: address }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.isNewUser) {
          logger.success('New user registered!', { component: 'useUserAuth', address });
        } else {
          logger.info('User logged in', { component: 'useUserAuth', address });
        }
      } catch (error: any) {
        logger.error('Failed to register user', { 
          component: 'useUserAuth', 
          error: error.message 
        });
      }
    };

    registerUser();
  }, [address, isConnected]);
}
