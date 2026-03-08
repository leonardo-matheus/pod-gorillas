import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import { useAuthStore } from '../hooks/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth, user, logout } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7,11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiService.login(phone, password);
      setAuth(data.user, data.token);
      toast.success('Login realizado!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="card p-8">
          <img src="/logo.svg" alt="Pod Gorillas" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Olá, {user.name || 'Cliente'}!</h1>
          <p className="text-dark-400 mb-4">{user.phone}</p>

          {user.cashback > 0 && (
            <div className="p-4 bg-gorilla-500/10 border border-gorilla-500/20 rounded-2xl mb-6">
              <p className="text-sm text-dark-400">Seu cashback</p>
              <p className="text-2xl font-bold text-gorilla-500">
                R$ {user.cashback.toFixed(2).replace('.', ',')}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link to="/produtos" className="btn-primary w-full py-3">
              Ver Produtos
            </Link>
            <button onClick={logout} className="btn-ghost w-full py-3 text-red-400">
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Pod Gorillas" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="text-dark-400 mt-2">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-gorilla-500 hover:underline">Criar conta</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className="input"
              placeholder="(16) 99999-9999"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-12"
                placeholder="Sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
