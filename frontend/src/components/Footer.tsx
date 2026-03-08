import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-dark-800/50 bg-dark-900/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-192.png" alt="Pod Gorillas" className="w-10 h-10 rounded-xl" />
            <div>
              <p className="font-bold">Pod Gorillas</p>
              <p className="text-xs text-dark-400">Matão - SP</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/pod.gorillas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="text-sm">@pod.gorillas</span>
            </a>
            <a
              href="https://wa.me/5516996152900"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-dark-400 hover:text-gorilla-400 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">(16) 99615-2900</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-dark-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-dark-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Venda proibida para menores de 18 anos. Imagens meramente ilustrativas.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
              <Link to="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            </div>
          </div>
          <p className="text-center text-dark-600 text-xs mt-4">
            Pod Gorillas {new Date().getFullYear()}. Este site utiliza cookies e armazena dados conforme a LGPD.
          </p>
        </div>
      </div>
    </footer>
  );
}
