import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Boxes, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuthStore();

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
    { path: '/admin/produtos', icon: Package, label: 'Produtos' },
    { path: '/admin/estoque', icon: Boxes, label: 'Estoque' },
    { path: '/admin/config', icon: Settings, label: 'Config' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  if (!user || !isAdmin()) return null;

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-dark-900 border-r border-dark-800 hidden md:flex flex-col">
        <div className="p-4 border-b border-dark-800">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="Pod Gorillas" className="w-10 h-10" />
            <div>
              <span className="font-bold">Gorillas</span>
              <p className="text-xs text-gorilla-500">Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  active
                    ? 'bg-gorilla-500/20 text-gorilla-400'
                    : 'text-dark-400 hover:bg-dark-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-dark-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-dark-400 hover:bg-dark-800 hover:text-white rounded-xl transition">
            <ArrowLeft className="w-5 h-5" />
            Voltar à loja
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-400/10 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 glass z-40 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="w-8 h-8" />
          <span className="font-bold">Admin</span>
        </Link>
        <button onClick={handleLogout} className="p-2 text-red-400">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass z-40 flex items-center justify-around safe-bottom">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center h-full px-3 ${
                active ? 'text-gorilla-500' : 'text-dark-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main */}
      <main className="flex-1 pt-14 pb-16 md:pt-0 md:pb-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
