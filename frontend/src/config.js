// API base URL
// In production (Vercel): empty string so /api/* goes to the same domain
// In development: http://localhost:5001
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5001');

export default API_BASE;
