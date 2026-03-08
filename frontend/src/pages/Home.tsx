import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { apiService, Product } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getProducts({ featured: true }).then((data) => {
      setProducts(data.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gorilla-900/20 via-dark-950 to-dark-950" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-gorilla-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gorilla-500/10 border border-gorilla-500/20 text-gorilla-400 text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Novidades toda semana
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 animate-fade-in">
              PODs <span className="gradient-text">Premium</span>
              <br />em Matão
            </h1>

            <p className="text-dark-400 text-lg md:text-xl max-w-xl mx-auto mb-8 animate-fade-in">
              Entrega rápida na cidade. Pagamento fácil via PIX.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/produtos" className="btn-primary text-lg px-8 py-4">
                Ver Produtos
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/5516996152900"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg px-8 py-4"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-6 border-y border-dark-800/50 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gorilla-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gorilla-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Matão - SP</p>
                <p className="text-xs text-dark-400">Entrega R$10</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gorilla-500/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-gorilla-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Entrega Rápida</p>
                <p className="text-xs text-dark-400">Ou retire grátis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Destaques</h2>
            <Link to="/produtos" className="text-gorilla-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card shimmer">
                  <div className="aspect-square bg-dark-800" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-dark-800 rounded w-3/4" />
                    <div className="h-4 bg-dark-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 8).map((product, i) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="py-10 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="card p-8 md:p-10 text-center bg-gradient-to-br from-gorilla-900/30 to-dark-900">
            <MessageCircle className="w-12 h-12 text-gorilla-500 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">Atendimento rápido</h2>
            <p className="text-dark-400 mb-6">
              Dúvidas? Chama no WhatsApp que a gente te ajuda!
            </p>
            <a
              href="https://wa.me/5516996152900"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex px-8 py-4"
            >
              <MessageCircle className="w-5 h-5" />
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
