import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService, Settings } from '../../services/api';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiService.getAdminSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev!,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await apiService.updateSettings(settings);
      toast.success('Configurações salvas');
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="h-64 bg-dark-800 rounded-2xl shimmer" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-4">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Salvar
        </button>
      </div>

      <div className="space-y-6 max-w-xl">
        {/* Store Info */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Informações da Loja</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Loja</label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName || ''}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp</label>
              <input
                type="text"
                name="storeWhatsApp"
                value={settings.storeWhatsApp || ''}
                onChange={handleChange}
                className="input"
                placeholder="5516999999999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <input
                type="text"
                name="storeInstagram"
                value={settings.storeInstagram || ''}
                onChange={handleChange}
                className="input"
                placeholder="pod.gorillas"
              />
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Entrega</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cidade de entrega</label>
              <input
                type="text"
                name="deliveryCity"
                value={settings.deliveryCity || ''}
                onChange={handleChange}
                className="input"
                placeholder="Matão"
              />
              <p className="text-xs text-dark-400 mt-1">
                Apenas essa cidade terá entrega disponível
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Taxa de entrega (R$)</label>
              <input
                type="number"
                name="deliveryFee"
                value={settings.deliveryFee || 10}
                onChange={handleChange}
                className="input"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Cashback */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Cashback</h2>
          <div>
            <label className="block text-sm font-medium mb-2">% de cashback para clientes cadastrados</label>
            <input
              type="number"
              name="cashbackPercent"
              value={settings.cashbackPercent || 3}
              onChange={handleChange}
              className="input"
              step="0.5"
              min="0"
              max="20"
            />
            <p className="text-xs text-dark-400 mt-1">
              Creditado após confirmação do pedido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
