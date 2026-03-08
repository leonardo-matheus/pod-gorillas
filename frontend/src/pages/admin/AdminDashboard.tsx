import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, AlertTriangle, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { apiService } from '../../services/api';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  todayOrders: number;
  totalProducts: number;
  lowStockCount: number;
  totalRevenue: number;
  todayRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getAdminStats().then((data) => {
      setStats(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-dark-800 rounded-2xl shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gorilla-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-gorilla-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">R$ {(stats?.todayRevenue || 0).toFixed(0)}</p>
          <p className="text-xs text-dark-400">Vendas hoje</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats?.todayOrders || 0}</p>
          <p className="text-xs text-dark-400">Pedidos hoje</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats?.pendingOrders || 0}</p>
          <p className="text-xs text-dark-400">Pendentes</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats?.lowStockCount || 0}</p>
          <p className="text-xs text-dark-400">Estoque baixo</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/pedidos" className="card p-4 hover:border-gorilla-500/50 transition">
          <ShoppingCart className="w-6 h-6 text-gorilla-500 mb-2" />
          <p className="font-semibold">Ver Pedidos</p>
          <p className="text-xs text-dark-400">{stats?.pendingOrders} aguardando</p>
        </Link>

        <Link to="/admin/estoque" className="card p-4 hover:border-gorilla-500/50 transition">
          <Package className="w-6 h-6 text-gorilla-500 mb-2" />
          <p className="font-semibold">Estoque</p>
          <p className="text-xs text-dark-400">{stats?.lowStockCount} itens baixos</p>
        </Link>

        <Link to="/admin/produtos" className="card p-4 hover:border-gorilla-500/50 transition">
          <TrendingUp className="w-6 h-6 text-gorilla-500 mb-2" />
          <p className="font-semibold">Produtos</p>
          <p className="text-xs text-dark-400">{stats?.totalProducts} ativos</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="p-4 border-b border-dark-800">
          <h2 className="font-semibold">Pedidos Recentes</h2>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <div className="p-8 text-center text-dark-400">
            Nenhum pedido ainda
          </div>
        ) : (
          <div className="divide-y divide-dark-800">
            {stats?.recentOrders?.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                to="/admin/pedidos"
                className="flex items-center justify-between p-4 hover:bg-dark-800/50 transition"
              >
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-xs text-dark-400">{order.customerName || order.customerPhone}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gorilla-500">
                    R$ {order.total.toFixed(2).replace('.', ',')}
                  </p>
                  <p className={`text-xs ${
                    order.status === 'pending' ? 'text-yellow-500' :
                    order.status === 'paid' || order.status === 'confirmed' ? 'text-gorilla-500' :
                    'text-dark-400'
                  }`}>
                    {order.status === 'pending' ? 'Aguardando' :
                     order.status === 'paid' ? 'Pago' :
                     order.status === 'confirmed' ? 'Confirmado' :
                     order.status}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
