import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../hooks/useCartStore';
import { useAuthStore } from '../hooks/useAuthStore';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCartStore((state) => state.getItemCount());
  const { user, isAdmin, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 glass safe-top">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-192.png" alt="Pod Gorillas" className="w-10 h-10 rounded-xl" />
            <div className="hidden sm:block">
              <span className="font-bold text-lg">Gorillas</span>
              <span className="text-xs text-dark-400 block -mt-1">Matão</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/produtos" className="btn-ghost py-2 px-4 text-sm">
              Produtos
            </Link>
            {user && (
              <Link to="/pedido/acompanhar" className="btn-ghost py-2 px-4 text-sm">
                Meus Pedidos
              </Link>
            )}
            {isAdmin() && (
              <Link to="/admin" className="btn-ghost py-2 px-4 text-sm text-gorilla-400">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/carrinho"
              className="relative p-2.5 rounded-xl hover:bg-dark-800/50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gorilla-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to={user ? '/login' : '/login'}
              className="hidden md:flex p-2.5 rounded-xl hover:bg-dark-800/50 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2.5 rounded-xl hover:bg-dark-800/50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-dark-900 p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-dark-800 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              <Link to="/produtos" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start py-3">
                Produtos
              </Link>
              <Link to="/carrinho" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start py-3">
                Carrinho {cartCount > 0 && `(${cartCount})`}
              </Link>

              {user ? (
                <>
                  <div className="border-t border-dark-800 my-2" />
                  <div className="px-4 py-2">
                    <p className="text-sm text-dark-400">Logado como</p>
                    <p className="font-medium">{user.name || user.phone}</p>
                    {user.cashback > 0 && (
                      <p className="text-sm text-gorilla-400">
                        Cashback: R$ {user.cashback.toFixed(2).replace('.', ',')}
                      </p>
                    )}
                  </div>
                  {isAdmin() && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start py-3 text-gorilla-400">
                      Painel Admin
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-ghost justify-start py-3 text-red-400">
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-dark-800 my-2" />
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start py-3">
                    Entrar
                  </Link>
                  <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="btn-primary py-3">
                    Criar conta
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
