import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Copy, Check, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService, Order } from '../services/api';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      apiService.getOrder(orderNumber).then((data) => {
        setOrder(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [orderNumber]);

  const copyPix = () => {
    if (order?.pixCode) {
      navigator.clipboard.writeText(order.pixCode);
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const checkPayment = async () => {
    if (!order) return;

    setChecking(true);
    try {
      const status = await apiService.checkPaymentStatus(order.id);
      if (status.status === 'paid') {
        toast.success('Pagamento confirmado!');
        window.location.href = '/pedido/sucesso';
      } else {
        toast('Aguardando pagamento...', { icon: '⏳' });
      }
    } catch {
      toast.error('Erro ao verificar pagamento');
    } finally {
      setChecking(false);
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
        <Link to="/" className="btn-primary">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="card p-6 text-center">
        {/* Status */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Aguardando Pagamento</h1>
        <p className="text-dark-400 mb-6">
          Pedido <span className="text-white font-semibold">{order.orderNumber}</span>
        </p>

        {/* QR Code */}
        {order.pixQrCode && (
          <div className="bg-white p-4 rounded-xl inline-block mb-6">
            <img
              src={`data:image/png;base64,${order.pixQrCode}`}
              alt="QR Code PIX"
              className="w-48 h-48"
            />
          </div>
        )}

        {/* Total */}
        <p className="text-3xl font-bold text-gorilla-500 mb-6">
          R$ {order.total.toFixed(2).replace('.', ',')}
        </p>

        {/* PIX Code */}
        {order.pixCode && (
          <div className="mb-6">
            <p className="text-sm text-dark-400 mb-2">Código PIX Copia e Cola</p>
            <div className="relative">
              <input
                type="text"
                value={order.pixCode}
                readOnly
                className="input pr-12 text-center text-sm"
              />
              <button
                onClick={copyPix}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-gorilla-500" />
                ) : (
                  <Copy className="w-5 h-5 text-dark-400" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
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
                Já paguei, verificar
              </>
            )}
          </button>

          <Link to="/" className="btn-secondary w-full py-4">
            Voltar ao início
          </Link>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-dark-800 rounded-xl text-left">
          <p className="font-semibold mb-2">Como pagar:</p>
          <ol className="text-sm text-dark-300 space-y-2">
            <li>1. Abra o app do seu banco</li>
            <li>2. Escolha pagar com PIX</li>
            <li>3. Escaneie o QR Code ou cole o código</li>
            <li>4. Confirme o pagamento</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
