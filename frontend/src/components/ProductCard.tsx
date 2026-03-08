import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Product } from '../services/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasStock = product.totalStock > 0;
  const mainImage = product.images?.default || Object.values(product.images || {})[0] || '/products/v400-mix.png';

  // Products with transparent background images
  const hasTransparentBg = product.slug?.includes('elfbar') || product.slug?.includes('oxbar');

  return (
    <Link to={`/produto/${product.slug}`} className="card-hover group">
      <div className={`relative aspect-square overflow-hidden ${
        hasTransparentBg
          ? 'bg-gradient-to-br from-dark-800 via-dark-900 to-dark-950'
          : 'bg-dark-800'
      }`}>
        <img
          src={mainImage}
          alt={product.name}
          className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
            hasTransparentBg ? 'object-contain p-4' : 'object-cover'
          }`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/products/v400-mix.png';
          }}
        />

        {product.puffs && (
          <span className="absolute top-2 left-2 badge bg-dark-900/80 backdrop-blur text-white border-0">
            <Zap className="w-3 h-3 mr-1" />
            {product.puffs >= 1000 ? `${product.puffs / 1000}K` : product.puffs}
          </span>
        )}

        {!hasStock && (
          <div className="absolute inset-0 bg-dark-950/80 flex items-center justify-center">
            <span className="badge-error">Esgotado</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-gorilla-400 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-dark-400 mb-2">
          {product.flavors?.length || 0} sabores
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gorilla-500">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>
    </Link>
  );
}
