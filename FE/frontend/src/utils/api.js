export const API_BASE_URL = "http://localhost:5000/api";

const postJSON = (url, body) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const searchTickets = async (params = {}) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/trips?${new URLSearchParams(params)}`,
    );
    return await res.json();
  } catch (err) {
    console.error("Error fetching tickets:", err);
    return [];
  }
};

export const login = async (email, password) => {
  try {
    const res = await postJSON(`${API_BASE_URL}/login`, { email, password });
    return { status: res.status, data: await res.json() };
  } catch (err) {
    console.error("Error logging in:", err);
    return { status: 500, data: { message: "Lỗi kết nối máy chủ" } };
  }
};

export const register = async (userData) => {
  try {
    const res = await postJSON(`${API_BASE_URL}/register`, userData);
    return { status: res.status, data: await res.json() };
  } catch (err) {
    console.error("Error registering:", err);
    return { status: 500, data: { message: "Lỗi kết nối máy chủ" } };
  }
};

export const bookTicket = async (bookingData) => {
  try {
    const res = await postJSON(`${API_BASE_URL}/bookings`, bookingData);
    return { status: res.status, data: await res.json() };
  } catch (err) {
    console.error("Error booking ticket:", err);
    return { status: 500, data: { error: "Lỗi kết nối server" } };
  }
};

export const getUserBookings = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
};
