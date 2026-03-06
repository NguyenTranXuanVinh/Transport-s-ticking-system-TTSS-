export const API_BASE_URL = "http://localhost:5000/api";

export const searchTickets = async (params = {}) => {
  const res = await fetch(
    `${API_BASE_URL}/trips?${new URLSearchParams(params)}`,
  );
  return await res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return { status: res.status, data: await res.json() };
};

export const register = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return { status: res.status, data: await res.json() };
};

export const bookTicket = async (bookingData) => {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  return { status: res.status, data: await res.json() };
};

export const getUserBookings = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
  return await res.json();
};
