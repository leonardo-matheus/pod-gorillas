import { useEffect, useState } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api';

interface Product {
  id: string;
  name: string;
  price: number;
  puffs?: number;
  images: string[];
  active: boolean;
  totalStock: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await apiService.getAdminProducts();
      setProducts(data);
    } catch {
      toast.error('Erro ao carregar');
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold mb-6">Produtos</h1>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="card p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-dark-800 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/64x64/1a1a2e/22c55e?text=POD'}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64/1a1a2e/22c55e?text=POD';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{product.name}</p>
                  {product.puffs && (
                    <span className="text-xs text-dark-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {product.puffs >= 1000 ? `${product.puffs / 1000}K` : product.puffs}
                    </span>
                  )}
                </div>
                <p className="text-gorilla-500 font-bold">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs ${product.active ? 'text-gorilla-400' : 'text-red-400'}`}>
                    {product.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs text-dark-500">•</span>
                  <span className={`text-xs ${product.totalStock <= 2 ? 'text-yellow-500' : 'text-dark-400'}`}>
                    {product.totalStock} em estoque
                  </span>
                </div>
              </div>

              <button className="p-2 hover:bg-dark-800 rounded-xl transition">
                {product.active ? (
                  <Eye className="w-5 h-5 text-dark-400" />
                ) : (
                  <EyeOff className="w-5 h-5 text-dark-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
