// Centralized frontend configuration via Vite env variables
// Define in .env or .env.local as VITE_* keys

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || 'http://localhost:8081';
const API_BASE = import.meta.env.VITE_API_BASE || `${BACKEND_BASE}/api`;

export const config = {
  BACKEND_BASE,
  API_BASE,
};


