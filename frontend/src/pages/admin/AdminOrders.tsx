import { useEffect, useState } from 'react';
import { Clock, CheckCircle, Package, Truck, Check, X, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  shippingCity?: string;
  items: any[];
}

const statusConfig: Record<string, { label: string; icon: any; color: string; next?: string }> = {
  pending: { label: 'Aguardando', icon: Clock, color: 'text-yellow-500', next: 'confirmed' },
  paid: { label: 'Pago', icon: CheckCircle, color: 'text-gorilla-500', next: 'confirmed' },
  confirmed: { label: 'Confirmado', icon: CheckCircle, color: 'text-gorilla-500', next: 'preparing' },
  preparing: { label: 'Preparando', icon: Package, color: 'text-blue-500', next: 'ready' },
  ready: { label: 'Pronto', icon: Package, color: 'text-purple-500', next: 'delivered' },
  shipped: { label: 'Enviado', icon: Truck, color: 'text-purple-500', next: 'delivered' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-gorilla-500' },
  cancelled: { label: 'Cancelado', icon: X, color: 'text-red-500' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      const data = await apiService.getAdminOrders({ status: filter || undefined });
      setOrders(data.orders);
    } catch {
      toast.error('Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await apiService.updateOrderStatus(orderId, status);
      toast.success('Status atualizado');
      loadOrders();
      setSelected(null);
    } catch {
      toast.error('Erro ao atualizar');
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-dark-800 rounded-2xl shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4">
        {[
          { value: '', label: 'Todos' },
          { value: 'pending', label: 'Aguardando' },
          { value: 'paid', label: 'Pagos' },
          { value: 'confirmed', label: 'Confirmados' },
          { value: 'preparing', label: 'Preparando' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              filter === f.value
                ? 'bg-gorilla-500 text-white'
                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="card p-8 text-center text-dark-400">
          Nenhum pedido
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                onClick={() => setSelected(order)}
                className="card p-4 cursor-pointer hover:border-dark-700 transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center ${status.color}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{order.orderNumber}</span>
                      <span className={`text-xs ${status.color}`}>{status.label}</span>
                    </div>
                    <p className="text-sm text-dark-400 truncate">
                      {order.customerName || order.customerPhone}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gorilla-500">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-xs text-dark-400">
                      {order.deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}
                    </p>
                  </div>
                </div>

                {status.next && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(order.id, status.next!);
                    }}
                    className="mt-4 btn-primary w-full py-2 text-sm"
                  >
                    <Check className="w-4 h-4" />
                    {status.next === 'confirmed' && 'Confirmar pedido'}
                    {status.next === 'preparing' && 'Iniciar preparo'}
                    {status.next === 'ready' && 'Marcar como pronto'}
                    {status.next === 'delivered' && 'Marcar entregue'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md max-h-[80vh] overflow-auto bg-dark-900 rounded-t-3xl md:rounded-3xl p-6 animate-slide-up">
            <h2 className="text-lg font-bold mb-4">Pedido {selected.orderNumber}</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-dark-400" />
                <div>
                  <p className="font-medium">{selected.customerName || 'Cliente'}</p>
                  <a href={`tel:${selected.customerPhone}`} className="text-sm text-gorilla-500">
                    {selected.customerPhone}
                  </a>
                </div>
              </div>

              {selected.deliveryType === 'delivery' && selected.shippingCity && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-dark-400" />
                  <p className="text-sm">{selected.shippingCity}</p>
                </div>
              )}
            </div>

            <div className="border-t border-dark-800 pt-4 mb-4">
              <p className="text-sm text-dark-400 mb-2">Itens</p>
              {selected.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="text-dark-400">{item.flavor}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-gorilla-500">R$ {selected.total.toFixed(2).replace('.', ',')}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1 py-3">
                Fechar
              </button>
              <a
                href={`https://wa.me/55${selected.customerPhone}`}
                target="_blank"
                className="btn-primary flex-1 py-3"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
