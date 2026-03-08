import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { apiService, Order } from '../services/api';
import { useAuthStore } from '../hooks/useAuthStore';

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  pending: { label: 'Aguardando pagamento', icon: Clock, color: 'text-yellow-500' },
  paid: { label: 'Pago', icon: CheckCircle, color: 'text-gorilla-500' },
  processing: { label: 'Em produção', icon: Package, color: 'text-blue-500' },
  shipped: { label: 'Enviado', icon: Truck, color: 'text-purple-500' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-gorilla-500' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'text-red-500' },
};

export default function MyOrders() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    apiService.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-6 bg-dark-800 rounded w-1/3 mb-2" />
              <div className="h-4 bg-dark-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Minha Conta</h1>
          <p className="text-dark-400">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary py-2 px-4">
          Sair
        </button>
      </div>

      {/* Orders */}
      <h2 className="text-lg font-semibold mb-4">Meus Pedidos</h2>

      {orders.length === 0 ? (
        <div className="card p-8 text-center">
          <Package className="w-12 h-12 text-dark-500 mx-auto mb-4" />
          <p className="text-dark-400 mb-4">Você ainda não fez nenhum pedido</p>
          <Link to="/produtos" className="btn-primary">
            Ver Produtos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <Link
                key={order.id}
                to={`/pedido/confirmacao?order=${order.orderNumber}`}
                className="card p-4 flex items-center gap-4 hover:border-dark-700 transition"
              >
                <div className={`w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center ${status.color}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{order.orderNumber}</span>
                    <span className={`badge ${status.color} bg-dark-800`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-dark-400">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} •{' '}
                    {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gorilla-500">
                    R$ {order.total.toFixed(2).replace('.', ',')}
                  </p>
                  <ChevronRight className="w-5 h-5 text-dark-500 ml-auto" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* WhatsApp CTA */}
      <div className="mt-8 card p-6 bg-gradient-to-r from-gorilla-900/50 to-dark-900">
        <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
        <p className="text-dark-400 text-sm mb-4">
          Fale com a gente pelo WhatsApp para tirar dúvidas sobre seus pedidos.
        </p>
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary py-2"
        >
          Chamar no WhatsApp
        </a>
      </div>
    </div>
  );
}
