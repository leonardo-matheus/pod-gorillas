import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import AgeGate from './components/AgeGate';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTrack from './pages/OrderTrack';
import Login from './pages/Login';
import Register from './pages/Register';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Admin from './pages/admin/Admin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminStock from './pages/admin/AdminStock';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  const [isAdult, setIsAdult] = useState<boolean | null>(null);

  useEffect(() => {
    const verified = localStorage.getItem('gorillas_18');
    setIsAdult(verified === 'true');
  }, []);

  const handleAgeConfirm = () => {
    localStorage.setItem('gorillas_18', 'true');
    setIsAdult(true);
  };

  const handleAgeDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  if (isAdult === null) return null;

  if (!isAdult) {
    return <AgeGate onConfirm={handleAgeConfirm} onDeny={handleAgeDeny} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="produtos" element={<Products />} />
        <Route path="produto/:slug" element={<ProductDetail />} />
        <Route path="carrinho" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pedido/:orderNumber" element={<OrderTrack />} />
        <Route path="login" element={<Login />} />
        <Route path="cadastro" element={<Register />} />
        <Route path="termos" element={<Terms />} />
        <Route path="privacidade" element={<Privacy />} />
      </Route>
      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminDashboard />} />
        <Route path="pedidos" element={<AdminOrders />} />
        <Route path="produtos" element={<AdminProducts />} />
        <Route path="estoque" element={<AdminStock />} />
        <Route path="config" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
