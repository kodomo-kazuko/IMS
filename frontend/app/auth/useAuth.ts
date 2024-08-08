import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import  ROUTES from '../routes/route';

function useAuth() {
  const router: any = useRouter();

  useEffect(() => {
    const token: string | null = localStorage.getItem('token'); // Token might be null

    if (!token) {
      router.push(ROUTES.LOGIN); // Redirect to login if no token found
    }
  }, [router]);
}

export default useAuth;