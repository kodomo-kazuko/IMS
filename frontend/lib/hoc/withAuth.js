import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ROUTES from '../../lib/routes/route'; // Adjust the import path as needed

function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push(ROUTES.LOGIN);
      }
    }, [router]);

    // If there's no token, don't render the component until the redirect happens
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      return null;
    }

    return <Component {...props} />;
  };
}

export default withAuth;
