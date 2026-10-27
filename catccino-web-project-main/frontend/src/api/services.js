import { apiClient } from "./client.js";

export const menuApi = {
  listCategories: () => apiClient.get("/menu/categories").then((r) => r.data.categories ?? []),
  listProducts: () => apiClient.get("/menu/products").then((r) => r.data.products ?? []),

  createCategory: (data) =>
    apiClient.post("/menu/categories", data).then((r) => r.data.category),
  updateCategory: (id, data) =>
    apiClient.patch(`/menu/categories/${id}`, data).then((r) => r.data.category),
  deleteCategory: (id) => apiClient.delete(`/menu/categories/${id}`).then((r) => r.data.category),

  createProduct: ({ imgFile, ...fields }) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    if (imgFile) formData.append("img_file", imgFile);

    return apiClient
      .post("/menu/products", formData, { headers: { "Content-Type": undefined } })
      .then((r) => r.data.product);
  },
  updateProduct: (id, data) =>
    apiClient.patch(`/menu/products/${id}`, data).then((r) => r.data.product),
};

export const authApi = {
  register: (data) => apiClient.post("/auth/register", data).then((r) => r.data),
  login: (data) => apiClient.post("/auth/login", data).then((r) => r.data),
  me: () => apiClient.get("/auth/me").then((r) => r.data.customer),
};

export const orderApi = {
  create: (data) => apiClient.post("/order/orders", data).then((r) => r.data.order),
  get: (id) => apiClient.get(`/order/orders/${id}`).then((r) => r.data.order),
  listByCustomer: (customerId) =>
    apiClient.get(`/order/orders/customer/${customerId}`).then((r) => r.data.orders ?? []),
};

export const paymentApi = {
  create: (data) => apiClient.post("/payment/payments", data).then((r) => r.data.payment),
  process: (id, data) =>
    apiClient.patch(`/payment/payments/${id}/process`, data).then((r) => r.data.payment),
};

export const kitchenApi = {
  list: (status) =>
    apiClient
      .get("/kitchen/tickets", { params: status ? { status } : {} })
      .then((r) => r.data.tickets ?? []),
  advance: (id, action) =>
    apiClient.patch(`/kitchen/tickets/${id}/status`, { action }).then((r) => r.data.ticket),
};

export const notificationApi = {
  listByOrder: (orderId) =>
    apiClient
      .get(`/notification/notifications/order/${orderId}`)
      .then((r) => r.data.notifications ?? [])
      .catch(() => []),
};
