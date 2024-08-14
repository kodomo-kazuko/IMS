import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import  ROUTES from '../../lib/routes/route';
import { LocalRepo } from '@/lib/core/local.repo';

function useAuth() {
  const router: any = useRouter();

  useEffect(() => {
    const token: string | null | undefined = LocalRepo.getToken();

    if (!token) {
      router.push(ROUTES.LOGIN); 
    }
  }, [router]);
}

export default useAuth;