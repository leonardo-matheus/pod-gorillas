import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';

export default function Cart() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-dark-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Carrinho vazio</h1>
        <p className="text-dark-400 mb-8">Adicione produtos para continuar</p>
        <Link to="/produtos" className="btn-primary">
          Ver Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Carrinho</h1>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-dark-800 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={item.image || 'https://via.placeholder.com/80x80/1a1a2e/22c55e?text=POD'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80/1a1a2e/22c55e?text=POD';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-dark-400 text-sm">{item.flavor}</p>
                <p className="text-gorilla-500 font-bold mt-1">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-800">
              <div className="flex items-center border border-dark-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2.5 hover:bg-dark-800 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2.5 hover:bg-dark-800 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex justify-between mb-4">
          <span className="text-dark-400">Subtotal</span>
          <span className="font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>

        <p className="text-xs text-dark-500 mb-4">
          Frete calculado no checkout
        </p>

        <Link to="/checkout" className="btn-primary w-full py-4 text-lg">
          Finalizar Compra
          <ArrowRight className="w-5 h-5" />
        </Link>

        <Link to="/produtos" className="block text-center text-dark-400 hover:text-white mt-4 transition text-sm">
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
