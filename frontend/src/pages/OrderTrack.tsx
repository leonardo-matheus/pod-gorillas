import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Check, Clock, CheckCircle, Package, Truck, RefreshCw, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService, Order } from '../services/api';

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  pending: { label: 'Aguardando pagamento', icon: Clock, color: 'text-yellow-500' },
  confirmed: { label: 'Confirmado', icon: CheckCircle, color: 'text-gorilla-500' },
  paid: { label: 'Pago', icon: CheckCircle, color: 'text-gorilla-500' },
  preparing: { label: 'Preparando', icon: Package, color: 'text-blue-500' },
  ready: { label: 'Pronto para retirada', icon: Package, color: 'text-purple-500' },
  shipped: { label: 'Saiu para entrega', icon: Truck, color: 'text-purple-500' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-gorilla-500' },
};

export default function OrderTrack() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  const loadOrder = async () => {
    if (!orderNumber) return;
    try {
      const data = await apiService.trackOrder(orderNumber);
      setOrder(data);
    } catch {
      toast.error('Pedido não encontrado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderNumber]);

  const copyPix = () => {
    if (order?.pixCode) {
      navigator.clipboard.writeText(order.pixCode);
      setCopied(true);
      toast.success('Código copiado!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const checkPayment = async () => {
    setChecking(true);
    await loadOrder();
    setChecking(false);
    if (order?.status !== 'pending') {
      toast.success('Pagamento confirmado!');
    } else {
      toast('Aguardando pagamento...', { icon: '⏳' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-gorilla-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-dark-400 mb-4">Pedido não encontrado</p>
        <Link to="/" className="btn-primary">Voltar ao início</Link>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const isPending = order.status === 'pending';

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="card p-6 text-center">
        {/* Status */}
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-dark-800 flex items-center justify-center ${status.color}`}>
          <StatusIcon className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold mb-1">{status.label}</h1>
        <p className="text-dark-400 mb-6">
          Pedido <span className="text-white font-semibold">{order.orderNumber}</span>
        </p>

        {/* PIX Payment */}
        {isPending && order.pixQrCode && (
          <div className="mb-6">
            <div className="bg-white p-4 rounded-2xl inline-block mb-4">
              <img
                src={`data:image/png;base64,${order.pixQrCode}`}
                alt="QR Code PIX"
                className="w-48 h-48"
              />
            </div>

            <p className="text-3xl font-bold text-gorilla-500 mb-4">
              R$ {order.total.toFixed(2).replace('.', ',')}
            </p>

            {order.pixCode && (
              <div className="mb-4">
                <p className="text-xs text-dark-400 mb-2">Copia e Cola</p>
                <div className="relative">
                  <input
                    type="text"
                    value={order.pixCode}
                    readOnly
                    className="input text-center text-xs pr-12"
                  />
                  <button
                    onClick={copyPix}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-dark-700 rounded-lg"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-gorilla-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-dark-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={checkPayment}
              disabled={checking}
              className="btn-primary w-full py-4"
            >
              {checking ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Já paguei
                </>
              )}
            </button>
          </div>
        )}

        {/* Order Success */}
        {!isPending && (
          <div className="mb-6">
            <p className="text-lg mb-4">
              Total: <span className="font-bold text-gorilla-500">R$ {order.total.toFixed(2).replace('.', ',')}</span>
            </p>

            {order.cashbackEarned && order.cashbackEarned > 0 && (
              <p className="text-sm text-gorilla-400 mb-4">
                +R$ {order.cashbackEarned.toFixed(2).replace('.', ',')} de cashback creditado!
              </p>
            )}
          </div>
        )}

        {/* Items */}
        <div className="text-left mt-6 pt-6 border-t border-dark-800">
          <p className="font-semibold mb-3">Itens do pedido</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between py-2 text-sm">
              <span className="text-dark-300">{item.quantity}x {item.name} ({item.flavor})</span>
              <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-dark-800 space-y-3">
          <a
            href="https://wa.me/5516999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full py-3"
          >
            <MessageCircle className="w-5 h-5" />
            Falar no WhatsApp
          </a>

          <Link to="/" className="btn-ghost w-full py-3">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
