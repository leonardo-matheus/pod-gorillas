import { Link } from 'react-router-dom';
import { CheckCircle, Package, MessageCircle } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="card p-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gorilla-500/20 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-gorilla-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h1>
        <p className="text-dark-400 mb-8">
          Seu pedido foi recebido e está sendo preparado.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-dark-800 rounded-xl">
            <Package className="w-8 h-8 text-gorilla-500" />
            <div className="text-left">
              <p className="font-semibold">Preparando seu pedido</p>
              <p className="text-sm text-dark-400">
                Você receberá o código de rastreio por WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-800 rounded-xl">
            <MessageCircle className="w-8 h-8 text-gorilla-500" />
            <div className="text-left">
              <p className="font-semibold">Dúvidas?</p>
              <p className="text-sm text-dark-400">
                Fale conosco pelo WhatsApp
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link to="/meus-pedidos" className="btn-primary w-full py-4">
            Ver meus pedidos
          </Link>
          <Link to="/" className="btn-secondary w-full py-4">
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
