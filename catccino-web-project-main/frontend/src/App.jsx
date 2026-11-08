import { Routes, Route, Navigate } from "react-router-dom";
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
import Cardapio from "./pages/Cardapio.jsx";
import Adocao from "./pages/Adocao.jsx";
import RecuperarSenha from "./pages/RecuperarSenha.jsx";
import FormularioAdocao from "./pages/FormularioAdocao.jsx";
import Pagamento from "./pages/Pagamento.jsx";
import Perfil from "./pages/Perfil.jsx";

import { SECRET_ADMIN_PATH } from "./constants.js";
import { ChatWidget } from "./components/ChatWidget.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 py-8 pb-24">
        <Routes>
          {/* A rota raiz redireciona para o Login */}
          <Route path="/" element={<Navigate to="/menu" replace />} />
          
          {/* Rotas normais */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/cardapio" element={<Cardapio />} />
          <Route path="/adocao" element={<Adocao />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/pedidos/:orderId" element={<OrderDetail />} />
          <Route path="/cozinha" element={<Kitchen />} />
          <Route path="/adocao/:id" element={<FormularioAdocao />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/perfil" element={<Perfil />} />

          <Route path={SECRET_ADMIN_PATH} element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="px-5 pb-8 text-center text-xs text-ink-soft">
        Catccino · projeto acadêmico · frontend React consumindo os microsserviços via API Gateway
        (nginx)
      </footer>

      <ChatWidget /> 
    </div>
  );
}