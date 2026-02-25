import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

/**
 * Handles Okta sign-out and pushes users to the login page.
 * Keep this logic isolated so any future logout entrypoints behave consistently.
 */
const Logout = () => {
  const { oktaAuth } = useOktaAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const runLogout = async () => {
      const postLogoutRedirectUri = `${window.location.origin}/login`;

      try {
        sessionStorage.setItem('logout', 'true');
        await oktaAuth.signOut({ postLogoutRedirectUri });
      } catch (error) {
        console.error('Error during logout', error);
        navigate('/login', { replace: true });
      }
    };

    runLogout();
  }, [navigate, oktaAuth]);

  return <p>Signing you out...</p>;
};

export default Logout;