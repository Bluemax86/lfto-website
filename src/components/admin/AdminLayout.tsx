import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, LogOut, ArrowLeft } from 'lucide-react';
import { logout } from '../../services/firebase';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Influencers', path: '/admin/influencers', icon: <Users size={20} /> },
    { name: 'Tasks', path: '/admin/tasks', icon: <CheckSquare size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-container-lowest)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: 'var(--surface-container)',
        borderRight: '1px solid var(--outline-variant)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--outline-variant)' }}>
          <h2 className="headline-sm" style={{ color: 'var(--primary)', margin: 0 }}>LFTO Admin</h2>
        </div>

        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
                  backgroundColor: isActive ? 'var(--primary-container)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'background-color 0.2s, color 0.2s',
                }}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '24px 16px', borderTop: '1px solid var(--outline-variant)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--on-surface-variant)',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-container-highest)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft size={20} />
            Back to Site
          </Link>
          
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              color: 'var(--error)',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(186, 26, 26, 0.08)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
