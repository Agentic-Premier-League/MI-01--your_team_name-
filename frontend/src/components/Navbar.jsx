import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
      <h2><Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>TalentPlatform AI</Link></h2>
      {user && (
        <div>
          <span style={{ marginRight: '1rem', color: 'var(--text-muted)' }}>Role: {user.role}</span>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
