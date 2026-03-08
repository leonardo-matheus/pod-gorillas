import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, Store, CreditCard, Loader2, AlertCircle, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../hooks/useCartStore';
import { useAuthStore } from '../hooks/useAuthStore';
import { apiService, CepResult, Settings } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [cepResult, setCepResult] = useState<CepResult | null>(null);

  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    customerEmail: user?.email || '',
    deliveryType: 'delivery',
    shippingCep: '',
    shippingStreet: '',
    shippingNumber: '',
    shippingComp: '',
    shippingNeigh: '',
    shippingCity: '',
    shippingState: '',
    notes: '',
    useCashback: false,
    lgpdAccepted: false,
  });

  const subtotal = getSubtotal();
  const shipping = form.deliveryType === 'delivery' && cepResult?.isDeliveryAvailable
    ? (settings?.deliveryFee || 10)
    : 0;
  const cashbackToUse = form.useCashback && user?.cashback
    ? Math.min(user.cashback, subtotal * 0.1)
    : 0;
  const total = subtotal + shipping - cashbackToUse;
  const cashbackToEarn = isLoggedIn() ? (subtotal * (settings?.cashbackPercent || 3)) / 100 : 0;

  useEffect(() => {
    apiService.getSettings().then(setSettings).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7,11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setForm({ ...form, customerPhone: formatted });
  };

  const searchCep = async () => {
    const cep = form.shippingCep.replace(/\D/g, '');
    if (cep.length !== 8) {
      toast.error('CEP inválido');
      return;
    }

    setSearchingCep(true);
    try {
      const result = await apiService.searchCep(cep);
      setCepResult(result);
      setForm({
        ...form,
        shippingStreet: result.street,
        shippingNeigh: result.neighborhood,
        shippingCity: result.city,
        shippingState: result.state,
      });

      if (!result.isDeliveryAvailable) {
        setForm(f => ({ ...f, deliveryType: 'pickup' }));
        toast(result.deliveryMessage, { icon: '📍' });
      }
    } catch {
      toast.error('CEP não encontrado');
    } finally {
      setSearchingCep(false);
    }
  };

  const validatePhone = (phone: string) => {
    const nums = phone.replace(/\D/g, '');
    return nums.length >= 10 && nums.length <= 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(form.customerPhone)) {
      toast.error('Telefone inválido');
      return;
    }

    if (!form.lgpdAccepted) {
      toast.error('Aceite os termos para continuar');
      return;
    }

    if (form.deliveryType === 'delivery' && !cepResult?.isDeliveryAvailable) {
      toast.error('Entrega não disponível neste endereço');
      return;
    }

    setLoading(true);

    try {
      const order = await apiService.createOrder({
        ...form,
        customerPhone: form.customerPhone.replace(/\D/g, ''),
        items: items.map(i => ({
          productId: i.productId,
          flavor: i.flavor,
          quantity: i.quantity,
        })),
        useCashback: form.useCashback,
      });

      clearCart();
      navigate(`/pedido/${order.orderNumber}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-dark-400 mb-4">Carrinho vazio</p>
        <Link to="/produtos" className="btn-primary">Ver Produtos</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <Link to="/carrinho" className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <h1 className="text-2xl font-bold mb-6">Finalizar Pedido</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gorilla-500" />
            Seus dados
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Seu nome"
              className="input"
              required
            />

            <input
              type="tel"
              name="customerPhone"
              value={form.customerPhone}
              onChange={handlePhoneChange}
              placeholder="WhatsApp (16) 99999-9999"
              className="input"
              required
            />

            {!isLoggedIn() && (
              <p className="text-xs text-dark-400">
                <Link to="/cadastro" className="text-gorilla-500 hover:underline">Crie uma conta</Link> para ganhar {settings?.cashbackPercent || 3}% de cashback
              </p>
            )}
          </div>
        </div>

        {/* Delivery Type */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Entrega ou Retirada</h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, deliveryType: 'delivery' })}
              className={`p-4 rounded-2xl border-2 transition text-left ${
                form.deliveryType === 'delivery'
                  ? 'border-gorilla-500 bg-gorilla-500/10'
                  : 'border-dark-700 hover:border-dark-600'
              }`}
            >
              <Truck className={`w-6 h-6 mb-2 ${form.deliveryType === 'delivery' ? 'text-gorilla-500' : 'text-dark-400'}`} />
              <p className="font-semibold">Entrega</p>
              <p className="text-sm text-dark-400">R$ {(settings?.deliveryFee || 10).toFixed(2).replace('.', ',')}</p>
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, deliveryType: 'pickup' })}
              className={`p-4 rounded-2xl border-2 transition text-left ${
                form.deliveryType === 'pickup'
                  ? 'border-gorilla-500 bg-gorilla-500/10'
                  : 'border-dark-700 hover:border-dark-600'
              }`}
            >
              <Store className={`w-6 h-6 mb-2 ${form.deliveryType === 'pickup' ? 'text-gorilla-500' : 'text-dark-400'}`} />
              <p className="font-semibold">Retirar</p>
              <p className="text-sm text-dark-400">Grátis</p>
            </button>
          </div>
        </div>

        {/* Address (if delivery) */}
        {form.deliveryType === 'delivery' && (
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Endereço de entrega</h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="shippingCep"
                  value={form.shippingCep}
                  onChange={handleChange}
                  onBlur={searchCep}
                  placeholder="CEP"
                  maxLength={9}
                  className="input flex-1"
                  required
                />
                <button
                  type="button"
                  onClick={searchCep}
                  disabled={searchingCep}
                  className="btn-secondary px-4"
                >
                  {searchingCep ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar'}
                </button>
              </div>

              {cepResult && !cepResult.isDeliveryAvailable && (
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-200">Entrega não disponível em {cepResult.city}</p>
                    <p className="text-xs text-yellow-300/70">Apenas retirada em mãos (grátis)</p>
                  </div>
                </div>
              )}

              {cepResult?.isDeliveryAvailable && (
                <>
                  <input
                    type="text"
                    name="shippingStreet"
                    value={form.shippingStreet}
                    onChange={handleChange}
                    placeholder="Rua"
                    className="input"
                    required
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      name="shippingNumber"
                      value={form.shippingNumber}
                      onChange={handleChange}
                      placeholder="Número"
                      className="input"
                      required
                    />
                    <input
                      type="text"
                      name="shippingComp"
                      value={form.shippingComp}
                      onChange={handleChange}
                      placeholder="Compl."
                      className="input col-span-2"
                    />
                  </div>

                  <input
                    type="text"
                    name="shippingNeigh"
                    value={form.shippingNeigh}
                    onChange={handleChange}
                    placeholder="Bairro"
                    className="input"
                    required
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Cashback */}
        {isLoggedIn() && user!.cashback > 0 && (
          <div className="card p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="useCashback"
                checked={form.useCashback}
                onChange={handleChange}
                className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-gorilla-500"
              />
              <div>
                <p className="font-semibold flex items-center gap-2">
                  <Gift className="w-4 h-4 text-gorilla-500" />
                  Usar cashback
                </p>
                <p className="text-sm text-dark-400">
                  Você tem R$ {user!.cashback.toFixed(2).replace('.', ',')} disponível
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Summary */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gorilla-500" />
            Resumo
          </h2>

          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-dark-400">{item.quantity}x {item.name}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}

            <div className="border-t border-dark-800 pt-3">
              <div className="flex justify-between">
                <span className="text-dark-400">Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-dark-400">Entrega</span>
                <span className={shipping === 0 ? 'text-gorilla-500' : ''}>
                  {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                </span>
              </div>

              {cashbackToUse > 0 && (
                <div className="flex justify-between text-gorilla-400">
                  <span>Cashback</span>
                  <span>- R$ {cashbackToUse.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
            </div>

            <div className="border-t border-dark-800 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-gorilla-500">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>

              {cashbackToEarn > 0 && (
                <p className="text-xs text-gorilla-400 mt-1">
                  +R$ {cashbackToEarn.toFixed(2).replace('.', ',')} de cashback
                </p>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gorilla-500/10 border border-gorilla-500/20 mb-4">
            <p className="text-sm text-center">
              <strong>Pagamento via PIX</strong>
            </p>
          </div>

          {/* LGPD */}
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              name="lgpdAccepted"
              checked={form.lgpdAccepted}
              onChange={handleChange}
              className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-gorilla-500 mt-0.5"
              required
            />
            <span className="text-xs text-dark-400">
              Li e aceito a <Link to="/privacidade" target="_blank" className="text-gorilla-500 hover:underline">Política de Privacidade</Link> e os <Link to="/termos" target="_blank" className="text-gorilla-500 hover:underline">Termos de Uso</Link>. Confirmo que sou maior de 18 anos.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || (form.deliveryType === 'delivery' && !cepResult?.isDeliveryAvailable)}
            className="btn-primary w-full py-4 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              'Gerar PIX'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
