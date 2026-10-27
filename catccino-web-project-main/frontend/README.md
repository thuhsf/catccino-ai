# Catccino — Frontend

Frontend em React + Vite para o backend de microsserviços do Catccino.

## Stack

- Vite 8
- React 19 + React Router DOM 7
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Axios

## Como rodar

```bash
npm install
cp .env.example .env   # ajuste VITE_API_BASE_URL se o gateway não estiver em localhost
npm run dev
```

A aplicação sobe em **http://localhost:3000** — essa porta é proposital: é a única
origem liberada no CORS de cada serviço de backend (`services/*/config.json`).
Se você rodar em outra porta, adicione-a na lista `cors.origin` dos serviços.

## Build de produção

```bash
npm run build
npm run preview
```

## Funcionalidades

- **Cardápio** — categorias e produtos (`menu-service`)
- **Carrinho** — monta o pedido, cria em `order-service` e simula pagamento em `payment-service`
- **Login / Cadastro** — `auth-service` (que por sua vez cria o perfil em `customer-service`)
- **Meus pedidos** — lista pedidos do cliente e mostra uma timeline cruzando status do
  pedido, do ticket de preparo (`kitchen-service`) e das notificações (`notification-service`)
- **Cozinha** — painel simples para avançar o status dos tickets de preparo
