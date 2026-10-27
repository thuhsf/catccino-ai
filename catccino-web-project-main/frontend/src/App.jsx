import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Menu from "./pages/Menu.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Kitchen from "./pages/Kitchen.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";
import { SECRET_ADMIN_PATH } from "./constants.js";

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 py-8 pb-24">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/pedidos/:orderId" element={<OrderDetail />} />
          <Route path="/cozinha" element={<Kitchen />} />
          <Route path={SECRET_ADMIN_PATH} element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="px-5 pb-8 text-center text-xs text-ink-soft">
        Catccino · projeto acadêmico · frontend React consumindo os microsserviços via API Gateway
        (nginx)
      </footer>
    </div>
  );
}
