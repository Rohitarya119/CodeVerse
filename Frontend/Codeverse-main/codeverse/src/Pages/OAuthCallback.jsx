import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      // Fetch user details from backend using the token
      axios.get(`${config.API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        if (res?.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      })
      .catch(() => {
        // ignore; user will simply be missing details
      })
      .finally(() => {
        navigate('/problems');
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default OAuthCallback;