import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import  ROUTES from '../../lib/routes/route';

function useAuth() {
  const router: any = useRouter();

  useEffect(() => {
    const token: string | null = localStorage.getItem('token');

    if (!token) {
      router.push(ROUTES.LOGIN); 
    }
  }, [router]);
}

export default useAuth;