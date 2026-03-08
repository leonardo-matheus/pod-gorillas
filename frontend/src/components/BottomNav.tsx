import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { useAuthStore } from '../hooks/useAuthStore';

export default function BottomNav() {
  const location = useLocation();
  const cartCount = useCartStore((state) => state.getItemCount());
  const { user } = useAuthStore();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const items = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/produtos', icon: Grid, label: 'Produtos' },
    { path: '/carrinho', icon: ShoppingBag, label: 'Carrinho', badge: cartCount },
    { path: user ? '/login' : '/login', icon: User, label: user ? 'Conta' : 'Entrar' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass md:hidden safe-bottom z-40">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                active ? 'text-gorilla-500' : 'text-dark-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-gorilla-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gorilla-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
