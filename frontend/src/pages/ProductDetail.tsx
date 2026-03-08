import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, ArrowLeft, Check, Zap, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService, Product } from '../services/api';
import { useCartStore } from '../hooks/useCartStore';

// Flavor color mapping for visual effect
const flavorColors: Record<string, { bg: string; overlay: string }> = {
  'Banana Ice': { bg: 'from-yellow-500/30', overlay: 'bg-yellow-500/10' },
  'Strawberry Ice': { bg: 'from-red-400/30', overlay: 'bg-red-400/10' },
  'Strawberry Banana': { bg: 'from-pink-400/30', overlay: 'bg-pink-400/10' },
  'Grape': { bg: 'from-purple-500/30', overlay: 'bg-purple-500/10' },
  'Grape Paradise': { bg: 'from-purple-600/30', overlay: 'bg-purple-600/10' },
  'Menthol': { bg: 'from-cyan-400/30', overlay: 'bg-cyan-400/10' },
  'Mint': { bg: 'from-emerald-400/30', overlay: 'bg-emerald-400/10' },
  'Spring Mint': { bg: 'from-green-400/30', overlay: 'bg-green-400/10' },
  'Icy Mint': { bg: 'from-teal-300/30', overlay: 'bg-teal-300/10' },
  'Sakura Grape': { bg: 'from-pink-500/30', overlay: 'bg-pink-500/10' },
  'Lime Grape Fruit': { bg: 'from-lime-400/30', overlay: 'bg-lime-400/10' },
  'Guava Kiwi Passion Fruit': { bg: 'from-orange-400/30', overlay: 'bg-orange-400/10' },
  'Bubballo Tuti Fruti': { bg: 'from-fuchsia-400/30', overlay: 'bg-fuchsia-400/10' },
  'Cherry Strazz': { bg: 'from-rose-500/30', overlay: 'bg-rose-500/10' },
  'Dragon Strawnana': { bg: 'from-red-500/30', overlay: 'bg-red-500/10' },
  'Baja Splash': { bg: 'from-blue-400/30', overlay: 'bg-blue-400/10' },
  'Summer Splash': { bg: 'from-amber-400/30', overlay: 'bg-amber-400/10' },
  'Scary Berry': { bg: 'from-violet-500/30', overlay: 'bg-violet-500/10' },
  'Strawberry Banana Ice': { bg: 'from-pink-300/30', overlay: 'bg-pink-300/10' },
  'Cactus Lime Soda': { bg: 'from-lime-500/30', overlay: 'bg-lime-500/10' },
  'Strawberry Watermelon': { bg: 'from-rose-400/30', overlay: 'bg-rose-400/10' },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (slug) {
      apiService.getProduct(slug).then((data) => {
        setProduct(data);
        const firstAvailable = data.stock?.find(s => s.quantity > 0);
        if (firstAvailable) setSelectedFlavor(firstAvailable.flavor);
        else if (data.flavors?.length) setSelectedFlavor(data.flavors[0]);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [slug]);

  const getStock = (flavor: string) => {
    return product?.stock?.find(s => s.flavor === flavor)?.quantity || 0;
  };

  const currentStock = getStock(selectedFlavor);

  const handleAddToCart = () => {
    if (!product || !selectedFlavor) return;

    if (currentStock < quantity) {
      toast.error('Quantidade indisponível');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[selectedFlavor] || product.images?.default || '',
      flavor: selectedFlavor,
      quantity,
    });

    toast.success('Adicionado ao carrinho!');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-dark-800 rounded-3xl shimmer" />
          <div className="space-y-4">
            <div className="h-8 bg-dark-800 rounded w-3/4 shimmer" />
            <div className="h-6 bg-dark-800 rounded w-1/2 shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-dark-400 mb-4">Produto não encontrado</p>
        <Link to="/produtos" className="btn-primary">Ver produtos</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <Link to="/produtos" className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image with flavor color overlay */}
        <div className="relative aspect-square bg-dark-900 rounded-3xl overflow-hidden group">
          <img
            src={product.images?.[selectedFlavor] || product.images?.default || Object.values(product.images || {})[0] || '/products/v400-mix.png'}
            alt={`${product.name} - ${selectedFlavor}`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/products/v400-mix.png';
            }}
          />
          {/* Flavor color overlay */}
          <div
            className={`absolute inset-0 transition-all duration-300 pointer-events-none ${
              flavorColors[selectedFlavor]?.overlay || 'bg-gorilla-500/5'
            }`}
          />
          {/* Gradient bottom */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${
              flavorColors[selectedFlavor]?.bg || 'from-gorilla-500/20'
            } to-transparent transition-all duration-300`}
          />
          {/* Flavor label on image */}
          {selectedFlavor && (
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-4 py-2 bg-dark-900/80 backdrop-blur-sm rounded-xl text-sm font-medium border border-white/10">
                {selectedFlavor}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.puffs && (
              <span className="badge bg-gorilla-500/20 text-gorilla-400 border border-gorilla-500/30">
                <Zap className="w-3 h-3 mr-1" />
                {product.puffs >= 1000 ? `${product.puffs / 1000}K puffs` : `${product.puffs} puffs`}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

          <p className="text-3xl font-bold text-gorilla-500 mb-6">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>

          <p className="text-dark-300 mb-8 leading-relaxed">{product.description}</p>

          {/* Flavor Selection */}
          <div className="mb-6">
            <p className="font-semibold mb-3">Sabor</p>
            <div className="flex flex-wrap gap-2">
              {product.flavors?.map((flavor) => {
                const stock = getStock(flavor);
                const isSelected = selectedFlavor === flavor;
                const outOfStock = stock === 0;
                const colorClass = flavorColors[flavor]?.bg.replace('from-', '').replace('/30', '') || 'gorilla-500';

                return (
                  <button
                    key={flavor}
                    onClick={() => !outOfStock && setSelectedFlavor(flavor)}
                    disabled={outOfStock}
                    className={`relative px-4 py-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-gorilla-500 bg-gorilla-500/20 text-white ring-2 ring-gorilla-500/50'
                        : outOfStock
                        ? 'border-dark-800 text-dark-600 cursor-not-allowed opacity-50'
                        : 'border-dark-700 text-dark-300 hover:border-dark-500 hover:bg-dark-800/50'
                    }`}
                  >
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${flavorColors[flavor]?.overlay.replace('/10', '/60') || 'bg-gorilla-500/60'}`} />
                    <span className={outOfStock ? 'line-through' : ''}>{flavor}</span>
                    {!outOfStock && stock <= 2 && (
                      <span className="ml-2 text-xs text-yellow-500">({stock})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Info */}
          {selectedFlavor && (
            <div className="mb-6">
              {currentStock > 0 ? (
                <p className="text-gorilla-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {currentStock} {currentStock === 1 ? 'unidade' : 'unidades'} em estoque
                </p>
              ) : (
                <p className="text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Sabor esgotado
                </p>
              )}
            </div>
          )}

          {/* Quantity & Add */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-dark-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-4 hover:bg-dark-800 transition"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="px-6 font-bold text-lg min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                className="p-4 hover:bg-dark-800 transition"
                disabled={quantity >= currentStock}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={currentStock === 0}
              className="btn-primary flex-1 py-4 text-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
