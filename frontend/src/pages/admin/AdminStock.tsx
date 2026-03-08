import { useEffect, useState } from 'react';
import { Minus, Plus, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api';

interface StockItem {
  id: string;
  flavor: string;
  quantity: number;
  product: { id: string; name: string; images: string };
}

export default function AdminStock() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const data = await apiService.getAdminStock();
      setStock(data);
    } catch {
      toast.error('Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (item: StockItem, newQty: number) => {
    if (newQty < 0) return;

    try {
      await apiService.updateStock(item.id, newQty);
      toast.success('Estoque atualizado');
      loadStock();
    } catch {
      toast.error('Erro ao atualizar');
    }
  };

  const lowStockItems = stock.filter((s) => s.quantity <= 2);
  const normalItems = stock.filter((s) => s.quantity > 2);

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
      <h1 className="text-2xl font-bold mb-6">Estoque</h1>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="card p-4 mb-6 bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="font-semibold text-yellow-200">Estoque Baixo</p>
              <p className="text-sm text-yellow-300/70">{lowStockItems.length} itens precisam de reposição</p>
            </div>
          </div>

          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-dark-900/50 rounded-xl p-3">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-dark-400">{item.flavor}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateStock(item, item.quantity - 1)}
                    className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className={`min-w-[3rem] text-center font-bold ${
                    item.quantity === 0 ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateStock(item, item.quantity + 1)}
                    className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => updateStock(item, item.quantity + 5)}
                    className="btn-primary py-2 px-3 text-sm"
                  >
                    +5
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Stock */}
      <div className="card">
        <div className="p-4 border-b border-dark-800">
          <h2 className="font-semibold">Todo o Estoque</h2>
        </div>

        <div className="divide-y divide-dark-800">
          {stock.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-dark-400">{item.flavor}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStock(item, item.quantity - 1)}
                  className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className={`min-w-[3rem] text-center font-bold ${
                  item.quantity === 0 ? 'text-red-500' :
                  item.quantity <= 2 ? 'text-yellow-500' :
                  'text-white'
                }`}>
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateStock(item, item.quantity + 1)}
                  className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
