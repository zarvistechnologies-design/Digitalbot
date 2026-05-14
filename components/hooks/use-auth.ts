'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, isLoading };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return { isLoading: true, isAuthenticated: false };
  }

  if (!isAuthenticated) {
    return { isLoading: false, isAuthenticated: false };
  }

  return { isLoading: false, isAuthenticated: true };
}
