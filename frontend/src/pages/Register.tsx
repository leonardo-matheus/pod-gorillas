import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Gift, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import { useAuthStore } from '../hooks/useAuthStore';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    lgpdAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7,11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone') {
      setForm({ ...form, phone: formatPhone(value) });
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.lgpdAccepted) {
      toast.error('Aceite os termos para continuar');
      return;
    }

    setLoading(true);

    try {
      const data = await apiService.register({
        name: form.name,
        phone: form.phone.replace(/\D/g, ''),
        email: form.email || undefined,
        password: form.password,
        lgpdAccepted: 'true',
      });
      setAuth(data.user, data.token);
      toast.success('Conta criada!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <img src="/logo.svg" alt="Pod Gorillas" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="text-dark-400 mt-2">
            Já tem conta?{' '}
            <Link to="/login" className="text-gorilla-500 hover:underline">Entrar</Link>
          </p>
        </div>

        {/* Benefit */}
        <div className="card p-4 mb-6 bg-gorilla-500/10 border-gorilla-500/20">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-gorilla-500" />
            <div>
              <p className="font-semibold">Ganhe 3% de cashback</p>
              <p className="text-sm text-dark-400">Em todas as compras</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input"
              placeholder="Seu nome"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="input"
              placeholder="(16) 99999-9999"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">E-mail (opcional)</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input pr-12"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
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

          {/* LGPD */}
          <div className="p-4 bg-dark-800 rounded-2xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="lgpdAccepted"
                checked={form.lgpdAccepted}
                onChange={handleChange}
                className="w-5 h-5 rounded border-dark-600 bg-dark-700 text-gorilla-500 mt-0.5"
              />
              <div>
                <p className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gorilla-500" />
                  Aceito os termos
                </p>
                <p className="text-xs text-dark-400 mt-1">
                  Li e aceito a Política de Privacidade (LGPD) e confirmo que sou maior de 18 anos.
                </p>
              </div>
            </label>
          </div>

          <button type="submit" disabled={loading || !form.lgpdAccepted} className="btn-primary w-full py-4">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
